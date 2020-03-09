import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import config from '../config';
import LoadingSpinner from './LoadingSpinner';

export default function Product(props) {
  const [product, setProduct] = useState({});
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buttonText, setButtonText] = useState('Add to Cart');
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetch(`${config.apiURL}/publishedCategories/${config.userID}`).then((res) => res.json()).then((categories) => {
      const categoryName = props.match.params.category.replace(/_/g, ' ');
      const { categoryId } = categories.find((category) => (
        category.categoryName.toLowerCase() === categoryName.toLowerCase()
      ));
      fetch(`${config.apiURL}/publishedItems/${config.userID}/${categoryId}`).then((res) => res.json()).then((products) => {
        const productName = props.match.params.product.replace(/_/g, ' ');
        const { itemId } = products.find((productInList) => (
          productInList.itemName.toLowerCase() === productName.toLowerCase()
        ));
        const promises = [
          fetch(`${config.apiURL}/item/${config.userID}/${itemId}`).then((res) => res.json()),
          fetch(`${config.apiURL}/itemsToPhotos/${config.userID}/${itemId}`).then((res) => res.json()),
          fetch(`${config.apiURL}/photos/${config.userID}`).then((res) => res.json()),
          fetch(`${config.apiURL}/itemsToTags/${config.userID}/${itemId}`).then((res) => res.json()),
          fetch(`${config.apiURL}/tags/${config.userID}`).then((res) => res.json()),
          fetch(`${config.apiURL}/itemsToSizes/${config.userID}/${itemId}`).then((res) => res.json()),
          fetch(`${config.apiURL}/sizes/${config.userID}`).then((res) => res.json()),
          fetch(`${config.apiURL}/itemsToColors/${config.userID}/${itemId}`).then((res) => res.json()),
          fetch(`${config.apiURL}/colors/${config.userID}`).then((res) => res.json()),
        ];
        Promise.all(promises).then((results) => {
          const [
            productDetails, productsToPhotos, photos, productsToTags, tags,
            productsToSizes, sizes, productsToColors, colors,
          ] = results;
          const productPhotoIds = productsToPhotos
            .filter((productToPhoto) => productToPhoto.itemId === itemId)
            .map((productToPhoto) => productToPhoto.photoId);
          const productPhotos = [];
          productPhotoIds.forEach((photoId) => {
            productPhotos.push(photos.find((photo) => photo.photoId === photoId));
          });
          productDetails.itemPhotos = productPhotos;
          const productTagIds = productsToTags
            .filter((productToTag) => productToTag.itemId === itemId)
            .map((productToTag) => productToTag.tagId);
          const productTags = [];
          productTagIds.forEach((tagId) => {
            productTags.push(tags.find((tag) => tag.tagId === tagId));
          });
          productDetails.itemTags = productTags.map((tag) => tag.tagName);
          const productSizeIds = productsToSizes
            .filter((productToSize) => productToSize.itemId === itemId)
            .map((productToSize) => productToSize.sizeId);
          const productSizes = [];
          productSizeIds.forEach((sizeId) => {
            productSizes.push(sizes.find((sizeInList) => sizeInList.sizeId === sizeId));
          });
          productDetails.itemSizes = productSizes;
          const productColorIds = productsToColors
            .filter((productToColor) => productToColor.itemId === itemId)
            .map((productToColor) => productToColor.colorId);
          const productColors = [];
          productColorIds.forEach((colorId) => {
            productColors.push(colors.find((colorInList) => colorInList.colorId === colorId));
          });
          productDetails.itemColors = productColors;
          setProduct(productDetails);
          setLoading(false);
        });
      });
    });
  }, [props.match.params.category, props.match.params.product]);

  function validateForm() {
    return size && color && quantity > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let cart = JSON.parse(localStorage.getItem('cart'));
    const newCartItem = {
      itemId: product.itemId,
      sizeId: size,
      colorId: color,
      quantity: parseInt(quantity),
    };
    if (cart) {
      const index = cart.findIndex((item) => (
        item.itemId === newCartItem.itemId
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
    setQuantity(1);
    setButtonText('Added to Cart');
    props.updateCart();
  }

  function updateSize(e) {
    setSize(e.target.value);
    setButtonText('Add to Cart');
  }

  function updateColor(e) {
    setColor(e.target.value);
    setButtonText('Add to Cart');
  }

  function updateQuantity(e) {
    if ((/^(\s*|\d+)$/).test(e.target.value)) {
      setQuantity(e.target.value);
      setButtonText('Add to Cart');
    }
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity(parseInt(quantity) - 1);
      setButtonText('Add to Cart');
    }
  }

  function incrementQuantity() {
    setQuantity(parseInt(quantity) + 1);
    setButtonText('Add to Cart');
  }

  return loading ? <LoadingSpinner /> : (
    <div className="page-content product-page">
      <div className="product-info">
        <div className="product-photos">
          <img
            key={product.itemPhotos[photoIndex].photoId}
            src={`${config.cloudfrontURL}/${product.itemPhotos[photoIndex].photoName}`}
            alt={product.itemName}
            className="product-photo"
          />
          {product.itemPhotos.map((photo, index) => (
            <img
              key={photo.photoId}
              src={`${config.cloudfrontURL}/${photo.photoName}`}
              alt={`${product.itemName} ${index}`}
              className="product-thumbnail"
              onClick={() => setPhotoIndex(index)}
            />
          ))}
        </div>
        <div className="product-details">
          <h1>{product.itemName}</h1>
          <div className="product-price">
            {product.itemOnSale ? (
              <p>
                <strike>{`$${product.itemPrice}`}</strike>
                <span className="sale-price">{` $${product.itemSalePrice}`}</span>
              </p>
            ) : <p>{`$${product.itemPrice}`}</p>}
          </div>
          <p className="product-description">{product.itemDescription}</p>
          {product.itemTags.length > 0 && (
            <div className="product-tags">
              {product.itemTags.map((tag) => <div key={tag} className="product-tag">{tag}</div>)}
            </div>
          )}
          <form onSubmit={handleSubmit} className="product-form">
            <FormGroup controlId="size">
              <FormControl
                as="select"
                value={size || ''}
                onChange={updateSize}
                className={size ? '' : 'gray'}
              >
                <option key="" value="" disabled>Size</option>
                {product.itemSizes.map((productSize) => (
                  <option key={productSize.sizeId} value={productSize.sizeId}>
                    {productSize.sizeName}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup controlId="color">
              <FormControl
                as="select"
                value={color || ''}
                onChange={updateColor}
                className={color ? '' : 'gray'}
              >
                <option key="" value="" disabled>Color</option>
                {product.itemColors.map((productColor) => (
                  <option key={productColor.colorId} value={productColor.colorId}>
                    {productColor.colorName}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup controlId="quantity" className="quantity-form-group">
              <div className="quantity-increment left" onClick={decrementQuantity}><p>-</p></div>
              <FormControl
                type="text"
                value={quantity}
                onChange={updateQuantity}
                className={parseInt(quantity) > 0 ? 'quantity-input' : 'quantity-input gray'}
              />
              <div className="quantity-increment right" onClick={incrementQuantity}><p>+</p></div>
            </FormGroup>
            <Button
              block
              type="submit"
              size="lg"
              variant="outline-dark"
              disabled={!validateForm()}
            >
              {buttonText === 'Added to Cart' && <i className="fas fa-check" />}
              {buttonText}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
