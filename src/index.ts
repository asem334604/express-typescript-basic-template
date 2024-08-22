import express, {NextFunction, Request, Response} from 'express';
import  dotenv from 'dotenv';
import cors from 'cors';
import helmet from "helmet";
import morganMiddleware from "./config/morgan";
import logger from "./config/winston";

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(morganMiddleware);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Define the error type (you can extend it if needed)
interface Error {
    message: string;
    status?: number;
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    res.status(err.status || 500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
