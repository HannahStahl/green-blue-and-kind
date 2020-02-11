const dev = {
  apiURL: "https://qwppkge4a7.execute-api.us-east-1.amazonaws.com/dev",
  cloudfrontURL: "https://d3lgv4qt5prjed.cloudfront.net",
  emailURL: "https://hol5104cj2.execute-api.us-east-1.amazonaws.com/dev/email/send"
};

const prod = {
  apiURL: "https://3jw0egh7y8.execute-api.us-east-1.amazonaws.com/prod",
  cloudfrontURL: "https://d3lgv4qt5prjed.cloudfront.net", // TODO change to prod URL
  emailURL: "https://2dkw1qwaja.execute-api.us-east-1.amazonaws.com/prod/email/send"
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  ...config,
};