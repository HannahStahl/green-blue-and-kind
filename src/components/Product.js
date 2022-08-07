import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';

export default function Product(props) {
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buttonText, setButtonText] = useState('Add to Cart');
  const [photoIndex, setPhotoIndex] = useState(0);

  const { match, categories } = props;
  const categoryName = unescape(match.params.category).replace(/_/g, ' ');
  const category = categories.find((categoryInList) => (
    categoryInList.name.toLowerCase() === categoryName.toLowerCase()
  ));
  if (!category) window.location.pathname = '/page-not-found';
  const productName = unescape(match.params.product).replace(/_/g, ' ');
  const product = category.products.find((productInList) => (
    productInList.name.toLowerCase() === productName.toLowerCase()
  ));
  if (!product) window.location.pathname = '/page-not-found';

  function validateForm() {
    return size && color && quantity > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let cart = JSON.parse(localStorage.getItem('cart'));
    const newCartItem = {
      itemId: product._id,
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

  return (
    <div className="page-content product-page">
      <div className="product-info">
        <div className="product-photos">
          <img
            key={product.images[photoIndex]._key}
            src={product.images[photoIndex].asset.url}
            alt={product.name}
            className="product-photo"
          />
          {product.images.map((photo, index) => (
            <img
              key={photo._key}
              src={photo.asset.url}
              alt={`${product.name} ${index}`}
              className="product-thumbnail"
              onClick={() => setPhotoIndex(index)}
            />
          ))}
        </div>
        <div className="product-details">
          <h1>{product.name}</h1>
          <div className="product-price">
            {product.salePrice ? (
              <p>
                <strike>{`$${product.price}`}</strike>
                <span className="sale-price">{` $${product.salePrice}`}</span>
              </p>
            ) : <p>{`$${product.price}`}</p>}
          </div>
          <p className="product-description">{product.description}</p>
          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              {product.tags.map((tag) => <div key={tag._id} className="product-tag">{tag.name}</div>)}
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
                {product.sizes.map((productSize) => (
                  <option key={productSize._id} value={productSize._id}>
                    {productSize.name}
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
                {product.colors.map((productColor) => (
                  <option key={productColor._id} value={productColor._id}>
                    {productColor.name}
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
