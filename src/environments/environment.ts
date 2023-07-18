// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiURL: 'https://localhost:44353/',
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
    exportarViabilidad: 'ExportToExcel/GetViabilidadExcel/',
    exportarDap: 'ExportToExcel/GetSolicitudContratacionDap/',
    exportarSoicitudCdp: 'ExportToExcel/GetSolicitudCdp/',
    exportarCdp: 'ExportToExcel/ExportToExcelCdp/',
    exportarPpa: 'ExportToExcel/GetSolicitudPpa/',
    exportElements: 'ExportToExcel/ExportElement/',
    addExcelContractorEndpoint: 'ImportExcel/AddExcel',
    addExcelCdpEndpoint: 'ImportExcel/ImportExcelCdp',
    addExcelElementEndpoint: 'ImportExcel/ImportExcelElement',

    UpdateContractorEndpoint: 'Contractor/Update',
    SaveDataContractorEndpoint: 'Contractor/SaveDataContractor/',
    GetFolderContractorEndpoint: 'Contractor/GetAll/',
    // GetContractorByIdEndpoint: 'Contractor/ChargeAccountGetById',
    DeleteContractorByIdEndpoint: 'Contractor/Delete/',
    asignmentData: 'Contractor/UpdateAsignment',
    sendMails: 'MessageHandling/SendContractorAccount',
    AuthContractor: 'Contractor/Authenticate',
    GetContractsByContractors: 'Contractor/GetContractsByContractor/',
    GetMinutesPdf: 'Contractor/GetDocumentMinutesPdf/',
    HistoryContractor: 'Contractor/GetHistoryContractor',
    AddnewnessContractor: 'Contractor/AddNewNess',
    GetByContractorIdContractEndpoint: 'Contractor/GetAllByFolder/',


    GetByContractorIdFolderEndpoint: 'FileManager/GetFolderFilesById/',
    GetAllContractFolderEndpoint: 'FileManager/GetAllContract',


    addFolderFileContractorEndpoint: 'Folder/Add',
    UpdateFolderFileContractorEndpoint: 'Folder/Update',
    GetByIdFolderFileContractorEndpoint: 'Folder/GetById/',
    GetFolderFileContractorEndpoint: 'Folder/GetAll/',

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

    addContractorPaymentsEndpoint: 'ContractorPayments/Add',
    GetAllContractorPaymentsEndpoint: 'ContractorPayments/GetAll',
    GetByIdContractorPaymentsEndpoint: 'ContractorPayments/GetById/',
    DeleteContractorPaymentsEndpoint: 'ContractorPayments/Delete',

    addEconomicDataContractorEndpoint: 'EconomicDataContractor/AddEconomicData',
    UpdateEconomicDataContractorEndpoint: 'EconomicDataContractor/Update',
    GetAllEconomicDataContractorEndpoint: 'EconomicDataContractor/GetAll',
    GetByIdEconomicDataContractorEndpoint: 'EconomicDataContractor/GetById',
    DeleteEconomicDataContractorEndpoint: 'EconomicDataContractor/Delete',

    addFileEndpoint: 'Files/AddFileContractor',
    addFileContractEndpoint: 'Files/AddFileContract',
    addFileBillsEndpoint: 'Files/AddBillsContractor',
    addDetailFileEndpoint: 'Files/AddDetailFile',
    GetAllFileByFolderContractorEndpoint: 'Files/GetFileContractorByFolder',
    GetAllFileByFolderContractEndpoint: 'Files/GetFileContractByFolder',
    GetAllFileByContractEndpoint: 'Files/GetFileContractorByContract',
    GetFileContractByIdEndpoint: 'Files/GetAllFileContractById/',
    GetAllFileByDatePayment: 'Files/GetAllFileByDatePayments/',
    updateStatusFileEndpoint: 'Files/AddFileContractor',
    GetByIdFileEndpoint: 'Files/GetById/',
    DeleteFileEndpoint: 'Files/Delete/',


    addHiringEndpoint: 'HiringData/SaveHiring',
    UpdateHiringEndpoint: 'HiringData/Update',
    GetAllHiringEndpoint: 'HiringData/GetAll',
    GetByIdHiringEndpoint: 'HiringData/GetByIdHinringData',
    DeleteHiringEndpoint: 'HiringData/Delete',
    GetDataMinutaHiringEndpoint: 'HiringData/GetByIdMinuta',

    addComponent: 'Componente/Add/',
    addActivity: 'Componente/AddActivity/',
    getComponent: 'Componente/GetComponent/',

    getComponentById: 'Componente/GetByIdComponent',
    getElements: 'ElementosComponente/GetElementsByComponent/',
    getElementosById: 'ElementosComponente/GetByIdComponente',

    deleteComponent: 'Componente/Delete/',
    addElementosComponent: 'ElementosComponente/SaveElement',
    getElementoById: 'ElementosComponente/GetById/',
    getActivityByIdComponent: 'Componente/GetActivityByComponent/',
    getActivityById: 'Componente/GetActivityById/',

    GetPdfDataExecutionReport: 'PdfData/GetExecutionReport',
    GetPdChargeAccountGetById: 'PdfData/ChargeAccountGetById',
    GetPdMinteExtension: 'PdfData/ChargeAccountGetById',
    GetBillByContractIdEndpoint: 'PdfData/GetDataBill',
    GetPreviusStudyContractIdEndpoint: 'PdfData/GetPreviusStudies',
    GetCommitteeRequestdEndpoint: 'PdfData/GetCommitteeRequest',

    addFileFirmEndpoint: 'UserFirm/SaveUserDocument',
    GetRollsEndpoint: 'UserFirm/GetAllRolls',
    GetTypeUserFileEndpoint: 'UserFirm/GetAllTypeUserFile',


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


    getDepartmentsColombia: 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json',


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
