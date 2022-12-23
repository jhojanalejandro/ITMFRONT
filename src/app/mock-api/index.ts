import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { FileManagerMockApi } from 'app/mock-api/apps/file-manager/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { TasksMockApi } from 'app/mock-api/apps/tasks/api';
import { UserMockApi } from 'app/mock-api/common/user/api';

export const mockApiServices = [
    AuthMockApi,
    FileManagerMockApi,
    NavigationMockApi,
    NotificationsMockApi,
    ShortcutsMockApi,
    TasksMockApi,
    UserMockApi
];
