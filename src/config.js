const dev = {
  apiURL: 'https://dlnum6f7kj.execute-api.us-east-1.amazonaws.com/dev',
  cloudfrontURL: 'https://d1c360lneb6ftg.cloudfront.net',
  emailURL: 'https://hol5104cj2.execute-api.us-east-1.amazonaws.com/dev/email/send',
  userID: 'us-east-1:34ee9094-c95a-4f8f-b2c2-551ef33bd49f',
};

const prod = {
  apiURL: 'https://dlnum6f7kj.execute-api.us-east-1.amazonaws.com/dev', // TODO change to prod URL
  cloudfrontURL: 'https://dd7h6rpqhh194.cloudfront.net',
  emailURL: 'https://2dkw1qwaja.execute-api.us-east-1.amazonaws.com/prod/email/send',
  userID: 'us-east-1:34ee9094-c95a-4f8f-b2c2-551ef33bd49f', // TODO change to prod user ID
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  photosCloudfrontURL: 'https://d3kp4vtpq67hh9.cloudfront.net',
  ...config,
};
