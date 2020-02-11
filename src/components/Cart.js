import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import config from '../config';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    let cart = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
      if (cart.length > 0) {
        const promises = [
          fetch(`${config.apiURL}/products`).then(res => res.json()),
          fetch(`${config.apiURL}/productsToPhotos`).then(res => res.json()),
          fetch(`${config.apiURL}/photos`).then(res => res.json()),
          fetch(`${config.apiURL}/sizes`).then(res => res.json()),
          fetch(`${config.apiURL}/colors`).then(res => res.json()),
        ];
        Promise.all(promises).then((results) => {
          const [products, productsToPhotos, photos, sizes, colors] = results;
          cart.forEach((item, index) => {
            const {
              productName, productPrice, productOnSale, productSalePrice
            } = products.find(product => product.productId === item.productId);
            const price = productOnSale ? productSalePrice : productPrice;
            const { sizeName } = sizes.find(size => size.sizeId === item.sizeId);
            const { colorName } = colors.find(color => color.colorId === item.colorId);
            const { photoId } = productsToPhotos.find(productToPhoto => productToPhoto.productId === item.productId);
            const { photoName } = photos.find(photo => photo.photoId === photoId);
            cart[index] = {
              ...item,
              productName,
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
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity = parseInt(newQuantity);
    items[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    setItems([...items]);
  }

  function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    items.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    setItems([...items]);
  }

  function getTotal() {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  }

  function validateForm() {
    return name.length > 0 && email.length > 0 && (items.length > 0 || message.length > 0);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(items); // TODO add items to message
    fetch(config.emailURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    }).then((response) => response.json()).then((json) => {
      if (json.MessageId) {
        setName('');
        setEmail('');
        setMessage('');
        setRequestSent(true);
        // TODO show confirmation modal
      } else {
        // TODO show error modal
        window.alert('An error occurred with our contact form. Please send an email directly to shana@gbkproducts.com!');
      }
    });
  }

  function renderCart() {
    return (
      <div className="cart-items">
        <table>
          <tbody>
            {items.map((item, index) => (
              <tr key={`${item.productId}-${item.sizeId}-${item.colorId}`} className="cart-item">
                <td><p><i className="fas fa-times" onClick={() => removeItem(index)} /></p></td>
                <td>
                  <a href={`/products/${item.productId}`}>
                    <img src={`${config.cloudfrontURL}/${item.photoName}`} alt={item.productName} />
                  </a>
                </td>
                <td className="product-details">
                  <a href={`/products/${item.productId}`} className="product-name">
                    <h4>{item.productName}</h4>
                  </a>
                  <p className="size">Size: {item.sizeName}</p>
                  <p className="color">Color: {item.colorName}</p>
                </td>
                <td>
                  <FormControl
                    type="number"
                    min="0"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(e.target.value, index)}
                    className="quantity"
                  />
                </td>
                <td><p className="price">${item.quantity * item.price}</p></td>
              </tr>
            ))}
            <tr className="cart-total-container">
              <td colSpan="5">
                <p>Estimated Total:</p>
                <p className="cart-total">${getTotal()}</p>
              </td>
            </tr>
          </tbody>
        </table>
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
              onChange={e => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="email" className="email-container">
            <FormControl
              placeholder="Your Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="message" className="message-container">
            <FormControl
              rows={10}
              as="textarea"
              placeholder={`Your Message${items.length > 0 ? ' (Optional)' : ''}`}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </FormGroup>
          <Button
            type="submit"
            size="lg"
            variant="outline-primary"
            disabled={!validateForm()}
          >
            Submit Request
          </Button>
        </form>
      </div>
    );
  }

  return !loading && (
    <div className="page-content cart-page">
      {items.length > 0 && renderCart()}
      {renderForm()}
    </div>
  );
};
