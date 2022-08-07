import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export default function CategoriesList({ categories }) {
  return (
    <div className="categories-list">
      <ListGroup>
        {categories.map((category) => (
          <LinkContainer key={category._id} to={escape(`/items/${category.name.toLowerCase().replace(/ /g, '_')}`)}>
            <ListGroupItem>
              <img src={category.image.asset.url} alt={category.name} />
              <div className="item-name">
                <h4>{category.name.trim().split('\n')[0]}</h4>
              </div>
            </ListGroupItem>
          </LinkContainer>
        ))}
      </ListGroup>
    </div>
  );
}
