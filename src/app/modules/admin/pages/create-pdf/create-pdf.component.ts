import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { documentMinutaAdicion, documentMinutaAmpliacion, documentPreviousStudy, documentMinutaAdicion1YAmpliacion1, documentSolicitudComite, minutaModificacionMacro } from './dataPdf';
import { DatePipe, LocationStrategy } from '@angular/common';
import { ShareService } from 'app/layout/common/share-service/share-service.service';

@Component({
    selector: 'app-create-pdf',
    templateUrl: './create-pdf.component.html',
    styleUrls: ['./create-pdf.component.scss']
})
export class CreatePdfComponent implements OnInit {
    imageUrl: any;
    base64Image: any;
    constructor(private location: LocationStrategy, private _shareService: ShareService) {

    }
    image: string = '../../../../../assets/images/imagesPdf/footerPdfMinutaAmpliacion.jpg'
    ngOnInit(): void {
        this.imageUrl = window.location.origin + '/assets/images/imagesPdf/alcaldiaMedellin.png';
    }

    getRelativeImagePath(imageName: string): string {
        const basePath = this.location.getBaseHref();
        return `${basePath}/${imageName}`;
    }
    convertImageToBase64(imagePath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    resolve(base64);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = (error) => {
                reject(error);
            };
            xhr.open('GET', imagePath);
            xhr.responseType = 'blob';
            xhr.send();
        });
    }
    downloadExpancionMinute() {
        let data = documentMinutaAmpliacion;
        this.downloadAsPDFs(data, 'MINUTA DE AMPLIACIÓN');
    }

    downloadAditionMinute() {
        let data = documentMinutaAdicion;
        this.downloadAsPDFs(data, 'MINUTA DE ADICIÓN');
    }

    downloadAdition1AndExpancion1Minute() {
        let data = documentMinutaAdicion1YAmpliacion1;
        this.downloadAsPDFs(data, 'MINUTA DE ADICIÓN');
    }

    downloadPreviousStudy() {
        let data = documentPreviousStudy;
        this.downloadAsPDFs(data, 'ESTUDIO PREVIO');
    }

    downloadAsPDFs(data: any, nameDocument: string) {
        return pdfMake.createPdf(data).download(nameDocument);
    }

    downloadsolicitudComite() {
        let data = documentSolicitudComite;
        this.downloadAsPDFs(data, 'SOLICITUD COMITE');
    }

    downloadMinutaMacro() {
        let data = minutaModificacionMacro;
        const imagePath = '/assets/images/imagesPdf/alcaldia.jpeg';

        this._shareService.loadAndConvertImageToBase64(imagePath)
            .then(base64Data => {
                this.base64Image = base64Data;
                this.downloadMinutaMacropdf();
            })
            .catch(error => {
                console.error('Error al cargar y convertir la imagen:', error);
            });
    }

    downloadMinutaMacropdf() {

        
        let dat = this.getCurrentDate();
        const minutaModificacionMacro = {
            pageSize: 'A4',
            pageOrientation: 'FOLIO',
            pageMargins: [40, 80, 40, 60],
            header: {
                margin: [50, 10,0,50],
                table: {
                    widths: [100, 150, 100, 115],
                    body: [
                        [
                            {
                                colSpan: 4,
                                text: '',
                                fillColor: '#eeeeff',
                            },
                            {},
                            {},
                            {}
                        ],
                        [
                            {
                                text: 'Cód FOADQU-283',
                                style: 'title',
                            },
                            {
                                colSpan: 2,
                                rowSpan: 3,
                                text: 'FO-ADQU Anexo Modificación Contrato Electrónico',
                                style: 'title',
                            },
                            {},
                            {
                                rowSpan: 3,
                                image: this.base64Image,
                                // image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABACAMAAABvJxYMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUAAAAMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVv////Mb2P8AAAA/XRSTlMAAAIBAyF5qY0jBBEiOE9lipiip6uo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',
                                style: 'title',
                                fit: [100, 100],
                            }
                        ],
                        [
                            {
                                text: 'Versión 1',
                                style: 'title',
                            },
                            {
                                text: '',
                                style: 'fontPeque',
                            },
                            {
                                text: 'PRODUCTO PARA CONTRATAR',
                                style: 'fontPeque',
                            },
                            {}
                        ],
                        [
                            {
                                colSpan: 4,
                                text: '',
                                fillColor: '#eeeeff',
                            },
                            {
                                text: '',
                            },
                            {
                                text: '',
                            },
                            {
                            }
                        ],
                    ],
                },
            },

            footer: {
                margin: [10, 10],
                text: 'Medellín - Colombia',
                alignment: 'center',
            },
            content: [
                {
                    margin: [10, 30, 10, 10],
                    text: 'MODIFICACIÓN 02 AL CONTRATO INTERADMINISTRATIVO No.4600094990 DE 2022',
                    bold: true,
                    style: 'fontPeque2',
                    alignment: 'center',
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            text: 'VALOR INICIAL:',
                            bold: true,
                            fontSize: 10,
                        },
                        {
                            text: 'DOS MIL TRESCIENTOS SESENTA Y CINCO MILLONES CIENTO SETENTA Y SIETE MIL SETECIENTOS OCHENTA Y UN PESOS M/L ($2.365.177.781) EXENTO DE IVA'
                        }
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            text: 'DURACIÓN:',
                            bold: true,
                            fontSize: 10,
                        },
                        {
                            text: 'CIENTO CUARENTA Y TRES (143) DÍAS CALENDARIOS SIN EXCEDER LA PRESENTE VIGENCIA'
                        }
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            text: 'MODIFICACIÓN 01:',
                            bold: true,
                            fontSize: 10,
                        },
                        {
                            fontSize: 10,
                            text: [
                                {
                                    text: 'AMPLIACIÓN 01: ',
                                    bold: true,
                                },
                                {
                                    text: 'Por el término de cuarenta y ocho(48) días calendarios contados a partir del primero (01) de enero de dos mil veintitrés (2023) hasta el diecisiete(17) de febrero de dos mil veintitrés (2023) ambas fechas inclusive.'
                                },
                            ]
                        }
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            text: ''
                        },
                        {
                            fontSize: 10,
                            text: [
                                {
                                    text: 'Otrosí 01: ',
                                    bold: true,
                                },
                                {
                                    text: 'Modificar las especificaciones técnicas, modificando el plazo de entrega de unos productos, así como adicionar la entrega de otros durante el periodo de modificación.'
                                },
                            ]
                        }
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            text: ''
                        },
                        {
                            fontSize: 10,
                            text: [
                                {
                                    text: 'Otrosí 02: ',
                                    bold: true,
                                },
                                {
                                    text: 'Redistribución de recursos'
                                },
                            ]
                        }
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            text: ''
                        },
                        {
                            fontSize: 10,
                            text: [
                                {
                                    text: 'Otrosí 03: ',
                                    bold: true,
                                },
                                {
                                    text: 'Modificación de la forma de pago del contrato, teniendo en cuenta que para el mes de diciembre el contratista no había terminado con algunos de los productos, la entidad Distrital esta imposibilidad de pagar la totalidad del contrato, dado que para el mes de diciembre se había estipulado un pago por la suma TRESCIENTOS CINCUENTA Y CUATRO MILLONES SETECIENTOS SETENTA Y SEIS MIL SEISCIENTOS SESENTA Y SIETE PESOS M/L ($354.776.667) para lo cual este debía entregar un informe técnico y de gestión, con la realización de los productos durante el mes, informe financiero, soportes del pago de la seguridad social integral, la cuenta de cobro y/o factura debidamente legaliza y la certificación del recibo a satisfacción por parte del supervisor del servicio recibido por el supervisor del proyecto designado por la Secretaría de la No-Violencia, ante esta imposibilidad sumado al cierre presupuestal de la entidad mediante la Resolución 202250104780 – COMFIS 102 del 06 de octubre del 2022, se requiere modificar la forma de pago estableciendo un pago parcial por la suma de CIENTO SESENTA Y DOS MILLONES SEISCIENTOS NOVENTA Y CINCO MIL CIENTO CINCUENTA Y CUATRO PESOS M/L ($162.695.154), los restantes CIENTO NOVENTA Y DOS MILLONES OCHENTA Y UN MIL QUINIENTOS TRECE PESOS M/L ($192.081.513) se pagará una vez el CONTRATISTA cumpla a cabalidad con los productos'
                                },
                            ]
                        }
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            text: 'MODIFICACIÓN ACTUAL',
                            bold: true,
                            fontSize: 10,
                        },
                        {
                            text: [
                                {
                                    text: 'Ampliación 02: ',
                                    bold: true,
                                },
                                {
                                    text: 'Por el término de once (11) días calendarios contados a partir del dieciocho (18) de febrero de dos mil veintitrés (2023) hasta el veintiocho (28) de febrero de dos mil veintitrés (2023), ambas fechas inclusive.'
                                },
                            ]
                        }
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            text: ''
                        },
                        {
                            text: 'Otrosí 04: Redistribución de recursos entre Componente 4: Promoción y gestión de la Justicia Restaurativa con una disminución de un valor de ONCE MILLONES QUINIENTOS VEINTITRÉS MIL CIENTO SESENTA Y SEIS PESOS ($11.523.166) y un aumento para el componente 6: Transversal administrativo, por el mismo valor'
                        }
                    ]
                },
                {
                    margin: [40, 30, 20, 0],
                    alignment: 'center',
                    text: 'Número de Acta del Comité que aprueba la modificación: ACTA 05 de 15/02/2023 Secretaría de la No-Violencia y ACTA 14 de 17/02/2023 de Secretaría de Seguridad y Convivencia.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    alignment: 'center',
                    text: 'CONSIDERACIONES',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: '1. Actualmente se encuentra en ejecución el Contrato Interadministrativo N° 4600094990 de 2022, cuyo objeto es “Contrato Interadministrativo para el apoyo en la aplicación de Justicia Restaurativa y segundas oportunidades en los PPL, pospenados, familias y jóvenes del SRPA”, al 17 de febrero del 2023 según informe de supervisión se ha ejecutado financieramente el 91,87% y su ejecución física en un 90,28%.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: '2. El Distrito Especial de Ciencia tecnología e innovación de Medellín ha venido atendiendo a las personas privadas de la libertad, pospenada, sus familias y la prevención temprana del delito con NNAJ que favorecen la resignificación y reinserción satisfactoria a la vida civil, proceso que se adelanta a través de acciones psicosociales y capacitaciones en artes y oficios según lo establece el Acuerdo Municipal 05 de 2006 “Por el cual se institucionaliza la intervención social del Municipio en los establecimientos penitenciarios y carcelarios de la ciudad de Medellín”, expedido por el Concejo Municipal de Medellín.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: '3. La Secretaría de la No-Violencia y la Secretaría de Seguridad y Convivencia, en cumplimiento de su deber objetivo de atención, vienen desarrollando las siguientes líneas de intervención en el marco del contrato interadministrativo, los estudios previos y documentos que lo integran, así:',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 30, 0],
                    alignment: 'center',
                    text: 'COMPONENTE 1: ATENCIÓN INTEGRAL A LA POBLACIÓN PRIVADA DE LA LIBERTAD Y SUS FAMILIAS.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 30, 0],
                    text: 'Para la ejecución del componente 1, se distribuyó por líneas de acción, las cuales son los siguientes:',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 30, 0],
                    fontSize: 10,
                    ol: [
                        'Intervención psicosocial a población privada de la libertad y sus familias, en centros penitenciarios y centros transitorios.',
                        'Asesoría jurídica en centros penitenciarios y centros transitorios.',
                        'Capacitación en artes y oficios. 4. Descongestión del proceso penitenciario y carcelario'
                    ]
                },
                {
                    margin: [40, 30, 30, 0],
                    alignment: 'center',
                    text: 'COMPONENTE 2: ACOMPAÑAMIENTO A LA POBLACIÓN POSPENADA Y SUS FAMILIAS (CASA DE LA LIBERTAD).',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 30, 0],
                    text: 'Para la ejecución del componente 2, se distribuyó por líneas de acción, las cuales son los siguientes:',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    fontSize: 10,
                    ol: [
                        'Acompañamiento psicosocial a la población pospenada y sus familias.',
                        'Gestión de la autonomía económica'
                    ]
                },
                {
                    margin: [40, 30, 20, 0],
                    alignment: 'center',
                    text: 'COMPONENTE 3: PREVENCIÓN DE LAS VIOLENCIAS Y DEL DELITO CON PRÁCTICAS RESTAURATIVAS.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    alignment: 'center',
                    text: 'Para la ejecución del componente 3, se distribuyó por líneas de acción, las cuales son los siguientes: ',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    fontSize: 10,
                    ol: [
                        'Gestión de justicia restaurativa en comunidad educativa.',
                        'Padres y docentes.',
                        'Semilleros de convivencia.'
                    ]
                },
                {
                    margin: [40, 30, 20, 0],
                    text: 'COMPONENTE 4: PROMOCIÓN Y GESTIÓN DE LA JUSTICIA RESTAURATIVA.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: 'Para la ejecución del componente 4, se distribuyó por líneas de acción, las cuales son los siguientes:',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: '1. Gestión de conocimiento en Justicia Restaurativa 2. Apoyo para la implementación de una justicia restaurativa en centros privativos de la libertad y población pospenada. 3. Gestión para el relacionamiento interinstitucional, la promoción y difusión de la Justicia Restaurativa',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: 'COMPONENTE 5: JUSTICIA JUVENIL RESTAURATIVA. ',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: 'Para la ejecución del componente 5, se distribuyó por líneas de acción, las cuales son los siguientes:',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: '1. Coordinación y articulación de las acciones desarrolladas en el marco del sistema de responsabilidad penal para adolescentes – SRPA. 2. Programa de seguimiento judicial al tratamiento de drogas. 3. Centro de prácticas restaurativas.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: 'COMPONENTE 6: TRANSVERSAL ADMINISTRATIVO.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: 'Para la ejecución del componente 6, se distribuyó por líneas de acción, las cuales son los siguientes:',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: '1. Coordinación, planeación y seguimiento. 2. Gestión administrativa y financiera. 3. Gestión de la información.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: '4. Que dentro de la ejecución del Contrato Interadministrativo N°4600094990 de 2022 se presentó un retraso por parte de la entidad Distrital en la expedición del Decreto de Incorporación de Recursos, imposibilitando que la Institución Universitaria ITM pudiera contar con el recurso humano asociado a este proyecto dentro del periodo proyectado. Este retraso se vio reflejado en el retraso de la ejecución de algunos productos y se procedió a adelantar la modificación 01 del contrato, donde se realizó una ampliación por el término de cuarenta y ocho (48) días calendarios, contados a partir del primero (01) de enero del dos mil veintitrés (2023) hasta el diecisiete (17) de febrero del dos mil veintitrés (2023), ambas fechas inclusive; una redistribución de recursos y una modificación de la forma de pago del contrato.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 20, 0],
                    text: '5. Que teniendo en cuenta que la situación de la población privada de la libertad, pospenados y sus familias, ha sido declarada por la Corte Constitucional como un “Estado de Cosas Inconstitucional” , que hoy persiste, continúa el deber positivo del Estado en Cabeza del Distrito Especial de Ciencia, Tecnología e Innovación de Medellín – Secretaría de la No-Violencia y la Secretaría de Seguridad y Convivencia, para que desarrollen acciones en perspectiva de la garantía a esta población, de ciertas condiciones materiales de existencia, en vista de que por el hecho mismo de su situación no siempre pueden procurárselas por sí mismas.',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 30, 0],
                    text: '6. Que los componentes del proyecto ayudan al proceso de deshacinamiento de los establecimientos carcelarios, estaciones de policías, contribuyen a mejorar las condiciones de dignidad de las personas privadas de la libertad, pospenados, sus familias, los niños, niñas, adolescentes y jóvenes de la ciudad, se busca brindar formación, acompañamiento psicosocial y jurídico a la población, siendo esto una acción que no debe ser desatendida desde la administración distrital, máxime cuando se cuenta con diferentes ordenes de entes de control, autoridades administrativas y judiciales',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 30, 0],
                    text: [
                        {
                            text: '7. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Que de lo anterior, se evidencia la necesidad de mantener la correcta, continua y eficiente prestación del servicio de atención a la población privada de la libertad, pospenada, sus familias y en riesgo, población SRPA, en virtud de este contrato interadministrativo, como quiera que la necesidad permanece y el deber objetivo de la Secretaría de la No-Violencia y la Secretaría de Seguridad y Convivencia tendiente a la garantía de sus derechos debe continuar mientras la situación exista, en perspectiva de una mitigación de los efectos negativos de la prisionalización.',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [40, 30, 30, 0],
                    text: [
                        {
                            text: '8. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Que teniendo en cuenta esta el día 14 de febrero mediante oficio con radicado N° 202330048675 el Distrito envió solicitud de modificación N°02 al Contrato Interadministrativo N°4600094990, solicitando ampliación por el término de once (11) días, contados a partir del dieciocho (18) de febrero del dos mil veintitrés (2023) hasta el veintiocho (28) de febrero de dos mil veintitrés (2023), ambas fechas inclusive, para continuar la prestación de servicios que no pueden dejar de prestarse por parte de la entidad distrital, de igual forma se debe hacer una Redistribución de recursos entre Componente 4: Promoción y gestión de la Justicia Restaurativa con una disminución por un valor de ONCE MILLONES QUINIENTOS VEINTITRÉS MIL CIENTO SESENTA Y SEIS PESOS ($11.523.166) y un aumento para el componente 6: Transversal administrativo, por el mismo valor',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [40, 30, 30, 0],
                    text: [
                        {
                            text: '9. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Que el CONTRATISTA mediante comunicado del 15 de febrero de 2023 con radicado CE202310000566, envía carta de aceptación de la modificación, en los mismos sentidos propuestos por el Distrito de Medellín.',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [40, 30, 30, 0],
                    text: [
                        {
                            text: '10. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Que en observancia de lo descrito, el supervisor recomendó realizar la modificación 02 consistente en una ampliación 02 y un otrosí que contiene ajustes al Contrato Interadministrativo N°4600094990 de 2022, teniendo en cuenta que no existe prohibición legal para la prórroga del plazo de los contratos estatales, razón que el artículo 40 de la Ley 80 de 1993, establece regla general de la libertad de las estipulaciones, en cuanto dicen que podrán incluirse las modalidades, condiciones y en general las cláusulas o estipulaciones que las partes consideren necesarias y convenientes, siempre que no sean contrarias a la Constitución, la Ley, el orden público y los principios y la finalidades de esta ley a los de la buena administración y además dispone que “las entidades podrán celebrar los contratos y acuerdos que permitan a la autonomía de la voluntad y requieran el cumplimiento de los fines estatales”. ',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [40, 30, 30, 0],
                    text: [
                        {
                            text: '11. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Que para el efecto y como fundamento legal, las entidades estatales, en cualquier momento de la etapa contractual, mientras se encuentre vigente el plazo de ejecución del contrato, tienen la facultad para modificar los contratos bien sea para adicionar recursos, prorrogar el tiempo de la ejecución o para cambiar elementos accidentales del contrato (es decir aquellos que libremente las partes hayan acordado, como el plazo, la forma de pago, el valor del presupuesto, las cláusulas excepcionales, multas, etc), todo ello obrando de conformidad con el artículo 40 de la Ley 80 de 1993.',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [40, 30, 30, 0],
                    text: [
                        {
                            text: '12. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Que en los contratos es posible la prórroga, adición y cualquier modificación a los mismos, si la respectiva entidad considera que mediante esa figura se cumplen los fines estatales, conforme a lo indicado en los artículos 3 a 5 de la misma ley, y si las partes las consideran conveniente y necesaria y no resulta contraría a la Constitución, la Ley, el orden público, los principios y finalidades de la misma ley y a los de la buena administración',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [40, 30, 30, 0],
                    text: [
                        {
                            text: '13. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Que por acta del N° 05 del 15 de febrero de 2023, el Comité Interno de Planeación de la Secretaría de la No-Violencia y por Acta N°14 del 17 de febrero de 2023, el Comité Interno de Planeación de la Secretaría de Seguridad y Convivencia frente a la solicitud presentada concluyeron que era viable “Aprobar la modificación N°02 al Contrato Interadministrativo N°4600094990 de 2022”.',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [10, 30, 30, 0],
                    text: 'De conformidad con lo anterior, se realizan las siguientes',
                    fontSize: 10,
                },
                {
                    margin: [40, 30, 30, 0],
                    alignment: 'center',
                    text: 'MODIFICACIONES:',
                    fontSize: 10,
                },
                {
                    margin: [10, 30, 30, 0],
                    text: [
                        {
                            text: 'PRIMERA: MODIFICAR LA DURACIÓN DEL CONTRATO. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Ampliar el plazo contractual por el término de once (11) días calendarios contados a partir del dieciocho (18) de febrero de dos mil veintitrés (2023) hasta el veintiocho (28) de febrero de dos mil veintitrés (2023), ambas fechas inclusive, para una duración total del contrato de CIENTO OCHENTA Y OCHO (188) días calendario, teniendo en cuenta la fecha de inicio del contrato',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [10, 30, 30, 0],
                    text: [
                        {
                            text: 'SEGUNDA: MODIFICACIÓN DEL ANEXO ECONÓMICO. ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Para cumplir con los productos se requiere realizar una Redistribución de recursos entre componentes, de la siguiente forma:',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [10, 10, 10, 10],
                    table: {
                        widths: [200, 120, 150],
                        body: [
                            [
                                {
                                    text: 'COMPONENTE',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'VALOR',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'OBSERVACIÓN',
                                    style: 'fontPeque',
                                }
                            ],
                            [
                                {
                                    text: 'Componente 4: Promoción y gestión de la Justicia Restaurativa',
                                    style: 'fontPeque',
                                },
                                {
                                    text: '-$ 11.523.166 ',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'Valor a redistribuir',
                                    style: 'fontPeque',
                                },
                            ],
                            [
                                {
                                    text: 'COMPONENTE',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'VALOR',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'OBSERVACIÓN',
                                    style: 'fontPeque',
                                }
                            ],
                            [
                                {
                                    text: 'Componente 6: Transversal administrativo.',
                                    style: 'fontPeque',
                                },
                                {
                                    text: '$11.523.166',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'Valor redistribuido',
                                    style: 'fontPeque',
                                },
                            ],
                        ],
                    },
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                        }
                    }
                },
                {
                    margin: [10, 30, 10, 0],
                    text: 'Luego de realizar la redistribución los componentes quedarán con el siguiente valor:',
                    fontSize: 10,
                },
                {
                    margin: [10, 10, 10, 10],
                    table: {
                        widths: [160, 100, 100, 100],
                        body: [
                            [
                                {
                                    text: 'COMPONENTE',
                                    style: 'fontPeque',
                                    bold: true,
                                },
                                {
                                    text: 'VALOR ACTUAL DEL COMPONENTE ',
                                    style: 'fontPeque',
                                    bold: true,
                                },
                                {
                                    text: 'VALOR A REDISTRIBUIR',
                                    style: 'fontPeque',
                                    bold: true,
                                },
                                {
                                    text: 'NUEVO VALOR DEL COMPONENTE ',
                                    style: 'fontPeque',
                                    bold: true,
                                }
                            ],
                            [
                                {
                                    text: 'Componente 1: Atención integral a la población privada de la libertad y sus familias.',
                                    style: 'fontPeque',
                                },
                                {
                                    text: '-$ 11.523.166 ',
                                    style: 'fontPeque',
                                },
                                {},
                                {
                                    text: '$ 1.273.511.239',
                                    style: 'fontPeque',
                                },
                            ],
                            [
                                {
                                    text: 'Componente 2: Acompañamiento a la población pospenada y sus familias (Casa de la Libertad). ',
                                    style: 'fontPeque',
                                },
                                {
                                    text: '$ 151.122.580',
                                    style: 'fontPeque',
                                },
                                {},
                                {
                                    text: '$ 151.122.580',
                                    style: 'fontPeque',
                                },
                            ],
                            [
                                {
                                    text: 'Componente 3: Prevención de las violencias y del delito con prácticas restaurativas.',
                                    style: 'fontPeque',
                                },
                                {
                                    text: '$ 285.926.260',
                                    style: 'fontPeque',
                                },
                                {},
                                {
                                    text: '$ 285.926.260',
                                    style: 'fontPeque',
                                },
                            ],
                        ],
                    }
                },
                {
                    margin: [10, 30, 30, 0],
                    text: [
                        {
                            text: 'TERCERA: GARANTÍAS. EL CONTRATISTA ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'deberá ampliar y ajustar las garantías del Contrato Interadministrativo N°4600094990 de 2022.',
                            fontSize: 10,
                        },
                    ],
                },
                {
                    margin: [10, 30, 30, 0],
                    text: [
                        {
                            text: 'CUARTA: ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'En lo demás, la presente MODIFICACIÓN, queda sometida a las cláusulas establecidas en el Contrato Interadministrativo N°4600094990 de 2022.',
                            fontSize: 10,
                        },
                    ],
                },
                {
                    margin: [10, 30, 30, 0],
                    text: [
                        {
                            text: 'QUINTA: ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: ' PUBLICACIÓN. La presente Modificación deberá ser publicada en el Sistema Electrónico para la Contratación Pública – SECOP II que administra la Agencia Nacional de Contratación Pública – Colombia Compra Eficiente, conforme a lo establecido en la Ley y decretos reglamentarios.',
                            fontSize: 10,
                        },
                    ],
                },
                {
                    margin: [10, 30, 30, 0],
                    text: [
                        {
                            text: 'SEXTA: ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Hacen parte integrante de la presente MODIFICACIÓN, los siguientes documentos: a) Solicitud de modificación e informe de supervisión, b) Actas de losComités Internos de Planeación, c) Justificación, d) Aceptación por parte del contratista.',
                            fontSize: 10,
                        },
                    ]
                },
                {
                    margin: [10, 10, 10, 10],
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                {
                                    text: 'Proyecto',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'Revisó',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'Aprobó',
                                    style: 'fontPeque',
                                }
                            ],
                            [
                                {
                                    text: 'Carolina Suárez Vélez\nAsesora Secretaría de la No-Violencia\n',
                                    fontSize: 10,
                                    bold: true,
                                }, 
                                {
                                    text: 'Sonia Esperanza Contreras Suarez\nLíder de Proyecto Secretaría de Seguridad y Convivencia\n\nGustavo Alfonso Lopera Echeverri\nLíder de Programa Secretaría de Seguridad y Convivencia\n\nLorena Ospina Rincón\nContratista Secretaría de la No-Violencia\n',
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: 'Inés Marcela Molina Castaño\nSubsecretaria de Planeación de la Seguridad de Seguridad y Convivencia\n\nAna María Betancur Martínez\nAsesora del despacho Secretaría de Seguridad y Convivencia\n',
                                    fontSize: 10,
                                    bold: true,
                                },  
                            ]
                        ],
                    }
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                },
                subheader: {
                    fontSize: 10,
                    margin: [0, 10, 0, 5],
                },

                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    align: 'center',
                    margin: [10, 0, 10, 10],
                },
                title: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                },
                memo: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 20, 0, 0],
                },
                title2: {
                    bold: true,
                    fontSize: 10,
                    color: 'black',
                    alignment: 'center',
                },
                titleTable1: {
                    bold: true,
                    fontSize: 8,
                    color: 'black',
                    alignment: 'center',
                },
                titleTable2: {
                    fontSize: 10,
                    color: 'white',
                    alignment: 'center',
                },
                marginRector: {
                    fontSize: 10,
                    margin: [0, 5, 10, 0],
                },
                fontPeque: {
                    fontSize: 8,
                    alignment: 'center',
                },
                fontPeque2: {
                    fontSize: 10,
                },
                fontSegundapag: {
                    fontSize: 9,
                },
                fontSegundapagPeque: {
                    fontSize: 9,
                },
            },

            defaultStyle: {
                // alignment: 'justify'
            },
        };
        pdfMake.createPdf(minutaModificacionMacro).download('test');
    }

    // private downloadPDFInforme() {
        
    //     this.validateValuesPDFInforme();
    //     let day = this.datepipe.transform(this.date, 'dd');
    //     let month = this.datepipe.transform(this.date, 'MM');
    //     let year = this.datepipe.transform(this.date, 'YYYY');

    //     let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
       
    //     let plazo = this._shareService.calcularDiferencia(this.executionReportData.contractInitialDate, this.executionReportData.contractFinalDate)
    //     this.specificObligation = this.executionReportData.specificObligations.split('->');
    //     for (let index = 0; index < this.specificObligation.length; index++) {
    //         this.listaData[index] = [
    //             {
    //                 text: this.specificObligation[index],
    //             },
    //             {
    //                 text: '',
    //                 alignment: 'center',
    //             },
    //             {
    //                 text: 'Correos electrónicos',
    //                 alignment: 'center',
    //             }
    //         ]
    //     }
    //     const documentDefinition = {
    //         content: [
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*', '*'],
    //                     body: [
    //                         [
    //                             {
    //                                 colSpan: 2,
    //                                 text: 'INFORME DE EJECUCIÓN MENSUAL OFICINA UNIDAD ESTRATEGICA DE NEGOCIOS ITM',
    //                                 style: 'tableHeader',
    //                                 alignment: 'center',
    //                             },
    //                             {
    //                                 text: '',
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'NOMBRE DEL CONTRATISTA',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: this.executionReportData.contractorName,
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'NÚMERO DEL CONTRATO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: this.executionReportData.contractNumber,
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'FECHA DE INICIO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: this.valueInitialDate,
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'PLAZO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: plazo,
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'OBJETO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: ['Prestación de servicios como contratista',
    //                                     'independiente, sin vínculo laboral por su propia cuenta',
    //                                     'y riesgo para realizar la gestión de Apoyo asistencial',
    //                                     'de logística y procesos administrativos en ejecución',
    //                                     'del Contrato Interadministrativo No. 4600094924 de',
    //                                     '2022, celebrado entre el Distrito Especial de Ciencia',
    //                                     'Tecnología e Innovación de Medellín y el',
    //                                     'Departamento Administrativo de Planeación']
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'VALOR DEL CONTRATO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: this.executionReportData.totalValue,
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'SUPERVISOR ITM',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: this.executionReportData.supervisorContract,
    //                             }
    //                         ],
    //                     ],
    //                 },
    //             },
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*', '*', '*'],
    //                     body: [
    //                         [
    //                             {
    //                                 text: 'OBLIGACIONES ESPECIFICAS SEGÚN CONTRATO',
    //                                 alignment: 'center',
    //                                 style: 'tableHeader',

    //                             },
    //                             {
    //                                 text: 'EJECUCION O DESARROLLO DE LAS OBLIGACIONES ESPECIFICAS SEGÚN CONTRATO',
    //                                 alignment: 'center',
    //                                 style: 'tableHeader',
    //                             },
    //                             {
    //                                 text: 'EVIDENCIAS DE LAS OBLIGACIONES CENTRALES DEL CONTRATO',
    //                                 alignment: 'center',
    //                                 style: 'tableHeader',
    //                             },
    //                         ],
    //                     ].concat(this.listaData),
    //                 },
    //             },
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*'],
    //                     body: [
    //                         [
    //                             {
    //                                 rowSpan: 12,
    //                                 text: 'OBSERVACIONES (En caso de tenerlas)',
    //                                 alignment: 'center',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                     ],
    //                 },
    //             },
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*'],
    //                     body: [
    //                         [
    //                             {
    //                                 rowSpan: 12,
    //                                 text: 'DIFICULTADES (En caso de tenerlas)',
    //                                 alignment: 'center',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                     ],
    //                 },
    //             },
    //             { text: '\n\n PERIODO EJECUTADO: \t\t\t' + 'del ' + this.executionReportData.periodExecutedInitialDate + ' al ' + this.executionReportData.periodExecutedFinalDate },
    //             { text: '\n\n VALOR DEL PERIODO A COBRAR: \t\t\t' + this.executionReportData.totalValue },
    //             { text: '\n\n Para constancia se firma en Medellín a los  ' + day + ' días del mes  ' + month + ' del año  ' + year + ' \n\n' },
    //             { text: '\n\n' }, { canvas: [{ type: 'line', x1: 0, y1: 1, x2: 350 - 2 * 40, y2: 1, lineWidth: 1, margin: [5, 0] }] }, { canvas: [{ type: 'line', x1: 0, y1: 1, x2: 350 - 2 * 40, y2: 1, lineWidth: 1, margin: [15, 15, 5, 5] }] },
    //             { text: this.executionReportData.contractorName + '\n' },
    //             { text: 'C.C :' + this.executionReportData.contractorIdentification + ' \t' + '\n' },
    //             { text: 'Contratista ITM' }

    //         ],
    //         styles: {
    //             header: {
    //                 fontSize: 18,
    //                 bold: true,
    //                 margin: [0, 0, 0, 10],
    //             },
    //             subheader: {
    //                 fontSize: 16,
    //                 bold: true,
    //                 margin: [0, 10, 0, 5],
    //             },
    //             tableHeader: {
    //                 bold: true,
    //                 fontSize: 13,
    //                 color: 'black',
    //                 align: 'center',
    //                 margin: [0, 0, 10, 10],
    //             },
    //             tableExample: {
    //                 margin: [0, 5, 0, 15],
    //             },
    //             title: {
    //                 bold: true,
    //                 fontSize: 13,
    //                 color: 'black',
    //                 alignment: 'center',
    //                 margin: [0, 10, 0, 0],
    //             },
    //         },
    //         defaultStyle: {
    //             // alignment: 'justify'
    //         },
    //     };
    //     let test = pdfMake
    //         .createPdf(documentDefinition)
    //         .download(this.executionReportData.contractorName + 'REPORTEDEEJECUCION.pdf');
    //     console.log(test);
    //     this.onGeneratePdf.emit(false);
    // }

    // private validateValuesPDFInforme(){
    //     this.executionReportData.totalValue = Number(this.executionReportData.totalValue).toFixed(0);
    //     this.valueInitialDate = this.transformDate(this.executionReportData.contractInitialDate.toString());
    //     this.executionReportData.periodExecutedInitialDate = this.transformDate(this.executionReportData.periodExecutedInitialDate);
    //     this.executionReportData.periodExecutedFinalDate = this.transformDate(this.executionReportData.periodExecutedFinalDate);
    //     this.executionReportData.totalValue = (+this.executionReportData.totalValue).toLocaleString();

    // }
    getCurrentDate(): string {
        const datePipe = new DatePipe('en-US');
        const currentDate = new Date();
        return datePipe.transform(currentDate, 'yyyy-MM-dd');
    }
}
