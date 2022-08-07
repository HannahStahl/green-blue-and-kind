const dev = {
  emailAddress: 'hannahstahl14@gmail.com',
};

const prod = {
  emailAddress: 'shana@gbkproducts.com',
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  emailURL: 'https://aiikn63n03.execute-api.us-east-1.amazonaws.com/prod/email/send',
  photosCloudfrontURL: 'https://d3kp4vtpq67hh9.cloudfront.net',
  sanityURL: 'https://p1zb4dtl.apicdn.sanity.io/v1/graphql/production/default',
  ...config,
};
