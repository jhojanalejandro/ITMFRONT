// describe('lista contratos', () => {
//     it.only('registrar usuario', () => {
//         cy.visit('http://localhost:4200/#/sign-up')

//         cy.get('[formControlName="userName"]').type('jhojan alejandro hernandez yepes');
//         cy.get('[formControlName="identification"]').type('1000189631');
//         cy.get('[formControlName="phoneNumber"]').type('3003853164');
//         cy.get('[formControlName="email"]').type('jhojanhernandezy24@outlook.es');

//         cy.get('[formControlName="passwordMail"]').type('ALEJO_0406');
//         cy.get('[formControlName="professional"]').type('ADMINISTRADOR PLATAFORMA');

//         cy.get('[formControlName="password"]').type('123');
//         cy.get('[formControlName="confirmPassword"]').type('123');
//         cy.contains('Registrarse').click();
//         cy.get('[data-cy=mi-boton]').click();
//         cy.wait(2000);
//         cy.contains('Ya existe un usuario registrado con ese correo')

//         cy.contains('Iniciar sesion').click();

//         cy.contains('iniciar sesion').click();
//         cy.wait(3000);
//         cy.login('jhojanhernandezy24@outlook.es', '123', 'Contractual');
//         cy.GetAllContracts(token);
//     })
// })

describe('lista contratos', () => {

    it.only('registrar usuario', () => {
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
        cy.contains('Ya existe un usuario registrado con ese correo')

        cy.contains('Iniciar sesion').click();

        cy.contains('iniciar sesion').click();
        cy.wait(3000);
        cy.login('jhojanhernandezy24@outlook.es', '123', 'Contractual');
        // cy.GetAllContracts(token);
    })

    it.only('registrar usuario contractual', () => {
        cy.visit('http://localhost:4200/#/sign-up')
        cy.get('[formControlName="userName"]').type('MARIO MUÑOS RESTREPO');
        cy.get('[formControlName="identification"]').type('15236598');
        cy.get('[formControlName="phoneNumber"]').type('32012365419');
        cy.get('[formControlName="email"]').type('mario@outlook.es');
        cy.get('[formControlName="passwordMail"]').type('827');
        cy.get('[formControlName="professional"]').type('CONTRACTUAL 2');
        cy.get('[formControlName="password"]').type('4567');
        cy.get('[formControlName="confirmPassword"]').type('4567');
        cy.contains('Registrarse').click();
        cy.get('[data-cy=mi-boton]').click();
        cy.wait(3000);
    })

    it.only('registrar usuario contractual', () => {
        cy.visit('http://localhost:4200/#/sign-up')

        cy.get('[formControlName="userName"]').type('SANDRA MORALES');
        cy.get('[formControlName="identification"]').type('184056325');
        cy.get('[formControlName="phoneNumber"]').type('3022569853');
        cy.get('[formControlName="email"]').type('sandra@outlook.es');
        cy.get('[formControlName="passwordMail"]').type('6686');
        cy.get('[formControlName="professional"]').type('JURIDICO 2');
        cy.get('[formControlName="password"]').type('9997');
        cy.get('[formControlName="confirmPassword"]').type('9997');
        cy.contains('Registrarse').click();
        cy.get('[data-cy=mi-boton]').click();
    cy.wait(3000);
    })

    it.only('registrar usuario supervisor', () => {
        cy.visit('http://localhost:4200/#/sign-up')

        cy.get('[formControlName="userName"]').type('angelica estrada');
        cy.get('[formControlName="identification"]').type('74526651');
        cy.get('[formControlName="phoneNumber"]').type('301251879');
        cy.get('[formControlName="email"]').type('angelica20@outlook.es');
        cy.get('[formControlName="passwordMail"]').type('1590');
        cy.get('[formControlName="professional"]').type('SUPERVISOR');
        cy.get('[formControlName="password"]').type('4566');
        cy.get('[formControlName="confirmPassword"]').type('4566');
        cy.contains('Registrarse').click();
        cy.get('[data-cy=mi-boton]').click();
        cy.wait(3000);

    })

    it.only('registrar usuario juridico', () => {
        cy.visit('http://localhost:4200/#/sign-up')

        cy.get('[formControlName="userName"]').type('ANDRES ESTRADA');
        cy.get('[formControlName="identification"]').type('10025698');
        cy.get('[formControlName="phoneNumber"]').type('301254879');
        cy.get('[formControlName="email"]').type('andres20@outlook.es');
        cy.get('[formControlName="passwordMail"]').type('777');
        cy.get('[formControlName="professional"]').type('JURIDICO');
        cy.get('[formControlName="password"]').type('456');
        cy.get('[formControlName="confirmPassword"]').type('456');
        cy.contains('Registrarse').click();
        cy.get('[data-cy=mi-boton]').click();
        cy.wait(3000);

    })

    it.only('registrar usuario jefe de area', () => {
        cy.visit('http://localhost:4200/#/sign-up')

        cy.get('[formControlName="userName"]').type('HOLGA QUIÑONES');
        cy.get('[formControlName="identification"]').type('10005236598');
        cy.get('[formControlName="phoneNumber"]').type('30152365489');
        cy.get('[formControlName="email"]').type('holgaqq@outlook.es');
        cy.get('[formControlName="passwordMail"]').type('111');
        cy.get('[formControlName="professional"]').type('JEFE DE AREA DE NEGOCIOS');
        cy.get('[formControlName="password"]').type('444');
        cy.get('[formControlName="confirmPassword"]').type('444');
        cy.contains('Registrarse').click();
        cy.get('[data-cy=mi-boton]').click();
        cy.wait(3000);

    })



    it.only('registrar usuario supervisor', () => {
        cy.visit('http://localhost:4200/#/sign-up')

        cy.get('[formControlName="userName"]').type('CARLOS MUÑOS');
        cy.get('[formControlName="identification"]').type('1045236598');
        cy.get('[formControlName="phoneNumber"]').type('32012365489');
        cy.get('[formControlName="email"]').type('carlosm@outlook.es');
        cy.get('[formControlName="passwordMail"]').type('777');
        cy.get('[formControlName="professional"]').type('SUPERVISOR');
        cy.get('[formControlName="password"]').type('456');
        cy.get('[formControlName="confirmPassword"]').type('456');
        cy.contains('Registrarse').click();
        cy.get('[data-cy=mi-boton]').click();
            cy.wait(3000);
    })

    it.only('registrar usuario contractual', () => {
        cy.visit('http://localhost:4200/#/sign-up')

        cy.get('[formControlName="userName"]').type('alejandro martines');
        cy.get('[formControlName="identification"]').type('100056325');
        cy.get('[formControlName="phoneNumber"]').type('3012569853');
        cy.get('[formControlName="email"]').type('alejo@outlook.es');
        cy.get('[formControlName="passwordMail"]').type('666');
        cy.get('[formControlName="professional"]').type('CONTRACTUAL');
        cy.get('[formControlName="password"]').type('999');
        cy.get('[formControlName="confirmPassword"]').type('999');
        cy.contains('Registrarse').click();
        cy.get('[data-cy=mi-boton]').click();
        cy.wait(3000);

    })

    it.only('registrar usuario planeación', () => {
        cy.visit('http://localhost:4200/#/sign-up')

        cy.get('[formControlName="userName"]').type('maria elena');
        cy.get('[formControlName="identification"]').type('102255654');
        cy.get('[formControlName="phoneNumber"]').type('320120365');
        cy.get('[formControlName="email"]').type('mariaestrada@outlook.es');

        cy.get('[formControlName="passwordMail"]').type('888');
        cy.get('[formControlName="professional"]').type('PLANEACIÓN');

        cy.get('[formControlName="password"]').type('321');
        cy.get('[formControlName="confirmPassword"]').type('321');
        cy.contains('Registrarse').click();
        cy.get('[data-cy=mi-boton]').click();
    });
});

// describe('lista contratos', () => {
//     it.only('registrar usuario juridico', () => {
//         cy.visit('http://localhost:4200/#/dashboards/inicio');
//         cy.get('tr[data-registro-id="2"]').click();
//     })
// });


