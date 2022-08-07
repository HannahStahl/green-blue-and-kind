import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export default function ProductsList({ category, products }) {
  return (
    <div className="products-list">
      <ListGroup>
        {products.map((product) => (
          <LinkContainer
            key={product._id}
            to={escape(`/items/${category.name.toLowerCase().replace(/ /g, '_')}/${product.name.toLowerCase().replace(/ /g, '_')}`)}
          >
            <ListGroupItem>
              <img src={product.images[0].asset.url} alt={product.name} />
              <div className="item-name">
                <h4>{product.name.trim().split('\n')[0]}</h4>
                {
                  product.salePrice ? (
                    <p>
                      <strike>{`$${product.price.toFixed(2)}`}</strike>
                      <span className="sale-price">{` $${product.salePrice.toFixed(2)}`}</span>
                    </p>
                  ) : <p>{`$${product.price.toFixed(2)}`}</p>
                }
              </div>
            </ListGroupItem>
          </LinkContainer>
        ))}
      </ListGroup>
    </div>
  );
}
