'use strict';
const mongoose = require('mongoose');
const config = require('./config');
require('colors');

/**
 * Check initial configurations like db connection, log folder existance, etc...
 * @returns {Promise}
 */
var initialize = function () {
    return connectZgworklifeDb()
};

var connectZgworklifeDb = function () {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        var ZgworklifeDB = mongoose.connection;

        ZgworklifeDB.once('connected', function connectionSuccess() {
            console.log('Zgworklife Database Connection Establishement. '.bold.cyan + '[ ' + 'OK'.bold.green + ' ]');
            resolve();
        });

        ZgworklifeDB.once('reconnected', function connectionSuccess() {
            console.log('Zgworklife Database Reconnection Establishement. '.bold.cyan + '[ ' + 'OK'.bold.green + ' ]');
            resolve();
        });

        ZgworklifeDB.on('disconnected', () => {
            console.log('Zgworklife Database Disconnected'.bold.red);
        });

        ZgworklifeDB.on('error', function connectionError(err) {
            console.log('Zgworklife Database Connection Establishement. '.bold.cyan + '[ ' + 'X'.bold.red + ' ]\n');
            console.log('Error connecting Zgworklife Database.\nDetails: ' + err.toString().bold.red);
            process.exit(0);
        });
    });
};

process.on('SIGINT', () => {
    mongoose.connection.close()
        .then(() => {
            process.exit(0);
        });
});

module.exports.initialize = initialize;
