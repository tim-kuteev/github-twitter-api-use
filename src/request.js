const https = require('https');

module.exports = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return reject(body);
        }
        if (res.statusCode !== 200 || body.errors) {
          reject(body);
        }
        resolve(body);
      });
    });
    req.on('error', (e) => {
      reject(e);
    });
    req.end();
  });
};
