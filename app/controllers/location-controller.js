const Country = require('../models/location/country-model');
const State = require('../models/location/state-model');
const City = require('../models/location/city-model');
const responseHandlier = require('../libs/response/status');
const common = require('../libs/static/common');

/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all Countries details in db
 */

module.exports.getAllCountries = (req, res) => {
    try {

        Country.find({})
            .populate('states', "name")
            .exec((error, countries) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (countries) {
                    responseHandlier.successResponse(true, countries, res);
                }
            });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}


/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all states details in db
 */

module.exports.getAllStates = (req, res) => {
    try {

        let countryFilter = {};

        if (req.query.countryId) {
            countryFilter = {
                'states': parseInt(req.query.countryId)
            };
        }

        State.find(countryFilter, { cities: 0 })
            .populate('country', "name")
            .exec((error, states) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (states) {
                    responseHandlier.successResponse(true, states, res);
                }
            });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}



/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all cities details in db
 */

module.exports.getAllCities = (req, res) => {
    try {

        let stateFilter = {};

        if (req.query.stateId) {
            stateFilter = {
                'state': parseInt(req.query.stateId)
            };
        }

        City.find(stateFilter)
            .populate('state', 'name')
            .exec((error, cities) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (cities) {
                    responseHandlier.successResponse(true, cities, res);
                }
            });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}