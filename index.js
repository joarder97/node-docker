const express = require('express');
const mongoose = require('mongoose');

const redis = require('redis');
const session = require('express-session');

let RedisStore = require('connect-redis')(session);

var bodyParser = require('body-parser');
const cors = require('cors');

// const cookieParser = require('cookie-parser');
const { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT, 
    REDIS_URL, 
    SESSION_SECRET, 
    REDIS_PORT
} = require('./config/config');


const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');



const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        // useFindAndModify: false,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.log(err);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();


const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.set('trust proxy', 1);

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
});

app.enable('trust proxy');
app.use(cors({}));

app.use(session({
        store: new RedisStore({client: redisClient}),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            httpOnly: true,
            resave: false,
            saveUninitialized: false,   
            maxAge: 30000000,
        },
        // resave: false,
        // saveUninitialized: false,
        // cookie: {
        //     secure: false,
        //     httpOnly: true,
        //     maxAge: 30000000,
        // },

    })
);

app.use(express.json());


app.get('/api', (req, res) => {
    res.send('<h2>Hi there!!!!<h2>');
    console.log("ok");
});

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

const port =  process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));