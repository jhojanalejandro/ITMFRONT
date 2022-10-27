export const environment = {
    production: true,
     //apiURL: 'https://localhost:44353/',
     apiURL: 'https://localhost:7163/',
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
 
     addContractorEndpoint: 'Contractor/Add',
     UpdateContractorEndpoint: 'Contractor/Update',
     GetByIdFolderContractorEndpoint: 'Contractor/GetAllByFolder/',
     GetFolderContractorEndpoint: 'Contractor/GetAll/',
 
     addFolderFileContractorEndpoint: 'FolderContractor/Add',
     UpdateFolderFileContractorEndpoint: 'FolderContractor/Update',
     GetByIdFolderFileContractorEndpoint: 'FolderContractor/GetById/',
     GetFolderFileContractorEndpoint: 'FolderContractor/GetAll/',
 
     addProjectFolderEndpoint: 'ProjectFolder/Add',
     UpdateProjectFolderEndpoint: 'ProjectFolder/Update',
     GetAllProjectFolderEndpoint: 'ProjectFolder/GetAll',
     GetByIdProjectFolderEndpoint: 'ProjectFolder/GetById/',
     DeleteProjectFolderEndpoint: 'ProjectFolder/Delete',
 
 
 
     addFileEndpoint: 'Files/Add',
     UpdateFileEndpoint: 'Files/Update',
     GetAllFileByIdEndpoint: 'Files/GetAllFileById/',
     GetByIdFileEndpoint: 'Files/GetById/',
     DeleteFileEndpoint: 'Files/Delete',
     AuthContractor: 'Files/Autenticate',
 
 
     addHiringEndpoint: 'HiringData/Add',
     UpdateHiringEndpoint: 'HiringData/Update',
     GetAllHiringEndpoint: 'HiringData/GetAll',
     GetByIdHiringEndpoint: 'HiringData/GetById/',
     DeleteHiringEndpoint: 'HiringData/Delete',
 
 
 
     getDepartmentsColombia: 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json'
};
