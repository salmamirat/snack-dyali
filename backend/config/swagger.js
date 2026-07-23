const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Snack Dyali API",
      version: "1.0.0",
      description: "API de gestion des plats"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },

  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;