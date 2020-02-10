import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import config from '../config';

export default function Product(props) {
  const [product, setProduct] = useState({});
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonText, setButtonText] = useState("Add to Cart");

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
      const productPhotoIds = productsToPhotos
        .filter(productToPhoto => productToPhoto.productId === product.productId)
        .map(productToPhoto => productToPhoto.photoId);
      product.productPhotos = photos.filter(photo => productPhotoIds.includes(photo.photoId));
      const productTagIds = productsToTags
        .filter(productToTag => productToTag.productId === product.productId)
        .map(productToTag => productToTag.tagId);
      product.productTags = tags.filter(tag => productTagIds.includes(tag.tagId)).map(tag => tag.tagName);
      const productSizeIds = productsToSizes
        .filter(productToSize => productToSize.productId === product.productId)
        .map(productToSize => productToSize.sizeId);
      product.productSizes = sizes.filter(size => productSizeIds.includes(size.sizeId));
      const productColorIds = productsToColors
        .filter(productToColor => productToColor.productId === product.productId)
        .map(productToColor => productToColor.colorId);
      product.productColors = colors.filter(color => productColorIds.includes(color.colorId));
      setProduct(product);
      setLoading(false);
    });
  }, [props.match.params.id]);

  function validateForm() {
    return size && color && quantity > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let cart = JSON.parse(localStorage.getItem('cart'));
    const newCartItem = {
      productId: product.productId,
      sizeId: size,
      colorId: color,
      quantity: parseInt(quantity),
    };
    if (cart) {
      const index = cart.findIndex(item => (
        item.productId === newCartItem.productId
        && item.sizeId === newCartItem.sizeId
        && item.colorId === newCartItem.colorId
      ));
      const currentCartItem = cart[index];
      if (currentCartItem) {
        const newQuantity = currentCartItem.quantity + parseInt(newCartItem.quantity);
        cart[index].quantity = newQuantity;
      } else {
        cart.push(newCartItem);
      }
    } else {
      cart = [newCartItem];
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setSize(null);
    setColor(null);
    setQuantity(0);
    setButtonText("Added to Cart");
  }

  function updateSize(e) {
    setSize(e.target.value);
    setButtonText("Add to Cart");
  }

  function updateColor(e) {
    setColor(e.target.value);
    setButtonText("Add to Cart");
  }

  function updateQuantity(e) {
    setQuantity(e.target.value);
    setButtonText("Add to Cart");
  }

  return !loading && (
    <div className="page-content product-page">
      <div className="product-info">
        <div className="product-photos">
          {product.productPhotos.map(photo => (
            <img
              key={photo.photoId}
              src={`${config.cloudfrontURL}/${photo.photoName}`}
              alt={photo.photoName}
              className="product-photo"
            />
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
          <p className="product-description">{product.productDescription}</p>
          {product.productTags.length > 0 && (
            <div className="product-tags">
              {product.productTags.map(tag => <div key={tag} className="product-tag">{tag}</div>)}
            </div>
          )}
          <form onSubmit={handleSubmit} className="product-form">
            <FormGroup controlId="size">
              <FormControl
                as="select"
                value={size || ""}
                onChange={updateSize}
              >
                <option key="" value="" disabled>Size</option>
                {product.productSizes.map(productSize => (
                  <option key={productSize.sizeId} value={productSize.sizeId}>{productSize.sizeName}</option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup controlId="color">
              <FormControl
                as="select"
                value={color || ""}
                onChange={updateColor}
              >
                <option key="" value="" disabled>Color</option>
                {product.productColors.map(productColor => (
                  <option key={productColor.colorId} value={productColor.colorId}>{productColor.colorName}</option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup controlId="quantity">
              <FormControl
                type="number"
                min="0"
                step="1"
                value={quantity || 0}
                onChange={updateQuantity}
              />
            </FormGroup>
            <Button
              block
              type="submit"
              size="lg"
              variant="outline-primary"
              disabled={!validateForm()}
            >
              {buttonText === 'Added to Cart' && <i className="fas fa-check added-to-cart" />}
              {buttonText}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
