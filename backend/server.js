const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const sequelize = require("./config/database");
const { apiReference } = require("@scalar/express-api-reference");
const openapi = require("./docs/openapi");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/plats", require("./routes/plat.routes"));

app.use(
  "/docs",
  apiReference({
    spec: {
      content: openapi,
    },
  })
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Tables synchronized");

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT || 3000}`
      );
    });
  })
  .catch((error) => {
    console.error(error);
  });