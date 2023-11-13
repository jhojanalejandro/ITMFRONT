export class Contracts {
    btnclickContract = () => cy.get('tr:contains("01225") .boton-de-clic').click();
    btnUploadclickContractors = () => cy.get('.btn-upload-contractors').click();
    btnregisterContract = () => cy.get('.btn-r-contract').click();

}   
