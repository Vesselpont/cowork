const dns = require('dns');

dns.resolveSrv(
  '_mongodb._tcp.backend-course.oh1ibyp.mongodb.net',
  (err, records) => {
    console.log(err);
    console.log(records);
  }
);