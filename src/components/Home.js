import React from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Waypoint } from 'react-waypoint';
import DownCarat from './DownCarat';

const Home = () => (
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
        <div className="home-section">Insert bio here.</div>
      </Waypoint>
    </ScrollableAnchor>
  </div>
);

export default Home;
