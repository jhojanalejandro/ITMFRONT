// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
    apiURL: 'http://172.30.0.9:8080/',
    // apiURL: 'https://localhost:7163/',
    authenticateEndpoint: 'User/Authenticate',
    sigUpEndpoint: 'User/SignUp',
    retrieveEndpoint: 'User/retrievePassword',
    updateUserEndpoint: 'User/UpdateTeamRoll',
    updatePasswordUserEndpoint: 'User/UpdatePassword',
    getAllUserEndpoint: 'User/GetTeam',
    getAllUserEmployeesEndpoint: 'User/GetAllEmployees',
    deleteUserEndpoint: 'User/Delete/',
    getByIdUserEndpoint: 'User/GetById/',
    validateTokenEndpoint: 'User/ValidateTokens/',
    GenrateReportContractEndpoint: 'ExportToExcel/GenrateReportContract',
    exportarDap: 'ExportToExcel/GetSolicitudContratacionDap/',
    exportarSoicitudCdp: 'ExportToExcel/GetSolicitudCdp/',
    exportarCdp: 'ExportToExcel/ExportToExcelCdp/',
    exportarPpa: 'ExportToExcel/GetSolicitudPpa/',
    exportElements: 'ExportToExcel/ExportElement/',
    addExcelContractorEndpoint: 'ImportExcel/AddExcel',
    addExcelCdpEndpoint: 'ImportExcel/ImportExcelCdp',
    addExcelElementEndpoint: 'ImportExcel/ImportExcelElement',
    GenerateSatisfactionReportEndpoint: 'ExportToExcel/GenerateSatisfactionReport',

    UpdateContractorEndpoint: 'Contractor/Update',
    SaveDataContractorEndpoint: 'Contractor/SaveDataContractor/',
    GetFolderContractorEndpoint: 'Contractor/GetAll/',
    GetContractorByIdEndpoint: 'Contractor/GetById',
    DeleteContractorByIdEndpoint: 'Contractor/Delete/',
    asignmentData: 'Contractor/UpdateAsignment',
    sendMails: 'MessageHandling/SendContractorAccount',
    AuthContractor: 'Contractor/Authenticate',
    GetContractsByContractors: 'Contractor/GetContractsByContractor/',
    GetMinutesPdf: 'Contractor/GetDocumentMinutesPdf/',
    HistoryContractor: 'Contractor/GetHistoryContractor',
    AddnewnessContractor: 'Contractor/AddNewNess',
    GetByContractorIdContractEndpoint: 'Contractor/GetContractorByContract',
    ValidateDocumentUploadEndpoint: 'Contractor/ValidateDocumentUpload',
    SaveModifyMinuteEndpoint: 'Contractor/SaveModifyMinute',


    GetByContractorIdFolderEndpoint: 'FileManager/GetFolderFilesById/',
    GetAllContractFolderEndpoint: 'FileManager/GetAllContract',


    addFolderFileContractorEndpoint: 'Folder/SaveFolderContract',
    UpdateFolderFileContractorEndpoint: 'Folder/Update',
    GetByIdFolderFileContractorEndpoint: 'Folder/GetById/',
    GetFolderFileContractorEndpoint: 'Folder/GetAllFolderById/',

    addContractFolderEndpoint: 'ContractFolder/SaveContract',
    UpdateContractFolderEndpoint: 'ContractFolder/UpdateCost',
    GetAllContractEndpoint: 'ContractFolder/GetAllContracts',
    GetAllHistoryProjectEndpoint: 'ContractFolder/GetAllHistory',
    UpdateStateContractFolderEndpoint: 'ContractFolder/UpdateStateContract/',
    GetByIdContractFolderEndpoint: 'ContractFolder/GetById/',
    DeleteContractFolderEndpoint: 'ContractFolder/Delete',
    GetByIdDetailListEndpoint: 'ContractFolder/GetByIdDetailList',
    GetByIdDetailByIdEndpoint: 'ContractFolder/GetDetailByIdContract',
    AssignmentUserContractEndpoint: 'ContractFolder/AssignmentUserContract',
    SaveTermFileContractEndpoint: 'ContractFolder/SaveTermFileContract',

    addContractorPaymentsEndpoint: 'ContractorPayments/SaveContractorPayment',
    GetAllContractorPaymentsEndpoint: 'ContractorPayments/GetAll',
    GetByIdContractorPaymentsEndpoint: 'ContractorPayments/GetById/',
    DeleteContractorPaymentsEndpoint: 'ContractorPayments/DeleteContractorPayment',
    GetPaymentsContractorListEndpoint: 'ContractorPayments/GetPaymentsContractorList',
    GetEmptityHealthContractorEndpoint: 'ContractorPayments/GetEmptityHealthContractor',
    GetPdChargeAccountGetById: 'ContractorPayments/ChargeAccountGetById',
    addContractorPaymentSecurityEndpoint: 'ContractorPayments/SaveContractorPaymentSecurity',

    addEconomicDataContractorEndpoint: 'EconomicDataContractor/AddEconomicData',
    UpdateEconomicDataContractorEndpoint: 'EconomicDataContractor/AddEconomicData',
    GetAllEconomicDataContractorEndpoint: 'EconomicDataContractor/GetAll',
    GetByIdEconomicDataContractorEndpoint: 'EconomicDataContractor/GetEconiomicDataById',
    DeleteEconomicDataContractorEndpoint: 'EconomicDataContractor/Delete',
    GetPaymentByIdContractAndContractorEndpoint: 'EconomicDataContractor/GetPaymentByIdContractAndContractor',

    addFileEndpoint: 'Files/AddFileContractor',
    addFileContractEndpoint: 'Files/AddFileContract',
    addFileBillsEndpoint: 'Files/AddBillsContractor',
    addDetailFileEndpoint: 'Files/AddDetailFile',
    CreateDetailObservationEndpoint: 'Files/CreateDetailObservation',
    SaveCommitteeContractorEndpoint: 'Files/SaveCommitteeContractor',
    saveDetailFileCommitteeEndpoint: 'Files/CreateDetailCommittee',

    GetAllFileByFolderContractorEndpoint: 'Files/GetFileContractorByFolder',
    GetAllFileByFolderContractEndpoint: 'Files/GetFileContractByFolder',
    GetAllFileByContractEndpoint: 'Files/GetFileContractorByContract',
    GetFileContractByIdEndpoint: 'Files/GetAllFileContractById/',
    GetAllFileByDatePayment: 'Files/GetAllFileByDatePayments/',
    updateStatusFileEndpoint: 'Files/AddFileContractor',
    GetByIdFileEndpoint: 'Files/GetFileById/',
    DeleteFileEndpoint: 'Files/DeleteFile/',
    GetFileDonwloadContractualEndpoint: 'Files/GetFileDonwloadContractual',

    addHiringEndpoint: 'HiringData/SaveHiring',
    UpdateHiringEndpoint: 'HiringData/Update',
    GetAllHiringEndpoint: 'HiringData/GetAll',
    GetByIdHiringEndpoint: 'HiringData/GetByIdHinringData',
    DeleteHiringEndpoint: 'HiringData/Delete',
    GetDataMinutaHiringEndpoint: 'HiringData/GetByIdMinuta',
    GetByIdDateHiringEndpoint: 'HiringData/GetDateContractById',

    addComponent: 'Componente/SaveComponentContract',
    addActivity: 'Componente/AddActivity/',
    getComponent: 'Componente/GetComponentsByContract/',

    getComponentById: 'Componente/GetByIdComponent',
    getElements: 'ElementosComponente/GetElementsByComponent/',
    getElementosById: 'ElementosComponente/GetByIdComponente',

    deleteComponent: 'Componente/DeleteComponentContract/',
    addElementosComponent: 'ElementosComponente/SaveElement',
    getElementoById: 'ElementosComponente/GetElementById/',
    getActivityByIdComponent: 'Componente/GetActivityByComponent/',
    getActivityById: 'Componente/GetActivityById/',

    GetPdfDataExecutionReport: 'PdfData/GetExecutionReport',
    GetPdMinteExtension: 'PdfData/GetDataminuteExtension',
    GetBillByContractIdEndpoint: 'PdfData/GetDataBill',
    GetPreviusStudyContractIdEndpoint: 'PdfData/GetPreviusStudies',
    GetCommitteeRequestdEndpoint: 'PdfData/GetCommitteeRequest',

    addFileFirmEndpoint: 'UserFirm/SaveUserDocument',
    GetRollsEndpoint: 'UserFirm/GetAllRolls',
    GetTypeUserFileEndpoint: 'UserFirm/GetAllTypeUserFile',
    AddFileAttachFirmEndpoint: 'UserFirm/SaveAttachFile',



    GetCpcTypeEndpoint: 'MasterData/GetAllCpcType',
    GetFileTypeEndpoint: 'MasterData/GetFileType',
    GetStatusContractEndpoint: 'MasterData/GetStatusContract',
    GetElementTypeEndpoint: 'MasterData/GetAllElementType',
    GetDocumentTypeEndpoint: 'MasterData/GetDocumentType',
    GetStatusFileEndpoint: 'MasterData/GetStatusFile',
    GetMinuteTypeContractEndpoint: 'MasterData/GetMinutes',
    GetBanksContractEndpoint: 'MasterData/GetBanks',
    GetGetAllRubrosContractEndpoint: 'MasterData/GetAllRubros',
    GetAllAssignmentTypeEndpoint: 'MasterData/GetAllAssignmentType',
    GetAllTermTypeEndpoint: 'MasterData/GetAllTermType',
    GetDetailTypeEndpoint: 'MasterData/GetAllDetailType',
    getnewnessType: 'MasterData/GetNewnessType',
    GetEmptityHealthEndpoint: 'MasterData/GetEmptityHealth',


    getDepartmentsColombia: 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json'


};

