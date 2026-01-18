import swaggerJSDoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === "production";
const sourceDir = isProduction ? "./dist" : "./src";
const fileExt = isProduction ? "js" : "ts";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Flight33 API",
      version: "1.0.0",
      description:
        "Flight33 backend API for flight search and price trend aggregation."
    },
    servers: [
      {
        url: "https://flight33-backend.onrender.com",
        description: "Production"
      },
      {
        url: "http://localhost:4000",
        description: "Local development"
      }
    ]
  },
  apis: [`${sourceDir}/routes/**/*.${fileExt}`, `${sourceDir}/docs/**/*.${fileExt}`]
});
