/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Oopciones',
        subtitle: 'Opciones de contratacion',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.project',
                title: 'Project',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-check',
                link : '/dashboards/project'
            },
            {
                id   : 'dashboards.finance',
                title: 'Finance',
                type : 'basic',
                icon : 'heroicons_outline:cash',
                link : '/dashboards/finance'
            }
        ]
    },
    {
        id      : 'apps',
        title   : 'Applications',
        subtitle: 'Custom made application designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.academy',
                title: 'Academy',
                type : 'basic',
                icon : 'heroicons_outline:academic-cap',
                link : '/apps/academy'
            },
            {
                id   : 'apps.contacts',
                title: 'Contacts',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/apps/contacts'
            },
    
            {
                id   : 'apps.file-manager',
                title: 'File Manager',
                type : 'basic',
                icon : 'heroicons_outline:cloud',
                link : '/apps/file-manager'
            },
            {
                id   : 'apps.tasks',
                title: 'Tasks',
                type : 'basic',
                icon : 'heroicons_outline:check-circle',
                link : '/apps/tasks'
            }
        ]
    },
    {
        id  : 'divider-1',
        type: 'divider'
    },
    {
        id      : 'documentation',
        title   : 'Documentation',
        subtitle: 'Everything you need to know about Fuse',
        type    : 'group',
        icon    : 'heroicons_outline:support',
        children: [
            {
                id   : 'documentation.guides',
                title: 'Guides',
                type : 'basic',
                icon : 'heroicons_outline:book-open',
                link : '/docs/guides'
            }
        ]
    },
];

