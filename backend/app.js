import "dotenv/config";
import express, { urlencoded } from "express"
import morgan from "morgan";
import connect from "./db/db.js";
import cookieParser from "cookie-parser";
import userRoute from './routes/user.routes.js'
import projectRoute from './routes/project.routes.js'
import aiRoute from './routes/ai.routes.js'
import cors from 'cors'

connect();


const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/users', userRoute);
app.use('/projects', projectRoute);
app.use('/ai', aiRoute);

app.get('/', (req, res)=>{
    res.send('Hello World!!')
})

export default app;