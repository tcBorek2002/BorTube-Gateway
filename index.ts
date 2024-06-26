import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { VideoRouter } from './routes/VideoRouter';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import Connection, { ConnectionOptions } from 'rabbitmq-client';
import { RabbitVideoService } from './services/implementations/RabbitVideoService';
import { RabbitVideoUploadService } from './services/implementations/RabbitVideoUploadService';
import { UserRouter } from './routes/UserRouter';
import { RabbitUserService } from './services/implementations/RabbitUserService';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { NotFoundError } from './errors/NotFoundError';
import { User } from './entities/user/User';
import rateLimit from 'express-rate-limit';


declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      displayName: string;
    }
  }
}

//For env File 
dotenv.config();

// RabbitMQ connection
const userName = "NodeUser";
const password = process.env.RABBITMQ_PASSWORD;
const hostname = process.env.RABBITMQ_HOSTNAME;
if (!password || !hostname) {
  throw new Error('RabbitMQ connection parameters not set')
}
const options: ConnectionOptions = { username: userName, password: password, connectionName: 'Gateway Bortube', hostname: hostname };
const rabbit = new Connection(options);

rabbit.on('error', (err) => {
  console.log('RabbitMQ connection error', err)
})
rabbit.on('connection', () => {
  console.log('Connection successfully (re)established')
})

const rabbitUserService = new RabbitUserService(rabbit);

const videoRouter = new VideoRouter(new RabbitVideoService(rabbit), new RabbitVideoUploadService(rabbit)).getRouter();
const usersRouter = new UserRouter(rabbitUserService).getRouter();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

let noRateLimit = process.env.NO_RATE_LIMIT === 'true';

console.log('Rate limiting:', noRateLimit ? 'disabled' : 'enabled');

const app: Application = express();
if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET is not set in the environment variables');
  process.exit(1);
}
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

if (!noRateLimit) {
  app.use(limiter);
}

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    await rabbitUserService.authenticateUser(username, password).then((user) => {
      return done(null, user);
    }).catch((error) => {
      if (error instanceof NotFoundError) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      else {
        return done(null, false, error);
      }
    });
  }
));


passport.serializeUser((user, done) => {
  return done(null, { id: user.id, email: user.email, displayName: user.displayName });
});
passport.deserializeUser((user: Express.User, done) => {
  return done(null, user)
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // Deployed version:
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
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

app.get('/api', (req: Request, res: Response) => {
  res.send('Welcome to BorTube API!');
});

app.use(videoRouter);
app.use(usersRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


