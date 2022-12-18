import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { FileManagerMockApi } from 'app/mock-api/apps/file-manager/api';
import { FinanceMockApi } from 'app/mock-api/dashboards/finance/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { ProjectMockApi } from 'app/mock-api/dashboards/project/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { TasksMockApi } from 'app/mock-api/apps/tasks/api';
import { UserMockApi } from 'app/mock-api/common/user/api';

export const mockApiServices = [
    AuthMockApi,
    FileManagerMockApi,
    FinanceMockApi,
    NavigationMockApi,
    NotificationsMockApi,
    ProjectMockApi,
    ShortcutsMockApi,
    TasksMockApi,
    UserMockApi
];
