import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import config from '../config';

export default function ProductsList({ category, products }) {
  return (
    <div className="products-list">
      <ListGroup>
        {products.map((product) => (
          <LinkContainer
            key={product.productId}
            to={`/items/${category.categoryName.toLowerCase().replace(/ /g, '_')}/${product.productName.toLowerCase().replace(/ /g, '_')}`}
          >
            <ListGroupItem>
              {product.productPhotos[0].photoName && (
                <img src={`${config.cloudfrontURL}/${product.productPhotos[0].photoName}`} alt={product.productName} />
              )}
              <div className="item-name">
                <h4>{product.productName.trim().split('\n')[0]}</h4>
                {
                  product.productOnSale ? (
                    <p>
                      <strike>{`$${product.productPrice}`}</strike>
                      <span className="sale-price">{` $${product.productSalePrice}`}</span>
                    </p>
                  ) : <p>{`$${product.productPrice}`}</p>
                }
              </div>
            </ListGroupItem>
          </LinkContainer>
        ))}
      </ListGroup>
    </div>
  );
}
