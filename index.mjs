import app from "./app.mjs";
const { API_PORT } = process.env;
app.listen(
  API_PORT,
  console.log(`server start on portNo: http://localhost:${API_PORT}....`)
);
