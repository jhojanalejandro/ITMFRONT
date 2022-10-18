/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Opciones',
        subtitle: 'Opciones de contratacion',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.inicio',
                title: 'Cargar datos',
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
            },
            {
                id   : 'documentation.guides',
                title: 'Planeacion',
                type : 'basic',
                icon : 'heroicons_outline:book-open',
                link : '/docs/guides'
            }
        ]
    },
    {
        id      : 'apps',
        title   : 'Historial',
        subtitle: 'Lista contratacion General',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            // {
            //     id   : 'apps.academy',
            //     title: 'Academy',
            //     type : 'basic',
            //     icon : 'heroicons_outline:academic-cap',
            //     link : '/apps/academy'
            // },
            // {
            //     id   : 'apps.contacts',
            //     title: 'Contacts',
            //     type : 'basic',
            //     icon : 'heroicons_outline:user-group',
            //     link : '/apps/contacts'
            // },
    
            {
                id   : 'apps.file-manager',
                title: 'Contratación',
                type : 'basic',
                icon : 'heroicons_outline:cloud',
                link : '/apps/file-manager'
            },
            // {
            //     id   : 'apps.tasks',
            //     title: 'Tasks',
            //     type : 'basic',
            //     icon : 'heroicons_outline:check-circle',
            //     link : '/apps/tasks'
            // }
        ]
    },
    {
        id  : 'divider-1',
        type: 'divider'
    },
    // {
    //     id      : 'documentation',
    //     title   : 'Documentation',
    //     subtitle: 'Everything you need to know about Fuse',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:support',
    //     children: [
    //         {
    //             id   : 'documentation.guides',
    //             title: 'Guides',
    //             type : 'basic',
    //             icon : 'heroicons_outline:book-open',
    //             link : '/docs/guides'
    //         }
    //     ]
    // },
];

