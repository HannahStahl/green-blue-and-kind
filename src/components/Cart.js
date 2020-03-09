import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import config from '../config';
import LoadingSpinner from './LoadingSpinner';

export default function Cart({ updateCart }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState('Submit Request');

  useEffect(() => {
    let cart = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
      if (cart.length > 0) {
        const promises = [
          fetch(`${config.apiURL}/publishedCategories/${config.userID}`).then((res) => res.json()),
          fetch(`${config.apiURL}/publishedItems/${config.userID}`).then((res) => res.json()),
          fetch(`${config.apiURL}/itemsToPhotos/${config.userID}`).then((res) => res.json()),
          fetch(`${config.apiURL}/photos/${config.userID}`).then((res) => res.json()),
          fetch(`${config.apiURL}/sizes/${config.userID}`).then((res) => res.json()),
          fetch(`${config.apiURL}/colors/${config.userID}`).then((res) => res.json()),
        ];
        Promise.all(promises).then((results) => {
          const [allCategories, allProducts, itemsToPhotos, photos, sizes, colors] = results;
          setCategories(allCategories);
          setProducts(allProducts);
          cart.forEach((item, index) => {
            const {
              itemName, itemPrice, itemOnSale, itemSalePrice,
            } = allProducts.find((product) => product.itemId === item.itemId);
            const price = itemOnSale ? itemSalePrice : itemPrice;
            const { sizeName } = sizes.find((size) => size.sizeId === item.sizeId);
            const { colorName } = colors.find((color) => color.colorId === item.colorId);
            const { photoId } = itemsToPhotos.find(
              (itemToPhoto) => itemToPhoto.itemId === item.itemId,
            );
            const { photoName } = photos.find((photo) => photo.photoId === photoId);
            cart[index] = {
              ...item,
              itemName,
              sizeName,
              colorName,
              photoName,
              price,
            };
          });
          setItems([...cart]);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

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
        price: item.quantity * item.price,
      })),
      total: getTotal(),
    };
    fetch(config.emailURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, cart, message,
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
    const product = products.find(
      (productInList) => productInList.itemId === itemId,
    );
    const category = categories.find(
      (categoryInList) => categoryInList.categoryId === product.categoryId,
    );
    return `/items/${category.categoryName.toLowerCase().replace(/ /g, '_')}/${product.itemName.toLowerCase().replace(/ /g, '_')}`;
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
                  <img src={`${config.cloudfrontURL}/${item.photoName}`} alt={item.itemName} />
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

  return loading ? <LoadingSpinner /> : (
    <div className="page-content cart-page">
      {items.length > 0 && renderCart()}
      {renderForm()}
    </div>
  );
}
