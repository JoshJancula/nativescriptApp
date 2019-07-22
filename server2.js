const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const db = require("./models");
const Message = db.sequelize.import('./models/Message.js');

app.use(cors());
app.use(passport.initialize());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));


app.all('*', (req, res, next) => {
    const origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});


require("./routes/user-routes.js")(app);
require("./routes/email.js")(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // send the error page
    res.status(err.status || 500);
    res.json({
        message: 'error',
        error: err
    });
});


// Syncing sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log("App listening on PORT " + PORT);
        console.log('===================================');

        io.on('connection', (socket) => {

            // on connection get all messages for user
            socket.on('connectionInfo', (data) => {
                let messages = [];
                Message.findAll({
                    where: {
                        AuthorId: data.AuthorId
                    },
                }).then((x) => {
                    x.forEach(item => {
                        messages.push(item);
                    });
                    Message.findAll({
                        where: {
                            RecipientId: data.AuthorId
                        },
                    }).then((y) => {
                        y.forEach(z => {
                            messages.push(z);
                        });
                        socket.emit('allMessages', {
                            messages
                        });
                    });
                });
            });

            socket.on('update', (data) => {
                switch (data.Action) {
                    case 'users': socket.broadcast.emit('update', { Franchise: data.Franchise, Action: 'updateUsers' }); break;
                }
            });

            // update that the recipient read the message
            socket.on('read', (data) => {
                Message.update({
                    Read: data.Read
                }, {
                        where: {
                            id: data.id
                        }
                    }).then((x) => {
                        console.log('message status updated');
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            });

            // when new message is created
            socket.on('message', (data) => {
                Message.create({
                    Author: data.Author,
                    AuthorId: data.AuthorId,
                    Recipient: data.Recipient,
                    RecipientId: data.RecipientId,
                    RecipientDelete: data.RecipientDelete,
                    AuthorDelete: data.AuthorDelete,
                    Content: data.Content,
                    MessageType: data.MessageType,
                    Read: data.Read
                }).then((data) => {
                    socket.emit('message', {
                        data
                    });
                    socket.broadcast.emit('message', {
                        data
                    });
                });
            });

        });

    });
});