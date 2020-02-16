import React from 'react';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import { Waypoint } from 'react-waypoint';
import DownCarat from './DownCarat';
import CategoriesList from './CategoriesList';

const content = require('../content.json');

configureAnchors({ offset: -77 });

const Home = ({ categories }) => (
  <div className="home-page">
    <ScrollableAnchor id="home">
      <Waypoint topOffset="50%">
        <div className="home-section">
          <img src={`${process.env.PUBLIC_URL}/ocean.jpg`} alt="Home" className="home-page-image" />
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
        <div className="home-section bio-section">
          <p className="bio">{content.bio}</p>
        </div>
      </Waypoint>
    </ScrollableAnchor>
    <ScrollableAnchor id="products">
      <Waypoint topOffset="50%">
        <div className="home-section product-categories">
          <CategoriesList alignment="center" categories={categories || []} />
        </div>
      </Waypoint>
    </ScrollableAnchor>
  </div>
);

export default Home;
