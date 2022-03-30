const jwt = require('jsonwebtoken');
const config = require('../../config');
const CryptoJS = require("crypto-js");
const ObjectId = require('mongodb').ObjectId;
const userAgent = require('express-useragent');
const sesstion = require('../../models/employee/session-model')
const common = require('../../libs/static/common');

module.exports.checkAuth = async function (req, res, next) {

    if (!req.headers.authorization) {
        return res.status(403).json({
            error: 'Protected resource, use Authorization header to get access.'
        });
    }

    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const verifyJwtStatus = jwt.verify(token, config.JWT_SALT); // JWT verify

        if (!verifyJwtStatus) {
            return res.status(401).send({
                message: 'Protected resource, use Authorization header to get access.',
            });
        }
        let userId = CryptoJS.AES.decrypt(verifyJwtStatus.user, config.SECRET_KEY); // Decrypt user ID
        userId = userId.toString(CryptoJS.enc.Utf8);

        //Check the token generated userAgent is equal to req userAgent

        // if (verifyJwtStatus.browser !== userAgent.browser || verifyJwtStatus.os !== userAgent.os || verifyJwtStatus.platform !== userAgent.platform) {
        //     return res.status(401).send({
        //         message: 'This token is not valid for this system.'
        //     });
        // }

        //Check user exist in the database
        sesstion.findOne({
            sessionId: verifyJwtStatus.sessionId,
            status: common.status.ACTIVE
        }).exec(function (err, sessionInfo) {
            if (sessionInfo) {
                req.userId = sessionInfo.employeeId;
                req.sessionId = verifyJwtStatus.sessionId;
                next();
            } else {
                return res.status(401).send({
                    message: 'Protected resource, use Authorization header to get access.',
                });
            }
        });

        //Restrict the multiple device login for one user
        // if (userExist.accessToken !== token) {
        //     return res.status(401).send({
        //         message: ' Authorization token mismatched!.',
        //     });
        // }

    } catch (err) {

        console.log(err);
        return res.status(401).send({
            message: ' Authorization token verification failed!.',
        });

    }
}
