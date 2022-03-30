const ObjectId = require('mongodb').ObjectId;
const Lead = require('../../models/lead/lead-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


const leadAssignSelectedObj = {
    'leadAssign._id': 1,
    'leadAssign.assignedTo': 1,
    'leadAssign.leadStatus': 1,
    'leadAssign.assignedAt': 1
};

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add lead assign details in db
 */

module.exports.addLeadAssign = (req, res) => {
    try {

        const reqBody = req.body;

        if (!reqBody._id) {
            return responseHandlier.errorResponse(false, "Lead  id is required.", res);
        }

        const leadId = {
            _id: ObjectId(reqBody._id)
        };

        Lead.findById(leadId, ((error, leadDetails) => {
            if (error) {
                return responseHandlier.errorResponse(false, error, res);
            } else if (leadDetails.leadAssign.length) {
                return responseHandlier.successResponse(true, "Lead has been assigned to someone!", res);
            }

        }));

        reqBody.leadAssignObj.insertedBy = ObjectId(req.userId);
        reqBody.leadAssignObj.createdAt = new Date();
        reqBody.leadAssignObj.updatedAt = new Date();
        reqBody.leadAssignObj.status = common.status.ACTIVE;


        const requestData = {
            $set: {
                leadAssign: reqBody.leadAssignObj
            }
        };

        req.leadId = leadId;
        req.leadData = requestData;

        return updateLeadAssign(req, res);


    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all lead assign service details in db
 */

module.exports.getAllLeadAssign = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);
        
        Lead.find(filterObj, { leadAssign: 1 }, (error, leadDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (leadDetails) {
                responseHandlier.successResponse(true, leadDetails, res);
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
 * @returns to get lead assign details by id in db
 */

module.exports.getByLeadAssignId = (req, res) => {

    try {

        if (!req.query.leadAssignId) {
            return responseHandlier.errorResponse(false, "Lead assign id is required.", res);
        }

        const leadId = {
            'leadAssign$._id': ObjectId(req.query.leadAssignId)
        };

        Lead.findOne(leadId,
            leadAssignSelectedObj,
            (error, leadDetails) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (leadDetails) {
                    responseHandlier.successResponse(true, leadDetails, res);
                } else {
                    responseHandlier.errorResponse(true, 'Please provide the valid lead id', res);
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

module.exports.updateByLeadAssignId = function (req, res) {

    try {

        const reqBody = req.body;

        if (reqBody.leadAssignId) {

            const leadAssignId = {
                'leadAssign._id': ObjectId(reqBody.leadAssignId)
            };

            Lead.findOne(leadAssignId, ((error, leadDetails) => {

                if (error) {
                    return responseHandlier.errorResponse(false, error, res);
                } else if (leadDetails) {

                    let formatedRequsetObject = {
                        'leadAssign.$.updatedBy': ObjectId(req.userId),
                        'leadAssign.$.updatedAt': new Date()
                    }

                    Object.entries(reqBody.leadAssignObj).map(([key, value]) => {
                        if (value) {
                            formatedRequsetObject = {
                                ...formatedRequsetObject, ['leadAssign.$.' + key]: value
                            }
                        }
                    });

                    const requestData = {
                        $set: formatedRequsetObject
                    };

                    req.leadId = leadAssignId;
                    req.leadData = requestData;

                    return updateLeadAssign(req, res);
                }

            }));

        } else if (!reqBody.leadAssignId) {

            if (!reqBody._id) {
                return responseHandlier.errorResponse(false, "Lead id is required.", res);
            }

            const leadId = {
                _id: ObjectId(reqBody._id)
            };

            Lead.findById(leadId, ((error, leadDetails) => {

                if (error) {
                    return responseHandlier.errorResponse(false, error, res);
                } else if (leadDetails.leadAssign.length >= 1) {

                    if (!reqBody._id) {
                        return responseHandlier.errorResponse(false, "Lead  id is required.", res);
                    }

                    const leadAssignStatus = {
                        'leadAssign.status': common.status.ACTIVE
                    }

                    const assignStatus = {
                        leadAssign: { $elemMatch: { status: common.status.ACTIVE } }
                    }

                    Lead.findOne(leadAssignStatus, assignStatus, leadAssignSelectedObj, ((error, leadDetails) => {

                        if (error) {
                            return responseHandlier.errorResponse(false, error, res);
                        } else if (leadDetails.leadAssign.length >= 1) {

                            const leadAssignId = {
                                'leadAssign._id': ObjectId(leadDetails.leadAssign[0]._id)
                            };

                            reqBody.leadAssignObj.insertedBy = ObjectId(req.userId);
                            reqBody.leadAssignObj.createdAt = new Date();
                            reqBody.leadAssignObj.updatedAt = new Date();
                            reqBody.leadAssignObj.status = common.status.ACTIVE;


                            let requestData = {
                                $set: {
                                    'leadAssign.$.status': common.status.DELETE,
                                    'leadAssign.$.updatedBy': ObjectId(req.userId),
                                    'leadAssign.$.updatedAt': new Date()
                                }
                            };


                            Lead.findOneAndUpdate(leadAssignId, requestData, { new: true }, ((error, leadDetails) => {
                                if (error) {
                                    responseHandlier.errorResponse(false, error, res);
                                } else {

                                    requestData = {
                                        $push: {
                                            leadAssign: reqBody.leadAssignObj
                                        }
                                    };
                                    req.leadId = leadId;
                                    req.leadData = requestData;

                                    return updateLeadAssign(req, res);
                                }
                            }));
                        }
                    }));
                }

            }));
        }

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}


/**
 * @DELETE
 * @param {*} req
 * @param {*} res
 * @returns to delete lead assign details by id in db
 */

module.exports.deleteByLeadAssignId = function (req, res) {

    try {

        if (!req.query.leadAssignId) {
            return responseHandlier.errorResponse(false, "Lead assign id is required.", res);
        }

        const leadAssignId = {
            'leadAssign._id': ObjectId(req.query.leadAssignId)
        };

        const requestData = {
            $set: {
                'leadAssign.$.status': common.status.DELETE,
                'leadAssign.$.updatedBy': ObjectId(req.userId),
                'leadAssign.$.updatedAt': new Date()
            }
        };

        Lead.findOneAndUpdate(leadAssignId, requestData, { new: true }, function (error, leadDetails) {
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



function updateLeadAssign(req, res) {

    try {

        Lead.findOneAndUpdate(req.leadId, req.leadData, { new: true }, ((error, leadDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else {
                responseHandlier.successResponse(true, leadDetails, res);
            }
        }));

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

