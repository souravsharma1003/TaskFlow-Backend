const mongoose=require("mongoose");

const connectToDb=async(url)=>{
    try {
        const db=await mongoose.connect(url);
        console.log("Database connected successfully :",db.connection.name)
    } catch (error) {
        console.error("Error connecting to the database :",error.message);
        process.exit(1);
    }
}

module.exports=connectToDb;