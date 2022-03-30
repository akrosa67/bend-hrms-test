const ObjectId = require('mongodb').ObjectId;
const Lead = require('../../models/lead/lead-model');
const Company = require('../../models/company-model');
const Branch = require('../../models/branch-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add lead  details in db
 */

module.exports.addLead = (req, res) => {
    try {

        const newLead = new Lead({
            leadType: req.body.leadType,
            companyId: req.body.companyId,
            branchId: req.body.branchId,
            leadSourceId: req.body.leadSourceId,
            leadSubSourceId: req.body.leadSubSourceId,
            leadServiceId: req.body.leadServiceId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            contact: req.body.contact,
            clientLocation: req.body.clientLocation,
            emailId: req.body.emailId,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode,
            descriptions: req.body.descriptions,
            customField: req.body.customField,
            priorityStatusId: req.body.priorityStatusId,
            processStatus: req.body.processStatus,
            forwardedTo: req.body.forwardedTo,
            activity: req.body.activity,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newLead.save(async (error, lead) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else {


                const companyId = { _id: lead.companyId };

                const updateObj = {
                    $push: { leades: lead._id }
                };

                // Update lead-id in company & branch table

                await Company.findOneAndUpdate(companyId, updateObj);

                const branchId = { _id: lead.branchId };

                await Branch.findOneAndUpdate(branchId, updateObj);

                responseHandlier.successResponse(true, 'Successfully Inserted', res);
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
 * @returns to get all lead  details in db
 */

module.exports.getAllLead = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        if (req.body.mobileNo) {

            filterObj = {
                ...filterObj, $or: [
                    {
                        'contact.primaryMobile.number': req.body.mobileNo
                    },
                    {
                        'contact.secondaryMobile.number': req.body.mobileNo
                    },
                    {
                        'contact.whatsAppNo.number': req.body.mobileNo
                    }
                ]
            }

        }

        if (req.body.leadType) {

            filterObj.leadType = req.body.leadType;

        }

        if (req.body.companyId) {

            filterObj.companyId = req.body.companyId;

        }

        if (req.body.branchId) {

            filterObj.branchId = req.body.branchId;

        }

        if (req.body.priorityStatusId) {

            filterObj.priorityStatusId = req.body.priorityStatusId;

        }

        if (req.body.processStatusId) {

            filterObj = {
                ...filterObj, ...{ 'processStatus.id': ObjectId(req.body.processStatusId) }
            }

        }

        if (req.body.leadServiceId) {

            filterObj.leadServiceId = req.body.leadServiceId;

        }

        if (req.body.leadSourceId) {

            filterObj.leadSourceId = req.body.leadSourceId;

        }

        if (req.body.leadSubSourceId) {

            filterObj.leadSubSourceId = req.body.leadSubSourceId;

        }

        if (req.body.employeeId) {

            filterObj = {
                ...filterObj, ...{
                    leadAssign: { $elemMatch: { assignedTo: ObjectId(req.body.employeeId), status: common.status.ACTIVE } }
                }
            }

        }

        Lead.find(filterObj,
            { status: 0, insertedBy: 0, updatedBy: 0, createdAt: 0, updatedAt: 0 },
            (error, lead) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (lead) {
                    responseHandlier.successResponse(true, lead, res);
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
 * @returns to get lead  details by id in db
 */

module.exports.getByLeadId = (req, res) => {

    try {

        if (!req.query.leadId) {
            return responseHandlier.errorResponse(false, "Lead  id is required.", res);
        }

        const leadId = {
            _id: ObjectId(req.query.leadId)
        };

        Lead.findOne(leadId,
            { status: 0, insertedBy: 0, updatedBy: 0, createdAt: 0, updatedAt: 0 },
            (error, leadDetails) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (leadDetails) {
                    responseHandlier.successResponse(true, leadDetails, res);
                } else {
                    responseHandlier.errorResponse(true, 'Please provide the valid lead  id', res);
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
 * @returns to update lead  details by id
 */

module.exports.updateByLeadId = function (req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Lead  id is required.", res);
        }

        const leadId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Lead.findByIdAndUpdate(leadId, requestData, { new: true }, function (err, leadDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, leadDetails, res);
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
 * @returns to delete lead  details by id in db
 */

module.exports.deleteByLeadId = function (req, res) {

    try {

        if (!req.query.leadId) {
            return responseHandlier.errorResponse(false, "Lead  id is required.", res);
        }

        const leadId = {
            _id: ObjectId(req.query.leadId)
        };

        const requestData = {
            $set: {
                status: common.status.DELETE,
                updatedBy: ObjectId(req.userId)
            }
        };

        Lead.updateOne(leadId, requestData, function (error, leadDetails) {
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
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get lead count based on status details by id in db
 */

module.exports.getLeadCountByStatus = (req, res) => {

    try {

        const query = [
            {
                $match: { status: common.status.ACTIVE }
            },
            {
                $group: {
                    _id: "$processStatus.id",
                    count: {
                        $sum: 1,
                    },
                    status: { $last: "$processStatus.statusName" },
                }
            }
        ];

        Lead.aggregate(query, (error, leadList) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (leadList) {
                responseHandlier.successResponse(true, leadList, res);
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
 * @returns to get lead based on employee details by id in db
 */

module.exports.getLeadBasedOnEmployee = (req, res) => {

    try {

        const query = [
            {
                $match: {
                    status: common.status.ACTIVE,
                    "leadAssign.status": { $in: [common.status.ACTIVE] }
                }
            },
            {
                $group: {
                    _id: "$leadAssign.assignedTo",
                    count: {
                        $sum: 1,
                    },
                    leadDetails: { "$push": "$$ROOT" }
                }
            }
        ];

        Lead.aggregate(query, (error, leadList) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (leadList) {
                responseHandlier.successResponse(true, leadList, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}
