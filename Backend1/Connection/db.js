const mongoose = require("mongoose");

const DBConnection=async()=>{
    try{
        const res=await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }catch(e){
        console.log("Mongoose Connection Failed",e);
    }
}

module.exports = DBConnection;