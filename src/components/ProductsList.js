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
            key={product.itemId}
            to={escape(`/items/${category.categoryName.toLowerCase().replace(/ /g, '_')}/${product.itemName.toLowerCase().replace(/ /g, '_')}`)}
          >
            <ListGroupItem>
              {product.itemPhotos[0].photoName && (
                <img src={`${config.cloudfrontURL}/${product.itemPhotos[0].photoName}`} alt={product.itemName} />
              )}
              <div className="item-name">
                <h4>{product.itemName.trim().split('\n')[0]}</h4>
                {
                  product.itemOnSale ? (
                    <p>
                      <strike>{`$${product.itemPrice}`}</strike>
                      <span className="sale-price">{` $${product.itemSalePrice}`}</span>
                    </p>
                  ) : <p>{`$${product.itemPrice}`}</p>
                }
              </div>
            </ListGroupItem>
          </LinkContainer>
        ))}
      </ListGroup>
    </div>
  );
}
