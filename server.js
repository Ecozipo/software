const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');


const cors = require('cors')
const app = express();
require('dotenv').config();
require('./config/aws');
const userRoutes = require('./routes/user.routes');


const middleware = require('./middleware/auth.middleware');


var corsOptions = {
    origin: process.env.UI_ENDPOINT,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//connect to database
require('./config/db');
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(cookieParser());

//User
app.get("*" , middleware.checkToken);
app.get("/tokenid" , middleware.authGuard , (req ,res) => {
    res.status(200).send(res.locals.user);
}  );

app.use('/api/user' , userRoutes);


app.listen(process.env.PORT , () => {
    console.log(`Listening to the port ${process.env.PORT}` )
});
