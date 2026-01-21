const app = require("./app");
const mongoose=require("mongoose");
require("dotenv").config();
const connectTODb=require("./utils/connectToDB");

const PORT = process.env.PORT || 3000;

(async function () {
    await connectTODb(process.env.MONGO_URI);
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    })
})
();

