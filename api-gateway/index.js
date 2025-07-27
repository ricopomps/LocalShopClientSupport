require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.API_USERS_BASE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/store",
  createProxyMiddleware({
    target: process.env.API_STORE_BASE_URL,
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
