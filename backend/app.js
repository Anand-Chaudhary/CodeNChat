import dotenv from "dotenv";
import express, { urlencoded } from "express"
import morgan from "morgan";
import connect from "./db/db.js";

connect();
dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    res.send('Hello World!!')
})

export default app;