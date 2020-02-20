import React, { useEffect } from 'react';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import { Waypoint } from 'react-waypoint';
import DownCarat from './DownCarat';
import CategoriesList from './CategoriesList';
import config from '../config';

const content = require('../content.json');

configureAnchors({ offset: -97 });

const Home = ({ categories }) => {
  function showText() {
    document.getElementById('home-text').className = 'home-text visible';
  }

  useEffect(() => {
    setTimeout(showText, 500);
  }, []);

  return (
    <div className="home-page">
      <ScrollableAnchor id="home">
        <Waypoint topOffset="50%">
          <div className="home-section">
            <img src={`${config.photosCloudfrontURL}/home.jpg`} alt="Green, Blue + Kind" className="home-page-image" />
            <div id="home-text" className="home-text hidden">
              <h1>Make your mark without leaving a mark.</h1>
              <a href="/#products" className="shop-products">
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
            <div className="bio">
              {content.bio.map((paragraph, index) => (
                <p key={paragraph} className={index === 0 ? '' : 'bio-paragraph'}>{paragraph}</p>
              ))}
            </div>
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
};

export default Home;
