const emailAuthConfig = {
  type: 'OAuth2',
  user: process.env.GOOGLE_API_USER,
  clientId: process.env.GOOGLE_API_CLIENT_ID,
  clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_API_REFRESH_TOKEN,
};

export default emailAuthConfig;
