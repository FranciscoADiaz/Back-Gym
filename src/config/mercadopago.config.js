const { MercadoPagoConfig, Preference } = require("mercadopago");

// Configurar MercadoPago con tu Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const preference = new Preference(client);

module.exports = { client, preference };
