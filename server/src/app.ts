import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import AppError from './utils/AppError';
import { handleError } from './utils/errHandler';
import userRouter from './routes/userRoutes';
const app = express();

app.use(
    cors({
        origin:"http://localhost:3000",
        methods:"GET, POST, PUT, DELETE",
        credentials:true,
        allowedHeaders:"Content-Type, Authorization",
    })
);

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})

app.use((err: AppError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, req, res, next);
});

app.use(morgan("dev"));
app.use(express.json());
// app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use("/api/v1/users", userRouter);

export default app; 