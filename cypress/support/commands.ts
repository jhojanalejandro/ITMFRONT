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
import * as XLSX from 'xlsx';
import flatted from 'flatted';

declare global {
    namespace Cypress {

        interface Chainable {
            login(username: string, password: string, userType: string): void;
            GetAllContracts(token: string): void;
            registerUser(): void;
            readExcel(filePath, sheetName);
            procesarExcel(filePath: string, sheetName: string, xlsx: typeof XLSX): Chainable<string[]>;
            
            procesarFilasDriver(filePath: string, sheetName: string): Chainable<void>;
            procesarFilas(filePath: string, sheetName: string): Chainable<void>;
            loginTest(): void;
            login2(): void;

        }
    }

}

Cypress.Commands.add('login', (email, password, userType) => {
    cy.visit('http://localhost:4200/#/sign-in');
    const userLogin: any = {
        userName: email,
        password: password,
        userType: userType
    };
    cy.request({
        method: 'POST',
        url: 'https://localhost:44353/User/Authenticate',
        body: userLogin
    }).then((resp: any) => {
        console.log('resp', resp.body.success);
        cy.log(resp); // Muestra la respuesta en la consola de Cypress
        expect(resp.body.success).to.equal(true);
        cy.window().then((win) => {
            win.localStorage.setItem('accessToken', resp.body.data.accessToken)
            console.log('respuesta login', resp.body)
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
    console.log('token en servicio', token)
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

// Cypress.Commands.add('readExcel', (filePath, sheetName) => {
//     cy.readFile(filePath, 'binary').then((data) => {
//         const workbook = XLSX.read(data, { type: 'binary' });
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//         cy.wrap(jsonData).as('excelData');
//         console.log(jsonData);

//     });
// });

Cypress.Commands.add('readExcel', (filePath, sheetName) => {
    cy.readFile(filePath, 'binary').then((data) => {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[sheetName];
        
        // Modificación para incluir celdas vacías
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
        
        cy.wrap(jsonData).as('excelData');
        console.log(jsonData);
    });
});

Cypress.Commands.add('procesarFilas', { prevSubject: false }, (filePath: string, sheetName: string): any => {
    let text = 'APOLLO ENDOSURGERY COSTA RICA SRL'
    const modifiedText = text.toLowerCase().replace(/(?:^|\s)\S/g, (a: any) => a.toUpperCase());
    console.log(modifiedText)
    // return cy.readExcel(filePath, sheetName).then((excelData) => {
    //     cy.visit('https://optoride.azurewebsites.net/#/management/passenger-list')
    //     cy.wait(2000)
    //     cy.contains('Nuevo').click();
    //     cy.wait(1000)
    //     cy.get('.lista-elementos').as('miLista');

    //     excelData.forEach((rowData, rowIndex) => {
    //         cy.log(`Procesando fila ${rowIndex + 1}: ${JSON.stringify(rowData)}`);

    //         if (rowIndex > 0) {
    //             cy.get('[formControlName="idCompany"]').click();
    //             cy.contains(rowData[2]).click();
    //             if(rowData[2] == null || rowData[2] == ''){
                    
    //             }else{
    //                 cy.get('[formControlName="name"]').type(rowData[10]);
    //                 cy.get('[formControlName="identificationNumber"]').type(rowData[13]);
    //                 cy.get('[formControlName="lastNameOne"]').type(rowData[11]);
    //                 cy.get('[formControlName="lastNameTwo"]').type(rowData[12]);
    //                 cy.get('[formControlName="emailPassenger"]').type(rowData[15]);
    //                 cy.get('[formControlName="phoneNumber"]').type(rowData[14]);
    //                 cy.get('[formControlName="paymentType"]').click();
    //                 cy.contains(rowData[0] == 'PREPAGO' ? 'Prepago' : 'Pospago').click();   
    //                 if(rowData[0] == 'PREPAGO'){
    //                     cy.get('[formControlName="subcontractingCompany"]').type(rowData[6]);
    //                 }else if(rowData[0] == 'POSTPAGO'){
    //                     cy.get('[formControlName="contractType"]').click();
    //                     cy.contains(rowData[1] == 'DIRECTO' ? 'Directo' : 'Indirecto').click();
    //                     cy.get('[formControlName="form"]').click();
    //                     switch(rowData[4]){
    //                         case 'CONTRATISTA':
    //                             cy.contains('Contratista').click();
    //                         break
    //                         case 'SEMANAL':
    //                             cy.contains('Semanal').click();
    //                         break
    //                         case 'QUINCENAL':
    //                             cy.contains('Quincenal').click();
    //                         break
    //                         case 'MENSUAL':
    //                             cy.contains('Mensual').click();
    //                         break
    //                     }
    //                     cy.get('[formControlName="travelLimitWeek"]').click();
    //                     cy.contains(rowData[3]).click();
    //                     cy.get('[formControlName="subsidyType"]').click();
    //                     cy.contains('Por Monto').click();
    //                     // if('Por Monto'){
    //                     //     cy.get('[formControlName="percentageSubsidy"]').click();
    //                     //     cy.contains(rowData[5]).click();
    //                     // }else{
    //                     //     cy.get('[formControlName="subsidyByAmount"]').type('120');
    //                     // }
    //                     cy.get('[formControlName="subsidyByAmount"]').type('120');
    //                 }
    //                 cy.get('[formControlName="internalEmployeeNumber"]').type('124');
    //                 cy.get('[formControlName="internalBadge"]').type(rowData[8]);
    //                 cy.wait(3000)
    //                 //cy.contains('Guardar').click(); 
    //                 cy.wait(5000)
    //                 cy.contains('La información se guardó correctamente')
    //                 cy.wait(4000)
    //             }
         

    //         }
    //     });
    // });
});


Cypress.Commands.add('loginTest', () => {
    cy.visit('https://optoride.azurewebsites.net/#/authentication/login');
    cy.get('[formControlName="account"]').type('adminzf@yopmail.com');
    cy.get('[formControlName="password"]').type('12345678'); 
    cy.contains('Ingresar').click();
    cy.wait(3000);
    cy.visit('https://optoride.azurewebsites.net/#/management/passenger-list')
});

Cypress.Commands.add('login', (email, password, userType) => {
    cy.visit('http://localhost:4200/#/sign-in');
    const userLogin: any = {
        userName: email,
        password: password,
        userType: userType
    };
    cy.request({
        method: 'POST',
        url: 'https://localhost:44353/User/Authenticate',
        body: userLogin
    }).then((resp: any) => {
        console.log('resp', resp.body.success);
        cy.log(resp); // Muestra la respuesta en la consola de Cypress
        expect(resp.body.success).to.equal(true);
        cy.window().then((win) => {

            // win.localStorage.setItem('accessToken', resp.body.data.accessToken)
            // console.log('respuesta login', resp.body)
            // Puedes realizar acciones adicionales con el token si es necesario
        });
    })
});


Cypress.Commands.add('login2', () => {
    cy.visit('http://localhost:4200/#/sign-in?redirectURL=%2Fdashboards%2Finicio');
    cy.get('[formControlName="userType"]').click()
    .then((atributo: any) => {
      // Puedes hacer algo con el valor del atributo aquí
      console.log('El valor del atributo es: '+atributo[0]);
      const informacionRelevante = {
        tagName: atributo.tagName,
        value: atributo.value,
        // Agrega otras propiedades según sea necesario
      };
  
      // Serializar la información relevante
      const objetoSerializado = flatted.stringify(atributo);
      console.log('El valor : '+informacionRelevante);

      console.log('Información serializada:', objetoSerializado);

    });
    cy.contains('Contractual').click();; // Abre el mat-select
    cy.get('[formControlName="email"]').type('jhojanhernandezy24@outlook.es'); // Abre el mat-select
    cy.get('[formControlName="password"]').type('123'); // Abre el mat-select
    cy.contains('Iniciar sesion').click();
    cy.visit('http://localhost:4200/#/sign-in?redirectURL=%2Fdashboards%2Finicio')
});

Cypress.Commands.add('procesarFilasDriver', { prevSubject: false }, (filePath: string, sheetName: string): any => {
    let lista: any = [];

    cy.readExcel(filePath, sheetName).then((excelData: any) => {
        cy.visit('https://optoride.azurewebsites.net/#/management/driver-list')
        cy.contains('Nuevo', { timeout: 3000 }).click();
        cy.wait(1000)
        let success: boolean = false;

        excelData.forEach((rowData: any, rowIndex: any) => {
            let modifiedText = rowData[0].toLowerCase().replace(/(?:^|\s)\S/g, (a: any) => a.toUpperCase());
            // Código que podría generar una excepción
            //cy.log(`Procesando fila ${rowIndex + 1}: ${JSON.stringify(rowData)}`);
            // let success = false;
            if (rowIndex > 7) {
                let cont = 0;
                console.log('valor cadena', modifiedText)
                cy.get('[formControlName="idCompany"]').click();
                cy.contains(modifiedText).click();

                if (cont >= 200) {
                    return
                }
                success = true;
                cont++;
                cy.get('[formControlName="name"]').type(rowData[4]);
                cy.get('[formControlName="identificationNumber"]').type(rowData[7]);
                cy.get('[formControlName="lastNameOne"]').type(rowData[5]);
                cy.get('[formControlName="lastNameTwo"]').type(rowData[6]);
                cy.get('[formControlName="emailDriver"]').type(rowData[9]);
                cy.get('[formControlName="birthdate"]').type(rowData[1]);
                cy.get('[formControlName="identificationExpirationDate"]').type(rowData[3]);
                cy.get('[formControlName="licenseExpirationDate"]').type(rowData[2]);

                
                if (rowData[8] == null || rowData[8] == '') {
                    cy.get('[formControlName="phoneNumber"]').type('3002004700');
                } else {
                    let replace = rowData[8];
                    if(typeof rowData[8] === 'string'){
                        replace = rowData[8].replace(/[^\w\s]/g, '').replace(/\s/g, ''); // Esto quita todos los caracteres no alfanuméricos
                    }
                    cy.get('[formControlName="phoneNumber"]').type(replace);
                }
    
                cy.wait(2000);
                cy.contains('Guardar').click();
                cy.get('.txt-description-alert')
                    .invoke('text').then((textoDelSpan) => {
                        // Hacer algo con el texto obtenido
                        console.log('Texto del ', textoDelSpan);
                        // Puedes realizar afirmaciones u otras acciones aquí
                        expect(textoDelSpan).to.satisfy((texto: any) => {
                            // Puedes agregar o cambiar los valores esperados según tus necesidades
                            if (texto === 'Error interno del sistema' || texto === 'El correo electrónico enviado para el conductor ya se encuentra registrado en el sistema' || texto === 'El número de cédula enviado para el conductor ya se encuentra registrado en el sistema') {
                                lista.push({
                                    nombre: rowData[10],
                                    identificacion: rowData[13],
                                    error: texto,  // Puedes personalizar este campo según sea necesario
                                });
                            }
                            return texto === 'Error interno del sistema' || texto === 'El correo electrónico enviado para el conductor ya se encuentra registrado en el sistema' || texto === 'El número de cédula enviado para el conductor ya se encuentra registrado en el sistema' || texto === 'La información se guardó correctamente';
                        }, `El texto "${textoDelSpan}" no es uno de los valores esperados.`);
                    });
                cy.wait(2000)
                cy.writeFile('Report.txt', lista, 'utf-8');
                cy.contains('Limpiar').click();

            }

        });

    });

});
