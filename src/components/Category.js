import React, { useState, useEffect } from 'react';
import ItemsList from './ItemsList';
import config from '../config';

const Category = (props) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const promises = [
      fetch(`${config.apiURL}/products/${props.match.params.id}`).then(res => res.json()),
      fetch(`${config.apiURL}/productsToPhotos`).then(res => res.json()),
      fetch(`${config.apiURL}/photos`).then(res => res.json()),
    ];
    Promise.all(promises).then((results) => {
      const products = results[0];
      const productsToPhotos = results[1];
      const photos = results[2];
      products.forEach((product, index) => {
        const photoIds = productsToPhotos
          .filter(productToPhoto => productToPhoto.productId === product.productId)
          .map(productToPhoto => productToPhoto.photoId);
        products[index].productPhotos = photos.filter(photo => photoIds.includes(photo.photoId));
      });
      setProducts(products);
    });
  }, [props.match.params.id]);
  return (
    <div className="page-content">
      <ItemsList alignment="center" items={products ? products.map(product => ({
        id: product.productId,
        name: product.productName,
        url: `/products/${product.productId}`,
        photo: product.productPhotos[0].photoName,
      })) : []} />
    </div>
  );
};

export default Category;
