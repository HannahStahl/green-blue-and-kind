import React, { useState, useEffect } from 'react';
import config from '../config';

export default function Product(props) {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const productId = props.match.params.id;
    const promises = [
      fetch(`${config.apiURL}/product/${productId}`).then(res => res.json()),
      fetch(`${config.apiURL}/productsToPhotos/${productId}`).then(res => res.json()),
      fetch(`${config.apiURL}/photos`).then(res => res.json()),
      fetch(`${config.apiURL}/productsToTags/${productId}`).then(res => res.json()),
      fetch(`${config.apiURL}/tags`).then(res => res.json()),
      fetch(`${config.apiURL}/productsToSizes/${productId}`).then(res => res.json()),
      fetch(`${config.apiURL}/sizes`).then(res => res.json()),
      fetch(`${config.apiURL}/productsToColors/${productId}`).then(res => res.json()),
      fetch(`${config.apiURL}/colors`).then(res => res.json()),
    ];
    Promise.all(promises).then((results) => {
      const [
        product, productsToPhotos, photos, productsToTags, tags, productsToSizes, sizes, productsToColors, colors,
      ] = results;
      const photoIds = productsToPhotos
        .filter(productToPhoto => productToPhoto.productId === product.productId)
        .map(productToPhoto => productToPhoto.photoId);
      product.productPhotos = photos.filter(photo => photoIds.includes(photo.photoId));
      const tagIds = productsToTags
        .filter(productToTag => productToTag.productId === product.productId)
        .map(productToTag => productToTag.tagId);
      product.productTagIds = tags.map(tag => tag.tagId).filter(tagId => tagIds.includes(tagId));
      const sizeIds = productsToSizes
        .filter(productToSize => productToSize.productId === product.productId)
        .map(productToSize => productToSize.sizeId);
      product.productSizeIds = sizes.map(size => size.sizeId).filter(sizeId => sizeIds.includes(sizeId));
      const colorIds = productsToColors
        .filter(productToColor => productToColor.productId === product.productId)
        .map(productToColor => productToColor.colorId);
      product.productColorIds = colors.map(color => color.colorId).filter(colorId => colorIds.includes(colorId));
      setProduct(product);
      setLoading(false);
    });
  }, [props.match.params.id]);
  return !loading && (
    <div className="page-content product-page">
      <div className="product-info">
        <div className="product-photos">
          {product.productPhotos.map(photo => (
            <img src={`${config.cloudfrontURL}/${photo.photoName}`} alt={photo.photoName} className="product-photo" />
          ))}
        </div>
        <div className="product-details">
          <h1>{product.productName}</h1>
          <div className="product-price">
            {product.productOnSale ? (
              <p>
                <strike>{`$${product.productPrice}`}</strike>
                <span className="sale-price">{` $${product.productSalePrice}`}</span>
              </p>
            ) : <p>{`$${product.productPrice}`}</p>}
          </div>
          <p>{product.productDescription}</p>
        </div>
      </div>
    </div>
  );
};
