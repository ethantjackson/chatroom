import * as express from 'express';
import {
  createProxyMiddleware,
  Filter,
  Options,
  RequestHandler,
} from 'http-proxy-middleware';

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://127.0.0.1:52176',
    changeOrigin: true,
  })
);
app.listen(3000);
