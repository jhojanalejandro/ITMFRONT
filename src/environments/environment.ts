// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiURL: 'https://localhost:44353/',
    // apiURL: 'https://localhost:7163/',
    authenticateEndpoint: 'User/Authenticate',
    sigUpEndpoint: 'User/Add',
    retrieveEndpoint: 'User/retrievePassword',
    updateUserEndpoint: 'User/Update',
    updatePasswordUserEndpoint: 'User/UpdatePassword',
    getAllUserEndpoint: 'User/GetAll',
    getAllUserEmployeesEndpoint: 'User/GetAllEmployees',
    deleteUserEndpoint: 'User/Delete/',
    getByIdUserEndpoint: 'User/GetById/',
    validateTokenEndpoint: 'User/ValidateTokens/',
    exportarViabilidad: 'ExportToExcel/GetViabilidadExcel/',
    exportarDap: 'ExportToExcel/GetSolicitudContratacionDap',
    exportarCdp: 'ExportToExcel/GetSolicitudCdp/',
    exportarPpa: 'ExportToExcel/GetSolicitudPpa/',

    addContractorEndpoint: 'Contractor/Add',
    addExcelContractorEndpoint: 'Contractor/AddExcel',
    UpdateContractorEndpoint: 'Contractor/Update',
    GetByIdFolderContractorEndpoint: 'Contractor/GetAllByFolder/',
    GetFolderContractorEndpoint: 'Contractor/GetAll/',
    DeleteContractorByIdEndpoint: 'Contractor/Delete/',
    asignmentData: 'Contractor/UpdateAsignment',

    addFolderFileContractorEndpoint: 'FolderContractor/Add',
    UpdateFolderFileContractorEndpoint: 'FolderContractor/Update',
    GetByIdFolderFileContractorEndpoint: 'FolderContractor/GetById/',
    GetFolderFileContractorEndpoint: 'FolderContractor/GetAll/',

    addProjectFolderEndpoint: 'ProjectFolder/Add',
    UpdateProjectFolderEndpoint: 'ProjectFolder/Update',
    GetAllProjectFolderEndpoint: 'ProjectFolder/GetAll',
    GetByIdProjectFolderEndpoint: 'ProjectFolder/GetById/',
    DeleteProjectFolderEndpoint: 'ProjectFolder/Delete',

    addContractorPaymentsEndpoint: 'ContractorPayments/Add',
    UpdateContractorPaymentsEndpoint: 'ContractorPayments/Update',
    GetAllContractorPaymentsEndpoint: 'ContractorPayments/GetAll',
    GetByIdContractorPaymentsEndpoint: 'ContractorPayments/GetById/',
    DeleteContractorPaymentsEndpoint: 'ContractorPayments/Delete',

    addEconomicDataContractorEndpoint: 'EconomicDataContractor/Add',
    UpdateEconomicDataContractorEndpoint: 'EconomicDataContractor/Update',
    GetAllEconomicDataContractorEndpoint: 'EconomicDataContractor/GetAll',
    GetByIdEconomicDataContractorEndpoint: 'EconomicDataContractor/GetById/',
    DeleteEconomicDataContractorEndpoint: 'EconomicDataContractor/Delete',

    addFileEndpoint: 'Files/AddFileContractor',
    UpdateFileEndpoint: 'Files/Update',
    GetAllFileByIdEndpoint: 'Files/GetAllFileById',
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

    addComponent: 'Componente/Add/',
    getComponent: 'Componente/Get/',
    getComponentById: 'Componente/GetById/',

    deleteComponent: 'Componente/Delete/',
    addElementosComponent: 'Api/ElementosComponente',
    geElementoById: 'Api/ElementosComponente/GetById/',



    addElementosComponentByContract: 'Api/ElementosComponente/GetByContractId/',

    getDepartmentsColombia:
        'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
