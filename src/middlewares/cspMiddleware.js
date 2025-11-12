// Sets strong security-related HTTP headers for every response.
// - Content-Security-Policy (CSP) helps prevent XSS and data injection attacks.
const headerSet = (req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://trusted.cdn.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none';");
  next();
};

module.exports =  headerSet ;