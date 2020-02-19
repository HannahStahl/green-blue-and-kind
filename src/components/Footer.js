import React from 'react';

const Footer = () => (
  <footer>
    <p>
      &copy;
      {window.innerWidth >= 470 && ' Copyright'}
      {` ${(new Date()).getFullYear()} Green, Blue + Kind. All rights reserved.`}
    </p>
    <a href="https://websitesbyhannah.com"><p>Websites By Hannah</p></a>
  </footer>
);

export default Footer;
