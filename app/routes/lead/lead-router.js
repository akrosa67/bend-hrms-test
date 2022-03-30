/**
 * @param {*} router 
 * @Desc Router for getting 'Lead' resources
 */

module.exports = function(router) {

    const sourceController = require('../../controllers/lead/source-controller');
    const subSourceController = require('../../controllers/lead/sub-source-controller');
    const processStatusController = require('../../controllers/lead/process-status-controller');
    const priorityController = require('../../controllers/lead/priority-controller');
    const leadServiceController = require('../../controllers/lead/lead-service-controller');
    const customFieldController = require('../../controllers/lead/custom-fields-controller');
    const leadController = require('../../controllers/lead/lead-controller');
    const leadAssignController = require('../../controllers/lead/lead-assign-controller');
    const middleware = require('../../libs/util/token-validator-middleware');

    /**
     * @SOURCE_API
     */

    router.post('/add_source', middleware.checkAuth, sourceController.addSource);

    router.post("/get_all_source", middleware.checkAuth, sourceController.getAllSources);

    router.get("/get_source_by_id", middleware.checkAuth, sourceController.getBySourceId);

    router.put("/update_source_by_id", middleware.checkAuth, sourceController.updateBySourceId);

    router.put("/delete_source_by_id", middleware.checkAuth, sourceController.deleteBySourceId);


    /**
     * @SUB_SOURCE_API
     */

    router.post('/add_sub_source', middleware.checkAuth, subSourceController.addSubSource);

    router.post("/get_all_sub_source", middleware.checkAuth, subSourceController.getAllSubSources);

    router.get("/get_sub_source_by_id", middleware.checkAuth, subSourceController.getBySubSourceId);

    router.put("/update_sub_source_by_id", middleware.checkAuth, subSourceController.updateBySubSourceId);

    router.put("/delete_sub_source_by_id", middleware.checkAuth, subSourceController.deleteBySubSourceId);



    /**
     * @PROCESS_STATUS_API
     */

    router.post('/add_process_status', middleware.checkAuth, processStatusController.addProcessStatus);

    router.post("/get_all_process_status", middleware.checkAuth, processStatusController.getAllProcessStatus);

    router.get("/get_process_status_by_id", middleware.checkAuth, processStatusController.getByProcessStatusId);

    router.put("/update_process_status_by_id", middleware.checkAuth, processStatusController.updateByProcessStatusId);

    router.put("/delete_process_status_by_id", middleware.checkAuth, processStatusController.deleteByProcessStatusId);


    /**
     * @PRIORITY_API
     */

    router.post('/add_priority', middleware.checkAuth, priorityController.addPriority);

    router.post("/get_all_priority", middleware.checkAuth, priorityController.getAllPriority);

    router.get("/get_priority_by_id", middleware.checkAuth, priorityController.getByPriorityId);

    router.put("/update_priority_by_id", middleware.checkAuth, priorityController.updateByPriorityId);

    router.put("/delete_priority_by_id", middleware.checkAuth, priorityController.deleteByPriorityId);


    /**
     * @LEAD_SERVICE_API
     */

    router.post('/add_lead_service', middleware.checkAuth, leadServiceController.addLeadService);

    router.post("/get_all_lead_service", middleware.checkAuth, leadServiceController.getAllLeadService);

    router.get("/get_lead_service_by_id", middleware.checkAuth, leadServiceController.getByLeadServiceId);

    router.put("/update_lead_service_by_id", middleware.checkAuth, leadServiceController.updateByLeadServiceId);

    router.put("/delete_lead_service_by_id", middleware.checkAuth, leadServiceController.deleteByLeadServiceId);



    /**
     * @CUSTOM_FIELDS_API
     */

    router.post('/add_custom_field', middleware.checkAuth, customFieldController.addCustomField);

    router.post("/get_all_custom_field", middleware.checkAuth, customFieldController.getAllCustomField);

    router.get("/get_custom_field_by_id", middleware.checkAuth, customFieldController.getByCustomFieldId);

    router.put("/update_custom_field_by_id", middleware.checkAuth, customFieldController.updateByCustomFieldId);

    router.put("/delete_custom_field_by_id", middleware.checkAuth, customFieldController.deleteByCustomFieldId);



    /**
     * @LEAD_API
     */

    router.post('/add_lead', middleware.checkAuth, leadController.addLead);

    router.post("/get_all_lead", middleware.checkAuth, leadController.getAllLead);

    router.get("/get_lead_by_id", middleware.checkAuth, leadController.getByLeadId);

    router.put("/update_lead_by_id", middleware.checkAuth, leadController.updateByLeadId);

    router.delete("/delete_lead_by_id", middleware.checkAuth, leadController.deleteByLeadId);

    router.get("/get_lead_count_by_status", middleware.checkAuth, leadController.getLeadCountByStatus);

    router.get("/get_lead_by_employee", middleware.checkAuth, leadController.getLeadBasedOnEmployee);



    /**
     * @LEAD_ASSIGN_API
     */

    router.post('/add_lead_assign', middleware.checkAuth, leadAssignController.addLeadAssign);

    router.post("/get_all_lead_assign", middleware.checkAuth, leadAssignController.getAllLeadAssign);

    router.get("/get_lead_assign_by_id", middleware.checkAuth, leadAssignController.getByLeadAssignId);

    router.put("/update_lead_assign_by_id", middleware.checkAuth, leadAssignController.updateByLeadAssignId);

    router.delete("/delete_lead_assign_by_id", middleware.checkAuth, leadAssignController.deleteByLeadAssignId);



}