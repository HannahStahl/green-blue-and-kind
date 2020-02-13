import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import config from '../config';

export default function ProductsList({ items }) {
  return (
    <div className="products-list">
      <ListGroup>
        {items.map(item => (
          <LinkContainer key={item.id} to={item.url}>
            <ListGroupItem>
              {item.photo && <img src={`${config.cloudfrontURL}/${item.photo}`} alt={item.name} />}
              <div className="item-name">
                <h4>{item.name.trim().split("\n")[0]}</h4>
                {
                  item.onSale ? (
                    <p>
                      <strike>{`$${item.price}`}</strike>
                      <span className="sale-price">{` $${item.salePrice}`}</span>
                    </p>
                  ) : <p>{`$${item.price}`}</p>
                }
              </div>
            </ListGroupItem>
          </LinkContainer>
        ))}
      </ListGroup>
    </div>
  );
};
