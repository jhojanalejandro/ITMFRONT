/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'CONTRATACIÓN',
        subtitle: 'Opciones de contratacion',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.inicio',
                title: 'Modulo Contractual',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-check',
                link : '/dashboards/inicio'
            },
            {
                id   : 'dashboards.nomina',
                title: 'Nomina',
                type : 'basic',
                icon : 'heroicons_outline:cash',
                link : '/dashboards/nomina'
            }
        ]
    },
    {
        id      : 'apps',
        title   : 'PLANEACIÓN',
        subtitle: 'Lista contratacion General',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id      : 'docs.ecommerce',
                title   : 'Planeación',
                type    : 'collapsable',
                icon    : 'heroicons_outline:shopping-cart',
                children: [
                    {
                        id   : 'docs.ecommerce.cuadroEconomico',
                        title: 'Cuadro Economico',
                        type : 'basic',
                        link : '/docs/ecommerce/cuadroEconomico'
                    },
                    {
                        id   : 'docs.ecommerce.contratos',
                        title: 'Contratos Interadministrativos',
                        type : 'basic',
                        link : '/docs/ecommerce/contratos'
                    }

                ]
            },
            {
                id   : 'apps.file-manager',
                title: 'Contratación',
                type : 'basic',
                icon : 'heroicons_outline:cloud',
                link : '/apps/file-manager'
            },
        ]
    },
    {
        id  : 'divider-1',
        type: 'divider'
    },
];

