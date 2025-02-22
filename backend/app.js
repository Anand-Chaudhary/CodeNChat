import dotenv from "dotenv";
import express, { urlencoded } from "express"
import morgan from "morgan";
import connect from "./db/db.js";
import userRoute from './routes/user.routes.js'

connect();
dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/users', userRoute
)

app.get('/', (req, res)=>{
    res.send('Hello World!!')
})

export default app;