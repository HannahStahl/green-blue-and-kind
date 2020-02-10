import React, { useState, useEffect } from 'react';
import config from '../config';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
            const { productName } = products.find(product => product.productId === item.productId);
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

  function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    items.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    setItems([...items]);
  }

  return !loading && (
    <div className="page-content cart-page">
      {items.length > 0 ? (
        <table className="cart-items">
          <tbody>
            <tr key="cart-header" className="cart-item cart-header">
              <td />
              <td>Product</td>
              <td>Size</td>
              <td>Color</td>
              <td>Quantity</td>
              <td />
            </tr>
            {items.map((item, index) => (
              <tr key={`${item.productId}-${item.sizeId}-${item.colorId}`} className="cart-item">
                <td><img src={`${config.cloudfrontURL}/${item.photoName}`} alt={item.productName} /></td>
                <td><p>{item.productName}</p></td>
                <td><p>{item.sizeName}</p></td>
                <td><p>{item.colorName}</p></td>
                <td><p>{item.quantity}</p></td>
                <td><p><i className="fas fa-times" onClick={() => removeItem(index)} /></p></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="no-items">No items in cart.</p>
    }
    </div>
  );
};
