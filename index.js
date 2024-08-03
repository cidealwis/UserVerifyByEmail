import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { UserRouter } from './routes/user.js';

dotenv.config();
import "./db/mongoose.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", UserRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
