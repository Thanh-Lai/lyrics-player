const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');

const PORT = process.env.PORT || 8080;
const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('../../secrets'); // eslint-disable-line global-require
}

const createApp = () => {
    // logging middleware
    app.use(morgan('dev'));
    // body parsing middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // compression middleware
    app.use(compression());

    // static file-serving middleware
    app.use(express.static('dist'));
    // any remaining requests with an extension (.js, .css, etc.) send 404
    app.use((req, res, next) => {
        if (path.extname(req.path).length) {
            const err = new Error('Not found');
            err.status = 404;
            next(err);
        } else {
            next();
        }
    });

    // sends index.html
    app.use('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../', 'public/index.html'));
    });


    // error handling endware
    app.use((err, req, res) => {
        console.error(err);
        console.error(err.stack);
        res.status(err.status || 500).send(err.message || 'Internal server error.');
    });
};

const startListening = () => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

createApp();
startListening();
