import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ShareService {
    unidades: any = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    decenas: any = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    centenas: any = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    constructor(private _httpClient: HttpClient) {
    }
    Unidades(num) {
        switch (num) {
            case 1: return 'UN';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
        }

        return '';
    }//Unidades()

    Decenas(num) {
        let decena = Math.floor(num / 10);
        let unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + this.Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + this.Unidades(unidad);
                }
            case 3: return this.DecenasY('TREINTA', unidad);
            case 4: return this.DecenasY('CUARENTA', unidad);
            case 5: return this.DecenasY('CINCUENTA', unidad);
            case 6: return this.DecenasY('SESENTA', unidad);
            case 7: return this.DecenasY('SETENTA', unidad);
            case 8: return this.DecenasY('OCHENTA', unidad);
            case 9: return this.DecenasY('NOVENTA', unidad);
            case 0: return this.Unidades(unidad);
        }
    }//Unidades()

    DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + this.Unidades(numUnidades)

        return strSin;
    }//DecenasY()

    Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + this.Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + this.Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + this.Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + this.Decenas(decenas);
            case 5: return 'QUINIENTOS ' + this.Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + this.Decenas(decenas);
            case 7: return 'SETECIENTOS ' + this.Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + this.Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + this.Decenas(decenas);
        }

        return this.Decenas(decenas);
    }

    Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = this.Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    }//Seccion()

    Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = this.Seccion(num, divisor, 'UN MIL', 'MIL');
        let strCentenas = this.Centenas(resto);

        if (strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    }

    Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = this.Seccion(num, divisor, 'UN MILLON DE', 'MILLONES');
        let strMiles = this.Miles(resto);

        if (strMillones == '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    }

    calcularDiferencia(fechaInicio: Date, fechaFin: Date) {
        let fechaInicios = new Date(fechaInicio);
        let fechaFins = new Date(fechaFin);
        const diferencia = fechaFins.getTime() - fechaInicios.getTime();
        const diasTotales = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const meses = Math.floor(diasTotales / 30);
        const dias = diasTotales % 30;
        if (meses > 0 && meses == 1) {
            return `${meses} mes y ${dias} días`
        } else if (meses > 0 && meses > 1) {
            return `${meses} meses y ${dias} días`
        } else {
            return `${dias} días`
        }
    }

    numeroALetras(total, currency) {
        const numericValue = Number(total.toString().replace(/\./g, ''));

        currency = currency || {};
        let data = {
            numero: numericValue,
            enteros: Math.floor(numericValue),
            letrasMonedaPlural: currency.plural || 'PESOS',
            letrasMonedaSingular: currency.singular || 'PESO',
        };

        if (data.enteros === 0) {
            return 'CERO ' + data.letrasMonedaPlural;
        } else {
            const millonesParte = this.Millones(data.enteros);
            const monedaParte = data.enteros === 1 ? data.letrasMonedaSingular : data.letrasMonedaPlural;
            let resultado = millonesParte;
            // Verificar si se debe agregar "DE"
            const milesParte = data.enteros % 1000000;

            if (milesParte === 0) {
                resultado += ' DE';
            }

            resultado += ' ' + monedaParte;
            return resultado;
        }
    }

    transform(value: number): string {
        if (value === 0) {
            return 'cero pesos';
        }

        let numeroEnLetras = '';


        if (value >= 1000000000) {
            const milesMillones = Math.floor(value / 1000000000);
            numeroEnLetras += this.obtenerTextoCentenas(milesMillones) + ' mil millones ';
            value %= 1000000000;
        }else if (value >= 1000000) {
            const millones = Math.floor(value / 1000000);
            numeroEnLetras += this.obtenerTextoCentenas(millones) + ' millones ';
            value %= 1000000;
        }else if (value >= 1000000) {
            const millones = Math.floor(value / 1000000);
            numeroEnLetras += this.obtenerTextoCentenas(millones) + ' millón ';
            value %= 1000000;
        }

        if (value >= 1000) {
            const miles = Math.floor(value / 1000);
            numeroEnLetras += this.obtenerTextoCentenas(miles) + ' mil ';
            value %= 1000;
        }

        numeroEnLetras += this.obtenerTextoCentenas(value) + ' pesos';

        return numeroEnLetras;
    }
    obtenerTextoCentenas(valor: number): string {
        const centenas = Math.floor(valor / 100);
        const decenas = Math.floor((valor % 100) / 10);
        const unidades = valor % 10;

        let textoCentenas = '';

        if (centenas > 0) {
            if (centenas === 1 && decenas === 0 && unidades === 0) {
                textoCentenas = 'cien';
            } else {
                textoCentenas = this.centenas[centenas];
            }
        }

        if (decenas === 1) {
            textoCentenas += this.unidades[decenas * 10 + unidades];
        } else {
            textoCentenas += this.decenas[decenas];
            if (unidades > 0) {
                textoCentenas += ' y ' + this.unidades[unidades];
            }
        }
        return textoCentenas;
    }
    transformDate(value: string): string {
        const meses = [
            'enero',
            'febrero',
            'marzo',
            'abril',
            'mayo',
            'junio',
            'julio',
            'agosto',
            'septiembre',
            'octubre',
            'noviembre',
            'diciembre'
        ];

        const fecha = new Date(value);
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();

        return `${dia} de ${mes} del ${año}`;
    }


    loadAndConvertImageToBase64(imagePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(imagePath, { responseType: 'blob' })
                .subscribe((blob: Blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64Data = reader.result as string;
                        resolve(base64Data);
                    };
                    reader.onerror = (error) => {
                        reject(error);
                    };
                    reader.readAsDataURL(blob);
                }, (error) => {
                    reject(error);
                });
        });
    }
    getCurrentDate(): string {
        const datePipe = new DatePipe('en-US');
        const currentDate = new Date();
        return datePipe.transform(currentDate, 'yyyy-MM-dd');
    }
}
