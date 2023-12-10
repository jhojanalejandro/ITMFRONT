
describe('Recorrer filas del Excel', () => {
  
  it('Login', () => {
    // cy.login2();
    cy.wait(2000)
    cy.procesarFilas('C:/Users/Alejo/Documents/Carga Modificada.xlsx', '5.Pasajeros');
  });
    

  // it('Procesar cada fila', () => {
  //   cy.procesarFilas('C:/Users/Alejo/Documents/Carga Inicial al 24Nov2023.xlsx', 'Hoja1');
  // });
});