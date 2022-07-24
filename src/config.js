const dev = {
  apiURL: 'https://dlnum6f7kj.execute-api.us-east-1.amazonaws.com/dev',
  cloudfrontBaseURL: 'https://d1ljva6zkf6zjh.cloudfront.net',
  emailAddress: 'hannahstahl14@gmail.com',
  userID: 'us-east-1:0c9864e8-7db2-45fc-9c5a-ed2c11e2d9cf',
};

const prod = {
  apiURL: 'https://lbe32id9hg.execute-api.us-east-1.amazonaws.com/prod',
  cloudfrontBaseURL: 'https://d1esxin5o90ebg.cloudfront.net',
  emailAddress: 'shana@gbkproducts.com',
  userID: 'us-east-1:0b1dccc0-6c64-4e49-a01a-5670197c6e98',
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  cloudfrontURL: `${config.cloudfrontBaseURL}/${config.userID}`,
  emailURL: 'https://aiikn63n03.execute-api.us-east-1.amazonaws.com/prod/email/send',
  photosCloudfrontURL: 'https://d3kp4vtpq67hh9.cloudfront.net',
  ...config,
};
