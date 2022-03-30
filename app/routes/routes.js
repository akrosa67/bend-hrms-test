/**
 * @param {*} router 
 * @Desc  Router for getting 'General' resources
 */

module.exports = function(router) {
    const companyController = require('../controllers/company-controller');
    const locationController = require('../controllers/location-controller');
    const branchController = require('../controllers/branch-controller');
    const factorController = require('../controllers/factor-controller');
    const documentController = require('../controllers/document-controller');
    const questionController = require('../controllers/question-controller');
    const departmentController = require('../controllers/department-controller');
    const designationController = require('../controllers/designation-controller');
    const roleController = require('../controllers/role-controller');
    const commonController = require('../controllers/common-controller');
    const accessController = require('../controllers/menu/access-controller');
    const menuController = require('../controllers/menu/menu-controller');
    const employeeController = require('../controllers/employee/employee-controller');
    const kycController = require('../controllers/employee/kyc-controller');
    const BankController = require('../controllers/employee/bank-controller');
    const workExpController = require('../controllers/employee/workexp-controller');
    const RecDocController = require('../controllers/employee/received-doc-controller');
    const FamDetController = require('../controllers/employee/family-details-controller');
    const referenceController = require('../controllers/employee/reference-controller');
    const employeeBgvController = require('../controllers/employee/employeebgv-controller');
    const employeeHikeController = require('../controllers/employee/hike-controller');
    const employeeFrwdController = require('../controllers/employee/forward-controller');
    const middleware = require('../libs/util/token-validator-middleware');
    const commonFunctions = require('../libs/util/commonFunctions');
    const jobRequestController = require('../controllers/jobrequest-controller');
    const jobOpeningController = require('../controllers/jobopening-controller');
    const questionnaireController = require('../controllers/questionnaire-controller');


    /**
     * @COMPANY_API
     */

    router.post("/add_company", middleware.checkAuth, companyController.addCompany);

    router.post("/get_all_company", middleware.checkAuth, companyController.getAllCompanies);

    router.get("/get_company_by_id", middleware.checkAuth, companyController.getByCompanyId);

    router.put("/update_company_by_id", middleware.checkAuth, companyController.updateByCompanyId);

    router.put("/delete_company_by_id", middleware.checkAuth, companyController.deleteByCompanyId);


    /**
     * @LOCATION_MASTER_API
     */

    router.get("/get_all_country", locationController.getAllCountries);

    router.get("/get_all_state", locationController.getAllStates);

    router.get("/get_all_city", locationController.getAllCities);


    /**
     * @BRANCH_API
     */

    router.post("/add_branch", middleware.checkAuth, branchController.addBranch);

    router.post("/get_all_branch", middleware.checkAuth, branchController.getAllBranches);

    router.get("/get_branch_by_id", middleware.checkAuth, branchController.getByBranchId);

    router.put("/update_branch_by_id", middleware.checkAuth, branchController.updateByBranchId);

    router.put("/delete_branch_by_id", middleware.checkAuth, branchController.deleteByBranchId);



    /**
     * @DEPARTMENT_API
     */

    router.post("/add_department", middleware.checkAuth, departmentController.addDepartment);

    router.post("/get_all_department", middleware.checkAuth, departmentController.getAllDepartments);

    router.get("/get_department_by_id", middleware.checkAuth, departmentController.getByDepartmentId);

    router.put("/update_department_by_id", middleware.checkAuth, departmentController.updateByDepartmentId);

    router.put("/delete_department_by_id", middleware.checkAuth, departmentController.deleteByDepartmentId);


    /**
     * @DESIGNATION_API
     */

    router.post("/add_designation", middleware.checkAuth, designationController.addDesignation);

    router.post("/get_all_designation", middleware.checkAuth, designationController.getAllDesignations);

    router.get("/get_designation_by_id", middleware.checkAuth, designationController.getByDesignationId);

    router.put("/update_designation_by_id", middleware.checkAuth, designationController.updateByDesignationId);

    router.put("/delete_designation_by_id", middleware.checkAuth, designationController.deleteByDesignationId);


    /**
     * @ROLE_API
     */

    router.post("/add_role", middleware.checkAuth, roleController.addRole);

    router.post("/get_all_role", middleware.checkAuth, roleController.getAllRoles);

    router.get("/get_role_by_id", middleware.checkAuth, roleController.getByRoleId);

    router.put("/update_role_by_id", middleware.checkAuth, roleController.updateByRoleId);

    router.put("/delete_role_by_id", middleware.checkAuth, roleController.deleteByRoleId);



    /**
     * @ACCESS_API
     */

    router.post("/add_access", middleware.checkAuth, accessController.addAccess);

    router.post("/get_all_access", middleware.checkAuth, accessController.getAllAccess);

    router.get("/get_access_by_id", middleware.checkAuth, accessController.getByAccessId);

    router.put("/update_access_by_id", middleware.checkAuth, accessController.updateByAccessId);

    router.put("/delete_access_by_id", middleware.checkAuth, accessController.deleteByAccessId);


    /**
     * @MENU_API
     */

    router.post("/add_menu", middleware.checkAuth, menuController.addMenu);

    router.post("/get_all_menu", middleware.checkAuth, menuController.getAllMenu);

    router.get("/get_menu_by_id", middleware.checkAuth, menuController.getByMenuId);

    router.put("/update_menu_by_id", middleware.checkAuth, menuController.updateByMenuId);

    router.put("/delete_menu_by_id", middleware.checkAuth, menuController.deleteByMenuId);



    /**
     * @EMPLOYEE_API
     */

    router.post("/add_employee", middleware.checkAuth, employeeController.addEmployee);

    router.post("/get_all_employee", middleware.checkAuth, employeeController.getAllEmployee);

    router.post("/get_all_employee_list", middleware.checkAuth, employeeController.getAllEmployeeList);

    router.get("/get_employee_by_id", middleware.checkAuth, employeeController.getByEmployeeId);

    router.put("/update_employee_by_id", middleware.checkAuth, employeeController.updateByEmployeeId);

    router.delete("/delete_employee_by_id", middleware.checkAuth, employeeController.deleteByEmployeeId);

    router.post("/login", employeeController.login);

    router.get("/get_session_user_info", middleware.checkAuth, employeeController.getSessionUserInfo);

    router.get("/logout", middleware.checkAuth, employeeController.logout);

    /**
     * @FACTOR_API
     */

    router.post("/add_factor", middleware.checkAuth, factorController.addFactor);

    router.get("/get_all_factor", middleware.checkAuth, factorController.getAllFactors);

    router.get("/get_active_factor", middleware.checkAuth, factorController.getActiveFactors);

    router.get("/get_factor_by_id", middleware.checkAuth, factorController.getByFactorId);

    router.put("/update_factor_by_id", middleware.checkAuth, factorController.updateByFactorId);

    router.put("/delete_factor_by_id", middleware.checkAuth, factorController.deleteByFactorId);

    /**
     * @QUESTION_API
     */

    router.post("/add_question", middleware.checkAuth, questionController.addQuestion);

    router.get("/get_all_question", middleware.checkAuth, questionController.getAllQuestions);

    router.get("/get_active_question", middleware.checkAuth, questionController.getActiveQuestions);

    router.get("/get_question_by_id", middleware.checkAuth, questionController.getByQuestionId);

    router.put("/update_question_by_id", middleware.checkAuth, questionController.updateByQuestionId);

    router.put("/delete_question_by_id", middleware.checkAuth, questionController.deleteByQuestionId);

    /**
     * @DOCUMENT_API
     */

    router.post("/add_document", middleware.checkAuth, documentController.addDocument);

    router.get("/get_all_document", middleware.checkAuth, documentController.getAllDocuments);

    router.get("/get_active_document", middleware.checkAuth, documentController.getActiveDocuments);

    router.get("/get_document_by_id", middleware.checkAuth, documentController.getByDocumentId);

    router.put("/update_document_by_id", middleware.checkAuth, documentController.updateByDocumentId);

    router.put("/delete_document_by_id", documentController.deleteByDocumentId);

    /**
     * @COMMON_API
     */

    router.post("/image_upload", commonFunctions.upload.single('file'), commonController.imageUpload);

    router.post("/sendOtp", middleware.checkAuth, commonController.sendOtp);

    router.put("/ResendOtp", middleware.checkAuth, commonController.ResendOtp);

    router.put("/verify_otp", middleware.checkAuth, commonController.verifyOtp);

    /**
     * @KYC_API
     */

    router.post("/add_kyc", middleware.checkAuth, kycController.addEmployeeKyc);

    router.post("/kyc", middleware.checkAuth, kycController.getAllKyc);

    router.post("/get_kyc_by_id", middleware.checkAuth, kycController.getByKycId);

    router.put("/update_kyc_by_id", middleware.checkAuth, kycController.updateByKycId);

    /**
     * @RecDoc_API
     */

    router.post("/add_received_doc", middleware.checkAuth, RecDocController.addEmployeeReciDoc);

    router.post("/received_doc", middleware.checkAuth, RecDocController.getAllRecDoc);

    router.post("/get_received_doc_by_id", middleware.checkAuth, RecDocController.getByRecDocId);

    router.put("/update_received_doc_by_id", middleware.checkAuth, RecDocController.updateByRecDocId);

    /**
     * @EMPBANK_API
     */

    router.post("/add_bank", middleware.checkAuth, BankController.addEmployeeBank);

    router.post("/bank", middleware.checkAuth, BankController.getAllBank);

    router.post("/get_bank_by_id", middleware.checkAuth, BankController.getByBankId);

    router.put("/update_bank_by_id", middleware.checkAuth, BankController.updateByBankId);

    router.put("/update_bank", middleware.checkAuth, BankController.updateBank);

    /**
     * @EMPWORKEXP_API
     */

    router.post("/add_workexp", middleware.checkAuth, workExpController.addEmployeeWorkExp);

    router.post("/workexp", middleware.checkAuth, workExpController.getAllWorkExp);

    router.post("/get_workexp_by_id", middleware.checkAuth, workExpController.getByWorkExpId);

    router.put("/update_workexp_by_id", middleware.checkAuth, workExpController.updateByWorkExpId);

    router.put("/delete_workexp_by_id", middleware.checkAuth, workExpController.deleteByWorkExpId);

    /**
     * @EMPFAMILY_API
     */

    router.post("/add_family_details", middleware.checkAuth, FamDetController.addEmployeeFamDetails);

    router.post("/family_details", middleware.checkAuth, FamDetController.getAllFamDetails);

    router.post("/verified_family_details", middleware.checkAuth, FamDetController.getAllverFamDetails);

    router.post("/get_family_details_by_id", middleware.checkAuth, FamDetController.getByFamDetailsId);

    router.put("/update_family_details_by_id", middleware.checkAuth, FamDetController.updateByFamDetailsId);

    router.put("/update_family_details", middleware.checkAuth, FamDetController.updateFamDetails);

    /**
     * @EMPREF_API
     */

    router.post("/add_reference_details", middleware.checkAuth, referenceController.addEmployeeRefDetails);

    router.post("/reference_details", middleware.checkAuth, referenceController.getAllRefDetails);

    router.post("/verified_reference_details", middleware.checkAuth, referenceController.getAllverRefDetails);

    router.post("/get_reference_details_by_id", middleware.checkAuth, referenceController.getByRefDetailsId);

    router.put("/update_reference_details_by_id", middleware.checkAuth, referenceController.updateByRefDetailsId);

    router.put("/update_reference_details", middleware.checkAuth, referenceController.updateRefDetails);

    /**
     * @EMPLOYEEBGV_API
     */

    router.post("/add_employeebgv", middleware.checkAuth, employeeBgvController.addEmployeeBgv);

    router.post("/get_all_employeebgv", middleware.checkAuth, employeeBgvController.getAllEmployeeBgv);

    router.get("/get_completed_employeebgv", middleware.checkAuth, employeeBgvController.getActiveEmployeeBgv);

    router.get("/get_employeebgv_by_id", middleware.checkAuth, employeeBgvController.getByEmployeeBgvId);

    router.put("/update_employeebgv_by_id", middleware.checkAuth, employeeBgvController.updateByEmployeeBgvId);

    router.put("/update_employeebgv_details_by_id", middleware.checkAuth, employeeBgvController.updateByEmployeeBgvDetailsId);

    router.put("/delete_employeebgv_by_id", middleware.checkAuth, employeeBgvController.deleteByEmployeeBgvId);

    /**
     * @EMPLOYEEHIKE_API
     */

    router.post("/add_employeehike", middleware.checkAuth, employeeHikeController.addEmployeeHike);

    router.post("/hike", middleware.checkAuth, employeeHikeController.getAllHike);

    router.post("/hike_processed", middleware.checkAuth, employeeHikeController.getAllHikeProcessed);

    router.post("/hike_commitment", middleware.checkAuth, employeeHikeController.getAllHikeCommitment);

    router.post("/get_hike_by_id", middleware.checkAuth, employeeHikeController.getByHikeId);

    router.post("/update_hike_by_id", middleware.checkAuth, employeeHikeController.updateByHikeId);

    /**
     * @EMPLOYEEFRWD_API
     */

    router.post("/add_employeefrwd", middleware.checkAuth, employeeFrwdController.addEmployeeForward);

    router.post("/forward", middleware.checkAuth, employeeFrwdController.getAllForward);

    router.post("/get_forward_by_id", middleware.checkAuth, employeeFrwdController.getByForwardId);

    router.put("/update_forward_by_id", middleware.checkAuth, employeeFrwdController.updateByForwardId);

    /**
     * @JOBREQUEST_API
     */

    router.post("/add_jobrequest", middleware.checkAuth, jobRequestController.addJobRequest);

    router.get("/jobrequest", middleware.checkAuth, jobRequestController.getAllJobRequests);

    router.post("/jobrequest_by_id", middleware.checkAuth, jobRequestController.getByJobRequestId);

    router.post("/update_jobrequest", middleware.checkAuth, jobRequestController.updateByJobRequestId);

    router.post("/update_jobrequest_status", middleware.checkAuth, jobRequestController.deleteByJobRequestId);

    router.put("/add_jobrequest_approval", middleware.checkAuth, jobRequestController.addJobRequestApproval);

    router.put("/update_jobrequest_approval", middleware.checkAuth, jobRequestController.updateByApprovalsId);

    router.post("/get_jobrequest_by_forwardto", middleware.checkAuth, jobRequestController.getAllJobRequestsByForwardTo);

    router.post("/jobrequestsummary", middleware.checkAuth, jobRequestController.getAllJobRequestsSummary);

    /**
     * @JOBOPENING_API
     */

    router.post("/add_jobopening", middleware.checkAuth, jobOpeningController.addJobOpening);

    router.get("/jobopening", middleware.checkAuth, jobOpeningController.getAllJobOpenings);

    router.post("/jobopening_by_id", middleware.checkAuth, jobOpeningController.getByJobOpeningId);

    router.put("/update_jobopening", middleware.checkAuth, jobOpeningController.updateByJobOpeningId);

    router.post("/update_jobopening_status", middleware.checkAuth, jobOpeningController.deleteByJobOpeningId);

    router.put("/add_jobopening_approval", middleware.checkAuth, jobOpeningController.addJobOpeningApproval);

    router.put("/update_jobopening_approval", middleware.checkAuth, jobOpeningController.updateByApprovalsId);

    router.post("/get_jobopening_by_forwardto", middleware.checkAuth, jobOpeningController.getAllJobOpeningsByForwardTo);

    router.post("/jobopeningsummary", middleware.checkAuth, jobOpeningController.getAllJobOpeningsSummary);

    /**
     * @QUESTIONNARIE_API
     */

    router.post("/add_questionnaire", middleware.checkAuth, questionnaireController.addQuestionnaire);

    router.get("/get_all_questionnaire", middleware.checkAuth, questionnaireController.getAllQuestionnaires);

    router.get("/get_active_questionnaire", middleware.checkAuth, questionnaireController.getActiveQuestionnaires);

    router.get("/get_questionnaire_by_id", middleware.checkAuth, questionnaireController.getByQuestionnaireId);

    router.put("/update_questionnaire_by_id", middleware.checkAuth, questionnaireController.updateByQuestionnaireId);

    router.put("/delete_questionnaire_by_id", middleware.checkAuth, questionnaireController.deleteByQuestionnaireId);

}