'use strict';
var express = require('express');
const config = require('./config');
var app = express();
require('colors');
process.env.RootDir = __dirname;
const initializer = require('./initializer');
const PORT = 6000;

initializer.initialize()
    .then(() => {
        var expressConfig = require('./expressconfig');
        expressConfig.configureExpressApp(app);
    })
    .then(() => {
        app.listen(PORT, () => {
            console.info(`Server up and running... \nZgworklife API service now available at `.bold.green + `http://localhost:${PORT}/api/${config.API_VERSION}`.bold.magenta.underline + `\n`);
        }).on('error', (e) => {
            console.log('Error happened: ', e.message)
        });

    })
    .catch((err) => {
        console.log('Error starting app'.bold.red);
        console.log(err);
    });
