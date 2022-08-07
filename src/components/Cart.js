import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import config from '../config';
import { constructEmailHtml } from '../util';

export default function Cart({ categories, products, updateCart }) {
  const cartString = localStorage.getItem('cart');
  const initialItems = [];
  if (cartString) {
    const cart = JSON.parse(cartString);
    if (cart.length > 0) {
      cart.forEach((item, index) => {
        const product = products.find(({ _id }) => _id === item.itemId);
        const size = product && product.sizes.find(({ _id }) => _id === item.sizeId);
        const color = product && product.colors.find(({ _id }) => _id === item.colorId);
        if (!product || !size || !color) {
          // One or more IDs are invalid; clear cart
          localStorage.setItem('cart', '[]');
          updateCart();
        } else {
          initialItems[index] = {
            ...item,
            itemName: product.name,
            sizeName: size.name,
            colorName: color.name,
            photoURL: product.images[0].asset.url,
            price: (product.salePrice || product.price).toFixed(2),
          };
        }
      });
    }
  }

  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState('Submit Request');

  function updateQuantity(newQuantity, index) {
    if ((/^(\s*|\d+)$/).test(newQuantity)) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      cart[index].quantity = parseInt(newQuantity);
      items[index].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
      setItems([...items]);
    }
  }

  function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    items.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    setItems([...items]);
  }

  function getTotal() {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total.toFixed(2);
  }

  function updateName(e) {
    setName(e.target.value);
    setButtonText(items.length > 0 ? 'Submit Request' : 'Send Message');
  }

  function updateEmail(e) {
    setEmail(e.target.value);
    setButtonText('Submit Request');
    setButtonText(items.length > 0 ? 'Submit Request' : 'Send Message');
  }

  function updateMessage(e) {
    setMessage(e.target.value);
    setButtonText('Submit Request');
    setButtonText(items.length > 0 ? 'Submit Request' : 'Send Message');
  }

  function validateForm() {
    return name.length > 0 && email.length > 0 && (items.length > 0 || message.length > 0);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setButtonText(items.length > 0 ? 'Submitting Request...' : 'Sending Message...');
    const cart = {
      items: items.map((item) => ({
        name: item.itemName,
        size: item.sizeName,
        color: item.colorName,
        quantity: item.quantity,
        price: (item.quantity * item.price).toFixed(2),
      })),
      total: getTotal(),
    };
    fetch(config.emailURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        html: constructEmailHtml(name, message, cart),
        userEmail: email,
        clientEmail: config.emailAddress,
        siteDomain: window.location.origin,
        orderNotification: cart.items.length > 0,
      }),
    }).then((response) => response.json()).then((json) => {
      if (json.MessageId) {
        setButtonText(items.length > 0 ? 'Submitted Request' : 'Sent Message');
        setName('');
        setEmail('');
        setMessage('');
        setItems([]);
        localStorage.setItem('cart', '[]');
        updateCart();
      } else {
        setButtonText(items.length > 0 ? 'Submit Request' : 'Send Message');
        window.alert('An error occurred with our contact form. Please send an email directly to shana@gbkproducts.com!');
      }
    });
  }

  function getProductURL(itemId) {
    let categoryName;
    let productName;
    categories.forEach((category) => {
      category.products.forEach((product) => {
        if (product._id === itemId) {
          categoryName = category.name;
          productName = product.name;
        }
      });
    });
    return escape(`/items/${categoryName.toLowerCase().replace(/ /g, '_')}/${productName.toLowerCase().replace(/ /g, '_')}`);
  }

  function renderCart() {
    return (
      <div className="cart-items">
        {items.map((item, index) => {
          const productURL = getProductURL(item.itemId);
          return (
            <div key={`${item.itemId}-${item.sizeId}-${item.colorId}`} className="cart-item">
              <div><p><i className="fas fa-times" onClick={() => removeItem(index)} /></p></div>
              <div>
                <a href={productURL}>
                  <img src={item.photoURL} alt={item.itemName} />
                </a>
              </div>
              <div className="product-details">
                <a href={productURL} className="product-name">
                  <h4>{item.itemName}</h4>
                </a>
                <p className="size">{`Size: ${item.sizeName}`}</p>
                <p className="color">{`Color: ${item.colorName}`}</p>
              </div>
              <div>
                <FormControl
                  type="text"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(e.target.value, index)}
                  className="quantity"
                />
              </div>
              <div>
                <p className="price">{`$${(item.quantity * item.price).toFixed(2)}`}</p>
              </div>
            </div>
          );
        })}
        <div className="cart-total-container">
          <p>Estimated Total:</p>
          <p className="cart-total">{`$${getTotal()}`}</p>
        </div>
      </div>
    );
  }

  function renderForm() {
    return (
      <div>
        {items.length === 0 && (
          <div>
            <p>No items in cart.</p>
            <p>Send a message anyway:</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="cart-form">
          <FormGroup controlId="name" className="name-container">
            <FormControl
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={updateName}
            />
          </FormGroup>
          <FormGroup controlId="email" className="email-container">
            <FormControl
              placeholder="Your Email Address"
              type="email"
              value={email}
              onChange={updateEmail}
            />
          </FormGroup>
          <FormGroup controlId="message" className="message-container">
            <FormControl
              rows={10}
              as="textarea"
              placeholder={`Your Message${items.length > 0 ? ' (Optional)' : ''}`}
              value={message}
              onChange={updateMessage}
            />
          </FormGroup>
          <div className="button">
            <Button
              block
              type="submit"
              size="lg"
              variant="outline-dark"
              disabled={!validateForm()}
            >
              {(buttonText === 'Submitted Request' || buttonText === 'Sent Message') && <i className="fas fa-check" />}
              {buttonText}
            </Button>
          </div>
          {items.length > 0 && (
            <div className="centered-note">
              <p>
                {'After receiving your request, '}
                {'we will follow up with an exact quote and time to deliver.'}
              </p>
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="page-content cart-page">
      {items.length > 0 && renderCart()}
      {renderForm()}
    </div>
  );
}
