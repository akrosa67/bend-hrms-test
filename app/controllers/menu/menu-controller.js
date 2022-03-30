const ObjectId = require('mongodb').ObjectId;
const Menu = require('../../models/menu/menu-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add menu details in db
 */

module.exports.addMenu = (req, res) => {
    try {

        if (!req.body.menuName) {
            return responseHandlier.errorResponse(false, "Menu name is required.", res);
        }

        let query = {
            menuName: req.body.menuName.toLowerCase(),
            menuType: req.body.menuType
        }

        Menu.findOne(query, function(err, menuDetails) {

            if (err) {
                return responseHandlier.errorResponse(false, err, res);
            } else if (menuDetails) {
                return responseHandlier.errorResponse(false, "This menu name has already been registered.", res);
            }

            let newMenu = new Menu({
                menuName: req.body.menuName.toLowerCase(),
                menukey: req.body.menukey,
                menuType: req.body.menuType,
                accMain: req.body.accMain,
                menuReferenceId: req.body.menuReferenceId,
                isNew: req.body.isNew,
                status: common.status.ACTIVE,
                insertedBy: ObjectId(req.userId),
                updatedBy: ObjectId(req.userId)
            });

            newMenu.save((error, menu) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res);
                } else {
                    responseHandlier.successResponse(true, 'Successfully Inserted', res);
                }
            });

        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}



function addRolePermission(permission, res) {

    try {

        if (permission.length) {

            permission.forEach((item, index) => {

                const roleId = {
                    _id: ObjectId(item.roleId)
                };

                Role.findOne(roleId, function(error, roleDetails) {

                    if (error) {
                        responseHandlier.errorResponse(false, error, res);
                    } else if (roleDetails) {

                        delete item.roleId;

                        const requestData = {
                            $push: { permission: item }
                        };

                        Role.updateOne(roleId, requestData, function(error, roleDetails) {
                            if (error) {
                                responseHandlier.errorResponse(false, error, res);
                            } else {

                                if (index + 1 === permission.length) {
                                    responseHandlier.successResponse(true, 'Successfully Inserted', res);
                                }
                            }
                        });
                    }
                });
            });
        }

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}


/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all menu details in db
 */

module.exports.getAllMenu = (req, res) => {
    try {

        const query = [{
                $match: { status: commonFunction.findStatusVal(req.body.status) }
            },
            {
                $group: {
                    _id: "$menuType",
                    count: {
                        $sum: 1,
                    },
                    menu: { "$push": "$$ROOT" }
                }
            }
        ];


        Menu.aggregate(query, (error, menuList) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (menuList) {
                responseHandlier.successResponse(true, menuList, res);
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
 * @returns to get menu details by id in db
 */

module.exports.getByMenuId = (req, res) => {

    try {

        if (!req.query.menuId) {
            return responseHandlier.errorResponse(false, "Menu Id is required.", res);
        }

        const menuId = {
            _id: ObjectId(req.query.menuId)
        };

        Menu.findOne(menuId, (error, menuDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else if (menuDetails) {
                responseHandlier.successResponse(true, menuDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid menu Id', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

/**
 * @PUT
 * @param {*} req
 * @param {*} res
 * @returns to update menu details by id
 */

module.exports.updateByMenuId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Menu Id is required.", res);
        }

        const menuId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Menu.findByIdAndUpdate(menuId, requestData, { new: true }, function(error, menuDetails) {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else {

                // req.body.permission.menuId = req.body._id
                // return addRolePermission(req.body.permission, res, menuDetails);

                responseHandlier.successResponse(true, 'Successfully updated', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

/**
 * @DELETE
 * @param {*} req
 * @param {*} res
 * @returns to delete menu details by id in db
 */

module.exports.deleteByMenuId = function(req, res) {

    try {

        if (!req.body.menuId) {
            return responseHandlier.errorResponse(false, "Menu Id is required.", res);
        }

        const menuId = req.body.menuId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        Menu.updateMany({ _id: { $in: menuId } }, requestData, function(error, menuDetails) {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, 'Successfully Updated', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}