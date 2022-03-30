const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');
const Role = require('../models/role-model');
const Employee = require('../models/employee-model');
const responseHandlier = require('../libs/response/status');
const common = require('../libs/static/common');
const commonFunctions = require('../libs/util/commonFunctions');

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add role details in db
 */

module.exports.addRole = (req, res) => {
    try {


        if (!req.body.name) {
            return responseHandlier.errorResponse(false, "Name is required.", res);
        }

        let query = {
            name: req.body.name.toLowerCase()
        }

        Role.findOne(query, function (err, roleDetails) {

            if (err) {
                return responseHandlier.errorResponse(false, err, res);
            } else if (roleDetails) {
                return responseHandlier.errorResponse(false, "This role name has already been registered.", res);
            }

            let newRole = new Role({
                name: req.body.name.toLowerCase(),
                shortName: req.body.shortName,
                description: req.body.description,
                mode: req.body.mode,
                status: common.status.ACTIVE,
                insertedBy: ObjectId(req.userId),
                updatedBy: ObjectId(req.userId)
            });

            newRole.save((error, user) => {
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

/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all role details in db
 */

module.exports.getAllRoles = (req, res) => {
    try {

        const filterObj = commonFunctions.filterObject(req);

        Role.find(filterObj)
            .populate({
                path: 'permission.menuId',
                select: common.select.MENU_AG,
                match: { status: common.status.ACTIVE }
            })
            .populate({
                path: 'permission.access',
                select: common.select.ACCESS_AG,
                match: { status: common.status.ACTIVE }
            })
            .exec((error, roles) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (roles) {
                    responseHandlier.successResponse(true, roles, res);
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
 * @returns to get role details by id in db
 */

module.exports.getByRoleId = (req, res) => {

    try {

        if (!req.query.roleId) {
            return responseHandlier.errorResponse(false, "Role Id is required.", res);
        }

        const roleId = {
            _id: ObjectId(req.query.roleId)
        };

        Role.findOne(roleId)
            .populate({
                path: 'permission.menuId',
                select: common.select.MENU_AG,
                match: { status: common.status.ACTIVE }
            })
            .populate({
                path: 'permission.access',
                select: common.select.ACCESS_AG,
                match: { status: common.status.ACTIVE }
            })
            .exec((error, roleDetails) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (roleDetails) {

                    let formatedMenu = roleDetails.permission;

                    if (roleDetails.permission && roleDetails.permission.length > 1) {

                        const commonGroup = _.groupBy(roleDetails.permission, "menuId.menuType");

                        const itemGroup =
                            commonGroup.menuItem && commonGroup.menuItem.length ?
                                _.groupBy(commonGroup.menuItem, "menuId.menuReferenceId") : [];

                        if (itemGroup) {

                            const menuSubHeaderGroup = commonGroup.menuSubHeader;

                            const menuItemFormatSubHeader = commonFunctions.formatArrayOfObj(itemGroup, menuSubHeaderGroup, "menuItem");

                            const lenOfMenuItemFormatSubHeader = menuItemFormatSubHeader.length;

                            const subHeaderGroup = _.groupBy(menuItemFormatSubHeader[lenOfMenuItemFormatSubHeader - 1], "menuId.menuReferenceId");

                            const headerGroup = commonGroup.menuHeader;

                            formatedMenu = commonFunctions.formatArrayOfObj(subHeaderGroup, headerGroup, "menuSubHeader");

                            formatedMenu = formatedMenu[formatedMenu.length - 1];

                        }

                    }
                    const responseObj = {
                        _id: roleDetails._id,
                        name: roleDetails.name,
                        shortName: roleDetails.shortName,
                        description: roleDetails.description,
                        mode: roleDetails.mode,
                        permission: formatedMenu
                    }

                    responseHandlier.successResponse(true, responseObj, res);
                } else {
                    responseHandlier.errorResponse(true, 'Please provide the valid Role Id', res);
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
 * @returns to update role details by id
 */

module.exports.updateByRoleId = function (req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Role Id is required.", res);
        }

        const roleId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Role.findByIdAndUpdate(roleId, requestData, { new: true }, function (error, roleDetails) {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else {
                responseHandlier.successResponse(true, roleDetails, res);
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
 * @returns to delete role details by id in db
 */

module.exports.deleteByRoleId = async function (req, res) {

    try {

        if (!req.body.roleId) {
            return responseHandlier.errorResponse(false, "Role Id is required.", res);
        }
        const roleId = req.body.roleId;



        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };
        let RoleIdData = [];
        let nonRoleIdData = [];
        for (let i = 0; i < roleId.length; i++) {
            let employeeData = await Employee.find({ roleId: ObjectId(roleId[i]) });

            if (employeeData.length > 0) {
                nonRoleIdData.push(roleId[i]);
            } else {
                RoleIdData.push(roleId[i]);
            }
        }
        let data = [{ "UpdatedData": RoleIdData, "NonUpdatedData": nonRoleIdData }];


        Role.updateMany({ _id: { $in: RoleIdData } }, requestData, function (err, roleDetails) {
            if (err) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, data, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}