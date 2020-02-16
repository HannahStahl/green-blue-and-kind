import React from 'react';

const Footer = () => (
  <footer>
    &copy;
    {` Copyright ${(new Date()).getFullYear()} Green, Blue, and Kind. All rights reserved.`}
  </footer>
);

export default Footer;
