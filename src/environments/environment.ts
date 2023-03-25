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
    updateUserEndpoint: 'User/Update',
    updatePasswordUserEndpoint: 'User/UpdatePassword',
    getAllUserEndpoint: 'User/GetAll',
    getAllAdminsEndpoint: 'User/GetAll',
    getAllUserEmployeesEndpoint: 'User/GetAllEmployees',
    deleteUserEndpoint: 'User/Delete/',
    getByIdUserEndpoint: 'User/GetById/',
    validateTokenEndpoint: 'User/ValidateTokens/',
    exportarViabilidad: 'ExportToExcel/GetViabilidadExcel/',
    exportarDap: 'ExportToExcel/GetSolicitudContratacionDap/',
    exportarCdp: 'ExportToExcel/GetSolicitudCdp/',
    exportarPpa: 'ExportToExcel/GetSolicitudPpa/',
    addExcelContractorEndpoint: 'Contractor/AddExcel',
    UpdateContractorEndpoint: 'Contractor/Update',
    GetByContractorIdFolderEndpoint: 'Contractor/GetAllByFolder/',
    GetFolderContractorEndpoint: 'Contractor/GetAll/',
    GetContractorByIdEndpoint: 'Contractor/GetById/',
    GetBillByContractIdEndpoint: 'Contractor/GetDataBill',
    DeleteContractorByIdEndpoint: 'Contractor/Delete/',
    asignmentData: 'Contractor/UpdateAsignment',
    sendMails: 'Contractor/SendContractorAccount',

    addFolderFileContractorEndpoint: 'FolderContractor/Add',
    UpdateFolderFileContractorEndpoint: 'FolderContractor/Update',
    GetByIdFolderFileContractorEndpoint: 'FolderContractor/GetById/',
    GetFolderFileContractorEndpoint: 'FolderContractor/GetAll/',

    addProjectFolderEndpoint: 'ProjectFolder/Add',
    UpdateProjectFolderEndpoint: 'ProjectFolder/UpdateCost',
    GetAllProjectFolderEndpoint: 'ProjectFolder/GetAll/',
    UpdateStateProjectFolderEndpoint: 'ProjectFolder/UpdateState/',

    GetByIdProjectFolderEndpoint: 'ProjectFolder/GetById/',
    DeleteProjectFolderEndpoint: 'ProjectFolder/Delete',
    GetByIdDetailEndpoint: 'ProjectFolder/GetByIdDetail',
    addContractorPaymentsEndpoint: 'ContractorPayments/Add',
    GetAllContractorPaymentsEndpoint: 'ContractorPayments/GetAll',
    GetByIdContractorPaymentsEndpoint: 'ContractorPayments/GetById/',
    DeleteContractorPaymentsEndpoint: 'ContractorPayments/Delete',

    addEconomicDataContractorEndpoint: 'EconomicDataContractor/Add',
    UpdateEconomicDataContractorEndpoint: 'EconomicDataContractor/Update',
    GetAllEconomicDataContractorEndpoint: 'EconomicDataContractor/GetAll',
    GetByIdEconomicDataContractorEndpoint: 'EconomicDataContractor/GetById',
    DeleteEconomicDataContractorEndpoint: 'EconomicDataContractor/Delete',

    addFileEndpoint: 'Files/AddFileContractor',
    addFileBillsEndpoint: 'Files/AddBillsContractor',
    addDetailFileEndpoint: 'Files/AddDetailFile',
    GetAllFileByFolderEndpoint: 'Files/GetFileContractorByFolder',
    GetAllFileByContractEndpoint: 'Files/GetFileContractorByContract',
    GetAllFileContractByIdEndpoint: 'Files/GetAllFileContractById/',
    GetAllFileByDatePayment: 'Files/GetAllFileByDatePayments/',

    GetByIdFileEndpoint: 'Files/GetById/',
    DeleteFileEndpoint: 'Files/Delete',
    AuthContractor: 'Contractor/Authenticate',

    addHiringEndpoint: 'HiringData/Add',
    UpdateHiringEndpoint: 'HiringData/Update',
    GetAllHiringEndpoint: 'HiringData/GetAll',
    GetByIdHiringEndpoint: 'HiringData/GetById/',
    DeleteHiringEndpoint: 'HiringData/Delete',
    GetDataMinutaHiringEndpoint: 'HiringData/GetByIdMinuta',

    addComponent: 'Componente/Add/',
    addActivity: 'Componente/AddActivity/',
    getActivity: 'Componente/GetActivity/',
    getComponent: 'Componente/GetComponent/',

    getComponentById: 'Componente/GetById/',

    addElement: 'ElementosComponente/Add/',
    getElements: 'ElementosComponente/Get/',
    getElementosById: 'ElementosComponente/GetByIdComponente',

    deleteComponent: 'Componente/Delete/',
    addElementosComponent: 'ElementosComponente/Add',
    geElementoById: 'ElementosComponente/GetById/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
