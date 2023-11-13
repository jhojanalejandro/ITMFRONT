
// describe('login spec', () => {
//   it('inicio sesion', () => {
//     cy.visit('http://localhost:4200/#/sign-in?redirectURL=%2Fdashboards%2Finicio')
//     cy.login('jhojanhernandezy24@outlook.es', '123', 'Contractual');

//     cy.window().then((win) => {
//       // Obtén el valor del token del Local Storage
//       const token = win.localStorage.getItem('accessToken');
//       console.log('Token guardado:', token);
//       cy.GetAllContracts(token);
//       // Puedes realizar acciones adicionales con el token si es necesario
//     });
//     cy.wait(2000);
//     cy.visit('http://localhost:4200/#/docs/ecommerce/contratos/register');
//     cy.wait(2000);
//     cy.contains('Registrar proyecto').click();
//     cy.get('[formControlName="companyName"]').type('LOGAN');
//     cy.get('[formControlName="projectName"]').type('PROYECTO LOGAN');

//     cy.get('[formControlName="project"]').type('012356');
//     cy.get('[formControlName="rubro"]').click();
//     cy.contains('21202020080002').click();

//     cy.get('[formControlName="fuenteRubro"]').click();
//     cy.contains('FUNCIONAMIENTO').click();

//     cy.get('[formControlName="numberProject"]').type('012548536');
//     cy.get('[formControlName="fechaContrato"]').click();
//     cy.contains('10').click();
//     cy.get('[formControlName="fechaFinalizacion"]').click();
//     cy.contains('30').click();

//     cy.get('[formControlName="objectContract"]').type('OBJETO CONTRATO');
//     cy.get('[formControlName="dutyContract"]').type('DEBERES PARA EL CONTRATO');

//     // cy.contains('Guardar').click();
//     cy.contains('Cancelar').click();
//     cy.wait(2000);

//     // cy.get('[data-cy=boton-icono]').click();
//     cy.visit('http://localhost:4200/#/dashboards/inicio');
//     cy.visit('http://localhost:4200/#/dashboards/lista-contratistas/14f5ce83-ad8f-401a-a2c1-a1103cfa252c/PROYECTO%20ITM');
//     cy.wait(1000);
//     cy.contains('Tiempo entrega').click();
//     cy.get('[formControlName="dateTo"]').click();
//     cy.contains('25').click();
//     cy.contains('Cancelar').click();
//     cy.wait(1000);
//     cy.contains('Enviar Correos').click();
//     cy.visit('http://localhost:4200/#/dashboards/inicio');

//     cy.get('tr[data-registro-id="2"]').click();

//     // cy.get('#mi-lista') // Selecciona la tabla por su id
//     // .find('td.mat-cell') // Encuentra todas las celdas de la tabla
//     // .each(($cell) => {
//     //   const texto = $cell.text();
//     //   if (texto.includes('Texto específico a buscar')) {
//     //     // Hacer algo con el registro encontrado, como hacer clic en él
//     //     cy.wrap($cell).click(); // o realiza la acción deseada
//     //   }
//     // });
//     // cy.get('mat-select').click();
//     // cy.get('mat-option').contains('REGISTRO').click();
//     // cy.get('mat-select').should('be.visible').click();

//     // cy.contains('FUNCIONAMIENTO').click();
//     // cy.get('table tr:eq(1) [data-cy=boton-con-icono]').click();
//     // cy.get('table tr:eq(1) [data-cy=boton-con-icono]').should('be.visible').click();

//     // cy.contains('Cargar Contratistas').click();
//     // cy.get('[formControlName="project"]').click();
//     // cy.contains('PROYECTO ITM').click();
//     // cy.get('Seleccionar archivo').click();
//     // cy.wait(2000);
//     // cy.get('[data-cy=file-input]').click();

//     // cy.fixture('D:\Trabajo\PROYECTOS\ITMHIRINGPROJECT/NuevoReporteInformacionContratista.xlsx').then((fileContent) => {
//     //   // Visita la página con el formulario
//     //   cy.visit('URL_de_tu_pagina_con_el_formulario');

//     //   // Encuentra el elemento de entrada de tipo "file"
//     //   cy.get('input[type="file"]').then((input) => {
//     //     // Crea un archivo Blob a partir del contenido del archivo
//     //     const blob = new Blob([fileContent], { type: 'tipo-de-archivo' });
//     //     const testFile = new File([blob], 'nombre-del-archivo.ext', { type: 'tipo-de-archivo' });

//     //     // Usa el método .attach() para establecer el archivo cargado
//     //     const dataTransfer = new DataTransfer();
//     //     dataTransfer.items.add(testFile);
//     //     // input[0].files = dataTransfer.files;
//     //   });

//     //   // Continúa con tus acciones en el formulario, como hacer clic en el botón de envío, etc.
//     // });

//   })

//   // it('abrir registro contrato', () => {
//   //   cy.visit('http://localhost:4200/#/docs/ecommerce/contratos/register')
//   //   cy.contains('Registrar proyecto').click();
//   // })

// })

describe('login spec', () => {
  it('REGISTRAR PROYECTO', () => {
    cy.visit('http://localhost:4200/#/sign-in?redirectURL=%2Fdashboards%2Finicio')
    cy.login('jhojanhernandezy24@outlook.es','123','Contractual');
    cy.scrollTo(0, 600);
    cy.get('tr:contains("01225") .boton-de-clic').click();
    cy.wait(1000);
    // cy.visit('http://localhost:4200/#/sign-in?redirectURL=%2Fdashboards%2Finicio')
    cy.scrollTo(0, 600);
    cy.get('tr:contains("1013340871") .option').click();
    cy.scrollTo(0, 900);
    cy.get('.aregar').click();
    cy.get('.btn-cancelar').click();
    cy.wait(1000);
    cy.visit('http://localhost:4200/#/sign-in?redirectURL=%2Fdashboards%2Finicio');
    cy.get('tr:contains("01225") .boton-de-clic').click();
        cy.wait(1000);
    // cy.visit('http://localhost:4200/#/dashboards/lista-contratistas/14f5ce83-ad8f-401a-a2c1-a1103cfa252c/PROYECTO%20ITM')
    // cy.get('tr:contains("1013340871") .boton-de-clic').click();
    cy.scrollTo(0, 500);
    cy.get('tr:contains("1008658715") .option').click();
    cy.wait(1000);
    cy.get('.aregar').click();

  });
})
