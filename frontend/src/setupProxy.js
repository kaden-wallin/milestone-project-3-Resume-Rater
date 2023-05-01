const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://rotten-resumes-backend.vercel.app/',
            changeOrigin: true,
        })
    );
};
