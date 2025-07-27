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
  "/api/auth",
  createProxyMiddleware({
    target: process.env.API_AUTH_BASE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/shoppingListHistory",
  createProxyMiddleware({
    target: process.env.API_HISTORY_BASE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/map",
  createProxyMiddleware({
    target: process.env.API_MAP_BASE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/notifications",
  createProxyMiddleware({
    target: process.env.API_NOTIFICATION_BASE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.API_PRODUCTS_BASE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/stores",
  createProxyMiddleware({
    target: process.env.API_STORE_BASE_URL,
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
