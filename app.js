import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/status", (req, res) => {
  return res.json({
    success: true,
    message: "Server is up and running",
  });
});

app.use("/api", router);

app.listen(5000, () => {
  console.log("Server is up and running on port 5000");
});
