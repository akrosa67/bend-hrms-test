const mongoose = require('mongoose');
const async = require('async');
const config = require('../config');

const countries = require('../libs/data/countries');
const states = require('../libs/data/states');
const cities = require('../libs/data/cities');

const Country = require('../models/location/country-model');
const City = require('../models/location/city-model');
const State = require('../models/location/state-model');

mongoose.connect(config.MONGO_URI);

/**
 * @Save_States_On_DB 
 */

async function _saveStates() {

    try {

        var countries = await Country.find();

        async.each(countries, function iteratee(country, nextCountry) {

            console.log("==========Started " + country.name + "==============")

            async.each(states, function iteratee(state, next) {

                if (state.country_id == (country.id + '')) {
                    var st = new State({
                        _id: state.id,
                        name: state.name,
                        country: country,
                        shortName: state.shortName,
                        status: state.status
                    })

                    st.save(function (err, res) {
                        country
                            .states
                            .push(st)
                        country.save(function (er, resp) {
                            next()
                        })
                    })

                } else {
                    next();
                }

            }, function () {
                console.log("All States Done")
                console.log("========== Ended " + country.name + "==============")
            })

        }, function () {
            console.log("All Countries Done")
        })

    } catch (error) {
        return console.log("error", error);
    }
}

/**
 * @Save_Cities_On_DB
 */

async function _saveCities() {

    try {

        var states = await State.find()

        async.each(states, function iteratee(state, nextState) {

            console.log("==========Started " + state.name + "==============\n")

            async.each(cities, function iteratee(city, next) {

                if (city.state_id == (state.id + '')) {

                    console.log("==========name " + city.name + "==============\n")

                    var ct = new City({
                        _id: city.id,
                        name: city.name,
                        state: state,
                        shortName: city.shortName,
                        status: city.status
                    })

                    ct.save(function (err, res) {
                        state
                            .cities
                            .push(ct)
                        state.save(function (er, resp) {
                            next()
                        })
                    })

                } else {
                    next();
                }

            }, function () {
                console.log("All Cities Done")
                console.log("========== Ended " + state.name + "==============")
            })

        }, function () {
            console.log("All States Done")
        })

    } catch (error) {
        return console.log("error", error);
    }

}

/**
 * @Save_Countries_On_DB 
 */

async function _saveCountries() {

    try {

        async.each(countries, function iteratee(country, next) {

            const cn = new Country({
                _id: country.id,
                shortName: country.shortName,
                name: country.name,
                countryCode: country.countryCode,
                status: country.status
            })

            console.log("\n\n\n\n\n\n\n\n ==========Started " + country.name + "==============")

            cn.save(function (err, res) {
                console.log("\n\n\n\n\n\n\n\n ==========res " + res + "==============", err)
                next();
            })
        }, function () {
            console.log("\n\n\n\n\n\n\n\n ================= All Countries loaded ===================");
        })

    } catch (error) {
        return console.log("error", error);
    }

}

module.exports = {

    saveStates: function () {
        _saveStates();
    },
    saveCities: function () {
        _saveCities();
    },
    saveCountries: function () {
        _saveCountries()
    },

    Country: Country,
    State: State,
    City: City
}