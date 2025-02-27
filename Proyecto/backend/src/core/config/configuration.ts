export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh: process.env.JWT_SECRET_REFRESH,
  },
  mercadoPago: {
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  },
  host: process.env.HOST
    ? process.env.HOST
    : 'http://localhost:' + process.env.PORT,
  webhook: process.env.WEBHOOK_URL,
});
