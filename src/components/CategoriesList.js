import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import config from '../config';

export default function CategoriesList({ categories }) {
  return (
    <div className="categories-list">
      <ListGroup>
        {categories.map((category) => (
          <LinkContainer key={category.categoryId} to={`/items/${category.categoryName.toLowerCase().replace(/ /g, '_')}`}>
            <ListGroupItem>
              {category.categoryPhoto && (
                <img src={`${config.cloudfrontURL}/${category.categoryPhoto}`} alt={category.categoryName} />
              )}
              <div className="item-name">
                <h4>{category.categoryName.trim().split('\n')[0]}</h4>
              </div>
            </ListGroupItem>
          </LinkContainer>
        ))}
      </ListGroup>
    </div>
  );
}
