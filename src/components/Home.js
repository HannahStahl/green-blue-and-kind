import React from 'react';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import { Waypoint } from 'react-waypoint';
import DownCarat from './DownCarat';
import ItemsList from './ItemsList';

const content = require('../content.json');

configureAnchors({ offset: -76 });

const Home = ({ categories }) => (
  <div>
    <ScrollableAnchor id="home">
      <Waypoint topOffset="50%">
        <div className="home-section">
          <div className="home-text">
            <h1>Make your mark without leaving a mark.</h1>
            <a href="/#bio" className="shop-products">
              <p>Shop Products</p>
              <DownCarat />
            </a>
          </div>
        </div>
      </Waypoint>
    </ScrollableAnchor>
    <ScrollableAnchor id="bio">
      <Waypoint topOffset="50%">
        <div className="home-section">
          <p className="bio">{content.bio}</p>
        </div>
      </Waypoint>
    </ScrollableAnchor>
    <ScrollableAnchor id="products">
      <Waypoint topOffset="50%">
        <div className="home-section product-categories">
          <ItemsList alignment="center" items={categories ? categories.map(category => ({
            id: category.categoryId,
            name: category.categoryName,
            url: `/categories/${category.categoryName}`,
            photo: category.categoryPhoto,
          })) : []} />
        </div>
      </Waypoint>
    </ScrollableAnchor>
  </div>
);

export default Home;
