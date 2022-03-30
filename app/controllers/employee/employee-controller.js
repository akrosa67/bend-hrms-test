const validator = require('validator');
const ObjectId = require('mongodb').ObjectId;
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const Employee = require('../../models/employee-model');
const Role = require('../../models/role-model');
const Session = require('../../models/employee/session-model');
const responseHandlier = require('../../libs/response/status');
const tokenGenerator = require('../../libs/util/token-generator');
const common = require('../../libs/static/common');
const commonFunctions = require('../../libs/util/commonFunctions');



/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add employee details in db
 */

module.exports.addEmployee = (req, res) => {
    try {

        if (!req.body.email) {
            return responseHandlier.response(false, " Email is required.", res);
        }

        if (!validator.isEmail(req.body.email)) {
            return responseHandlier.response(false, "Please enter valid email address.", res);
        }

        let query = {
            email: req.body.email
        }

        Employee.findOne(query, function (error, employee) {

            if (error) {
                return responseHandlier.errorResponse(false, error, res);
            }

            if (employee) {
                return responseHandlier.errorResponse(false, "This email address has already been registered.", res);
            }

            const newEmployee = new Employee({
                companyId: req.body.companyId,
                branchId: req.body.branchId,
                onboardId: req.body.onboardId,
                departmentId: req.body.departmentId,
                designationId: req.body.designationId,
                roleId: req.body.roleId,
                empCode: req.body.empCode,
                name: req.body.name,
                dob: req.body.dob,
                mobileNo: req.body.mobileNo,
                alterMobileNo: req.body.alterMobileNo,
                email: req.body.email,
                maritalStatus: req.body.maritalStatus,
                age: req.body.age,
                gender: req.body.gender,
                homeTown: req.body.homeTown,
                area: req.body.area,
                settledIn: req.body.settledIn,
                pAddress: req.body.pAddress,
                tAddress: req.body.tAddress,
                profileImage: req.body.profileImage,
                biometricAccess: req.body.biometricAccess,
                doj: req.body.doj,
                callVerify: req.body.callVerify,
                trainingBranch: req.body.trainingBranch,
                username: req.body.username,
                password: req.body.password,
                empStatus: common.status.ACTIVE,
                status: common.status.ACTIVE,
                insertedBy: ObjectId(req.userId),
                updatedBy: ObjectId(req.userId)
            });

            newEmployee.save((error, employee) => {
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
 * @returns to get all employee details in db
 */

module.exports.getAllEmployee = (req, res) => {
    try {

        const filterObj = commonFunctions.filterObject(req);

        Employee.find(filterObj, (error, employeeList) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (employeeList) {
                responseHandlier.successResponse(true, employeeList, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to get all employee list in db
 */

module.exports.getAllEmployeeList = (req, res) => {
    try {
        let condition = {}
        if (req.body.empId) {
            condition._id = ObjectId(req.body.empId);
        }
        if (req.body.empCode) {
            condition.empCode = req.body.empCode;
        }
        if (req.body.mobileNo) {
            condition.mobileNo = req.body.mobileNo;
        }
        if (req.body.companyId) {
            condition.companyId = ObjectId(req.body.companyId);
        }
        if (req.body.branchId) {
            condition.branchId = ObjectId(req.body.branchId);
        }
        if (req.body.departmentId) {
            condition.departmentId = ObjectId(req.body.departmentId);
        }
        if (req.body.designationId) {
            condition.designationId = ObjectId(req.body.designationId);
        }
        if (req.body.roleId) {
            condition.roleId = ObjectId(req.body.roleId);
        }
        if (req.body.status) {
            condition.status = ObjectId(req.body.status);
        } else {
            condition.status = common.status.ACTIVE;
        }


        const query = [{
            $match: condition
        },
        {
            $lookup: {
                from: 'designations',
                localField: "designationId",
                foreignField: "_id",
                as: 'designation',
            }
        },
        {
            $lookup: {
                from: 'departments',
                localField: "departmentId",
                foreignField: "_id",
                as: 'department',
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: "companyId",
                foreignField: "_id",
                as: 'company',
            }
        },
        {
            $lookup: {
                from: 'branches',
                localField: "branchId",
                foreignField: "_id",
                as: 'branch',
            }
        },
        {
            $lookup: {
                from: 'roles',
                localField: "roleId",
                foreignField: "_id",
                as: 'role',
            }
        },
        {
            $project: {
                _id: 1,
                companyId: 1,
                branchId: 1,
                onboardId: 1,
                departmentId: 1,
                designationId: 1,
                roleId: 1,
                branchName: "$branch.name",
                companyName: "$company.name",
                designationName: "$designation.name",
                departmentName: "$department.name",
                roleName: "$role.name",
                empCode: 1,
                name: 1,
                dob: 1,
                mobileNo: 1,
                alterMobileNo: 1,
                email: 1,
                maritalStatus: 1,
                age: 1,
                gender: 1,
                homeTown: 1,
                area: 1,
                settledIn: 1,
                pAddress: 1,
                tAddress: 1,
                profileImage: 1,
                biometricAccess: 1,
                doj: 1,
                callVerify: 1,
                trainingBranch: 1,
                username: 1,
                password: 1,
                empStatus: 1,
                status: 1,
                kyc_received_documents: 1,
                bank: 1,
                family_details: 1,
                reference: 1,
                hike: 1,
                forward: 1

            }
        }
        ];

        Employee.aggregate(query, (error, employeeList) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (employeeList) {
                responseHandlier.successResponse(true, employeeList, res);
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
 * @returns to get employee details by id in db
 */

module.exports.getByEmployeeId = (req, res) => {

    try {

        if (!req.query.employeeId) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.query.employeeId)
        };

        Employee.findOne(employeeId, (error, employeeDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (employeeDetails) {
                responseHandlier.successResponse(true, employeeDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid Access Id', res);
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
 * @returns to update employee details by id
 */

module.exports.updateByEmployeeId = function (req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Employee.findByIdAndUpdate(employeeId, requestData, { new: true }, function (err, employeeDetails) {
            if (err) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, employeeDetails, res);
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
 * @returns to delete employee details by id in db
 */

module.exports.deleteByEmployeeId = function (req, res) {

    try {

        if (!req.query.employeeId) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.query.employeeId)
        };

        const requestData = {
            $set: {
                status: common.status.DELETE,
                updatedBy: ObjectId(req.userId)
            }
        };

        Employee.updateOne(employeeId, requestData, function (error, employeeDetails) {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, 'Successfully Deleted', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to authenticate employee's credentials in db
 */

module.exports.login = function (req, res) {

    try {

        if (!req.body.username || !req.body.password) {
            return responseHandlier.errorResponse(false, 'Bad request - you need to provide an username and a password', res);
        }

        let query = {
            username: req.body.username
        }

        Employee.findOne(query, function (err, employee) {

            if (err) {
                return responseHandlier.errorResponse(false, err, res);
            }

            if (!employee) {
                return responseHandlier.errorResponse(false, "Details not recognised, please try again.", res);
            } else {

                employee.comparePassword(req.body.password, async function (err, isMatch) {

                    if (isMatch && !err) {

                        const sessionUuid = uuidv4();

                        employee.newSessionId = sessionUuid;

                        const token = await tokenGenerator.generateToken(req, employee);

                        const employeeId = {
                            _id: employee._id
                        };

                        const sessionInfo = new Session({
                            sessionId: sessionUuid,
                            employeeId: employee._id,
                            isLogin: true,
                            token: token,
                            status: common.status.ACTIVE
                        });



                        // if (employee.sessionInfo.length) {

                        // }

                        // Session.

                        sessionInfo.save(async (error, session) => {
                            if (error) {
                                responseHandlier.errorResponse(false, error, res);
                            } else {

                                const requestData = {
                                    $push: {
                                        sessionId: session._id
                                    }
                                };

                                delete sessionInfo.employeeId;

                                const responseObject = {
                                    id: employee._id,
                                    name: employee.name,
                                    email: employee.email,
                                    roleId: employee.roleId,
                                    menu: await getRoleBasedMenu(res, employee.roleId),
                                    sessionInfo: sessionInfo,
                                };

                                Employee.updateOne(employeeId, requestData, (error, employeeDetails) => {
                                    if (error) {
                                        responseHandlier.errorResponse(false, error, res);
                                    } else {
                                        responseHandlier.successResponse(true, responseObject, res);
                                    }
                                });
                            }
                        });


                    } else {
                        return responseHandlier.errorResponse(false, "The email or password do not match.", res);
                    }

                });

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
 * @Desc to clear employee's session in db
 */

module.exports.logout = (req, res) => {

    try {

        if (!req.userId) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }

        const employeeId = {
            employeeId: ObjectId(req.userId),
            sessionId: req.sessionId
        };

        const requestData = {
            $set: {
                status: common.status.DELETE,
                isLogin: false
            }
        };

        Session.updateOne(employeeId, requestData, function (error, sessionDetails) {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else {
                responseHandlier.successResponse(true, "Successfully logged out!", res);
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
 * @returns session based user info
 */

module.exports.getSessionUserInfo = (req, res) => {

    try {

        if (!req.userId) {
            return responseHandlier.errorResponse(false, 'Bad request - Invalid token', res);
        }

        let query = {
            _id: ObjectId(req.userId)
        }

        Employee.findOne(query, async function (err, employee) {

            if (err) {
                return responseHandlier.errorResponse(false, err, res);
            }

            if (!employee) {
                return responseHandlier.errorResponse(false, "Details not recognised, please try again.", res);
            } else {

                const sessionUuid = uuidv4();

                employee.sessionId = sessionUuid;

                const token = await tokenGenerator.generateToken(req, employee);

                const employeeId = {
                    _id: employee._id
                };

                const sessionInfo = {
                    sessionId: sessionUuid,
                    isLogin: true,
                    token: token,
                    status: common.status.ACTIVE
                };

                const requestData = {
                    $push: {
                        sessionInfo
                    }
                };

                const responseObject = {
                    id: employee._id,
                    name: employee.name,
                    email: employee.email,
                    roleId: employee.roleId,
                    menu: await getRoleBasedMenu(res, employee.roleId),
                    sessionInfo: sessionInfo,
                };

                // if (employee.sessionInfo.length) {

                // }

                Employee.updateOne(employeeId, requestData, (error, employeeDetails) => {
                    if (error) {
                        responseHandlier.errorResponse(false, error, res);
                    } else {
                        responseHandlier.successResponse(true, responseObject, res);
                    }
                });

            }

        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}


/**
 * @param {*} res 
 * @param {*} roleId 
 * @returns formated menu
 */


const getRoleBasedMenu = (res, roleId) => {

    try {

        return new Promise(resolve => {

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

                        const commonGroup = _.groupBy(roleDetails.permission, "menuId.menuType");

                        const itemGroup = _.groupBy(commonGroup.menuItem, "menuId.menuReferenceId");

                        const menuSubHeaderGroup = commonGroup.menuSubHeader;

                        const menuItemFormatSubHeader = commonFunctions.formatArrayOfObj(itemGroup, menuSubHeaderGroup, "menuItem");

                        const lenOfMenuItemFormatSubHeader = menuItemFormatSubHeader.length;

                        const subHeaderGroup = _.groupBy(menuItemFormatSubHeader[lenOfMenuItemFormatSubHeader - 1], "menuId.menuReferenceId");

                        const headerGroup = commonGroup.menuHeader;

                        const menuSubHeaderFormatHeader = commonFunctions.formatArrayOfObj(subHeaderGroup, headerGroup, "menuSubHeader");

                        const lenOfMenuSubHeaderFormatHeader = menuSubHeaderFormatHeader.length;

                        return resolve(menuSubHeaderFormatHeader[lenOfMenuSubHeaderFormatHeader - 1]);

                    } else {
                        responseHandlier.errorResponse(true, 'Please provide the valid Role Id', res);
                    }
                });

        });
    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}