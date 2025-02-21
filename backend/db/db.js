import mongoose from "mongoose";
import 'dotenv/config';

function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        .then(()=>{
            console.log(`MONGO DB CONNECTED`);
        })
        .catch(err=> console.log(err));
    } catch (error) {
        console.log(error);
    }
}

export default connect