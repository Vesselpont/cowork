exports.actionLogger = (action) => (req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(`[LOG] ${action} | User: ${req.user?.email || 'Guest'} | Time: ${new Date().toISOString()}`);
    }
    originalSend.call(res, body);
  };
  next();
};