import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { VideoRouter } from './routes/VideoRouter';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import Connection, { ConnectionOptions } from 'rabbitmq-client';
import { RabbitVideoService } from './services/implementations/RabbitVideoService';
import { RabbitVideoUploadService } from './services/implementations/RabbitVideoUploadService';

//For env File 
dotenv.config();

const app: Application = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
})
app.use(express.json());
app.use(express.static('public'));
app.use(morgan("tiny"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger-output.json",
    },
  })
);
app.disable("x-powered-by");
const port = process.env.PORT ?? 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to BorTube API!');
});

// RabbitMQ connection
const userName = "NodeUser";
const password = process.env.RABBITMQ_PASSWORD;
const options: ConnectionOptions = { username: userName, password: password, connectionName: 'Gateway Bortube', hostname: "217.105.22.226" };
const rabbit = new Connection(options);

rabbit.on('error', (err) => {
  console.log('RabbitMQ connection error', err)
})
rabbit.on('connection', () => {
  console.log('Connection successfully (re)established')
})

const videoRouter = new VideoRouter(new RabbitVideoService(rabbit), new RabbitVideoUploadService(rabbit)).getRouter();
app.use(videoRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


