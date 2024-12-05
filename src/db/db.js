import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";



const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('MONGODB HOST',connectionInstance.connection.host);
        
        console.log('MONGODB CONNECTED SUCCESSFULLY',connectionInstance);
    } catch (error) {
        console.log('ERROR IN MONGODB CONNECTION ',error);
        process.exit(1)
        
    }
}

export {connectDB}