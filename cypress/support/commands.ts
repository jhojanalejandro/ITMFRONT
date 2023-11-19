/// <reference types="cypress" />


// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
declare namespace Cypress {
    interface Chainable {
      login(username: string, password: string,userType: string): void;
      GetAllContracts(token: string): void;
      registerUser(): void;
    }
}

Cypress.Commands.add('login', (email, password,userType) => { 
    cy.visit('http://localhost:4200/#/sign-in');
    const userLogin: any = {
        userName: email,
        password: password,
        userType: userType
    };
    cy.request({
        method: 'POST',
        url: 'https://localhost:44353/User/Authenticate',
        body:userLogin
    }).then((resp: any) => {
        console.log('resp', resp.body.success);
        cy.log(resp); // Muestra la respuesta en la consola de Cypress
        expect(resp.body.success).to.equal(true);
        cy.window().then((win) => {
            win.localStorage.setItem('accessToken',resp.body.data.accessToken)
            console.log('respuesta login',resp.body)
            // Puedes realizar acciones adicionales con el token si es necesario
        });
    })
    cy.get('[formControlName="userType"]').click(); // Abre el mat-select
    cy.contains('Contractual').click();
    cy.get('[formControlName="email"]').type('jhojanhernandezy24@outlook.es'); // Abre el mat-select
    cy.get('[formControlName="password"]').type('123'); // Abre el mat-select
    cy.contains('Iniciar sesion').click();
    cy.visit('http://localhost:4200/#/sign-in?redirectURL=%2Fdashboards%2Finicio')
 });

Cypress.Commands.add('GetAllContracts', (token) => { 
    const headers = {
        Authorization: `Bearer ${token}` // Asume que el token es de tipo Bearer
    };
    console.log('token en servicio',token)
    const contractParams: any = {
        inProgress: true,
        tipoModulo: 'CONTARCTUAL',
    };
    const url = `https://localhost:44353/ContractFolder/GetAllContracts?inProgress=${contractParams.inProgress}&tipoModulo=${contractParams.tipoModulo}`;
    cy.debug
    cy.request({
        method: 'GET',
        url: url,
        headers: {
            Authorization: `Bearer ${token}` // Asume que el token es de tipo Bearer
        }
    }).then((resp) => {
        console.log(resp.body);
    });
});

Cypress.Commands.add('registerUser', () => { 
    cy.visit('http://localhost:4200/#/sign-up')

    cy.get('[formControlName="userName"]').type('jhojan alejandro hernandez yepes');
    cy.get('[formControlName="identification"]').type('1000189631');
    cy.get('[formControlName="phoneNumber"]').type('3003853164');
    cy.get('[formControlName="email"]').type('jhojanhernandezy24@outlook.es');

    cy.get('[formControlName="passwordMail"]').type('ALEJO_0406');
    cy.get('[formControlName="professional"]').type('ADMINISTRADOR PLATAFORMA');

    cy.get('[formControlName="password"]').type('123');
    cy.get('[formControlName="confirmPassword"]').type('123');
    cy.contains('Registrarse').click();
    cy.get('[data-cy=mi-boton]').click();
    cy.wait(2000);
    cy.contains('iniciar sesion').click();
 });
