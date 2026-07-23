const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const sequelize = require("./config/database");
const { apiReference } = require("@scalar/express-api-reference");
const openapi = require("./docs/openapi");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());

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
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});