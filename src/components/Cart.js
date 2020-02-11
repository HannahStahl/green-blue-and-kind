import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import config from '../config';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

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
    return email.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    // TODO send email to Shana (you, on dev)
  }

  return !loading && (
    <div className="page-content cart-page">
      {items.length > 0 ? (
        <div>
          <table className="cart-items">
            <tbody>
              <tr key="cart-header" className="cart-item cart-header">
                <td />
                <td />
                <td>Product</td>
                <td>Size</td>
                <td>Color</td>
                <td>Quantity</td>
                <td>Price</td>
              </tr>
              {items.map((item, index) => (
                <tr key={`${item.productId}-${item.sizeId}-${item.colorId}`} className="cart-item">
                  <td><p><i className="fas fa-times" onClick={() => removeItem(index)} /></p></td>
                  <td>
                    <a href={`/products/${item.productId}`}>
                      <img src={`${config.cloudfrontURL}/${item.photoName}`} alt={item.productName} />
                    </a>
                  </td>
                  <td>
                    <a href={`/products/${item.productId}`} className="product-name">
                      <p>{item.productName}</p>
                    </a>
                  </td>
                  <td><p>{item.sizeName}</p></td>
                  <td><p>{item.colorName}</p></td>
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
              <tr>
                <td colSpan="7">
                  <div className="cart-total-container">
                    <p>Estimated Total:</p>
                    <p className="cart-total">${getTotal()}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="submit-request">
                    <form onSubmit={handleSubmit}>
                      <FormGroup controlId="email" className="email-container">
                        <FormControl
                          className="email"
                          placeholder="Your Email Address"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : <p className="no-items">No items in cart.</p>
    }
    </div>
  );
};
