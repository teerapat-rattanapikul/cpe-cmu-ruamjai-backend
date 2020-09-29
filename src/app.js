const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const apiRoutes = require("./routes/api");

require("dotenv").config(__dirname + "../../.env");
require("./database/mongo");

app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/api", apiRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server started on PORT:${port}`));
