import { Contracts } from "../pages/contracts/test-contracts.cy";

describe('login spec', () => {
    const contract = new Contracts()
    const scenario = "test-create-posts";

    it('VENTANA CONTRATOS', () => {
        const testCase = "creacion-post";
        cy.login('jhojanhernandezy24@outlook.es', '123', 'Contractual');
        cy.wait(2000);
        contract.btnclickContract();
        cy.screenshot(scenario + '/' + '3-' + testCase + '-Step-ingreso-password', { overwrite: true });
    });

    it('REGITRAR CONTRATO', () => {
        cy.login('jhojanhernandezy24@outlook.es', '123', 'Contractual');
        cy.visit('http://localhost:4200/#/docs/ecommerce/contratos/register');
        contract.btnregisterContract();
        cy.get('[formControlName="companyName"]').type('LOGAN');
        cy.get('[formControlName="projectName"]').type('PROYECTO LOGAN');

        cy.get('[formControlName="project"]').type('012356');
        cy.get('[formControlName="rubro"]').click();
        cy.contains('21202020080002').click();
        cy.get('[formControlName="fuenteRubro"]').click();
        cy.contains('FUNCIONAMIENTO').click();

        cy.get('[formControlName="numberProject"]').type('012548536');
        cy.get('[formControlName="fechaContrato"]').click();
        cy.contains('10').click();
        cy.get('[formControlName="fechaFinalizacion"]').click();
        cy.contains('30').click();
        cy.get('[formControlName="objectContract"]').type('OBJETO CONTRATO');
        cy.get('[formControlName="dutyContract"]').type('DEBERES PARA EL CONTRATO');
        // cy.contains('Guardar').click();
        cy.contains('Cancelar').click();

    });


})
