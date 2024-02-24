import mongoose from "mongoose";
import app from "./app";
import env from "./util/validateEnv";

const port = env.PORT || 5000;

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log("Server running on port: " + port);
    });
  })
  .catch(console.error);
