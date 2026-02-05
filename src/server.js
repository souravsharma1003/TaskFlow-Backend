const app = require("./app");
require("dotenv").config();
const connectTODb = require("./utils/connectToDB");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectTODb(process.env.MONGO_URI);
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:");
    console.error(error);
    process.exit(1);
  }
}

startServer();
