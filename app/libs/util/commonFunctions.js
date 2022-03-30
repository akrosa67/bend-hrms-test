const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const common = require('../../libs/static/common');


/**
 * @param {*} arr1 
 * @param {*} arr2 
 * @param {*} returnObjName 
 * @returns Formatted menu 
 */

module.exports.formatArrayOfObj = (arr1, arr2, returnObjName) => {

    try {

        const resultArr1 = Object.entries(arr1).map(([key, value]) => {

            const resultArr2 = arr2.map(item => {

                let temp = JSON.parse(JSON.stringify(item));

                if (key.toString() == temp.menuId._id.toString()) {

                    if (temp.menuId[returnObjName] && temp.menuId[returnObjName].length) {

                        temp.menuId[returnObjName].push(value);

                    } else {

                        temp.menuId[returnObjName] = value;

                    }
                }

                return temp;

            });

            arr2 = resultArr2;

            return resultArr2;
        });

        arr1 = resultArr1;

        return resultArr1;


    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

/**
 * @_Upload_FN
 */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('./uploads')) {
            fs.mkdir('./uploads', { recursive: true }, err => { })
        }
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    },
});

module.exports.upload = multer({
    storage: storage
});

/**
 * @_filterObj
 * @param {*} reqData 
 * @returns 
 */

module.exports.filterObject = (req) => {
    try {

        let filterObj = {};

        if (req.body.status) {

            const statusVal = findStatusVal(req.body.status);
            filterObj = { status: statusVal };

        }

        if (req.body.id) {

            filterObj._id = ObjectId(req.body.id);

        }

        return filterObj;

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return common.errorMsg.SWW;;
    }
}


/**
 * @_findStatusVal
 * @param {status string} reqStatus 
 * @returns 
 */


function findStatusVal(reqStatus) {

    try {

        switch (reqStatus) {
            case 'active':
                reqStatus = common.status.ACTIVE;
                break;
            case 'inActive':
                reqStatus = common.status.IN_ACTIVE;
                break;
            case 'delete':
                reqStatus = common.status.DELETE;
                break;
            default:
                reqStatus = {};

        }

        return reqStatus;

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return common.errorMsg.SWW;
    }

}

// For use to find status value in external

module.exports.findStatusVal = findStatusVal;

module.exports.incrementString = function incrementString(string) {
    var number = string.match(/\d+/) === null ? 0 : string.match(/\d+/)[0];
    var numberLength = number.length
    number = (parseInt(number) + 1).toString();

    while (number.length < numberLength) {
        number = "0" + number;
    }
    return string.replace(/[0-9]/g, '').concat(number);
}