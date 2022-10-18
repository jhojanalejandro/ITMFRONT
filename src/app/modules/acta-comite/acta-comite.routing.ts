import { Routes, RouterModule } from '@angular/router';
import { ActaComiteComponent } from './acta-comite.component';

export const routesComite: Routes = [
  {
    path     : '',
    component: ActaComiteComponent
}
];

export const ActaComiteRoutes = RouterModule.forChild(routesComite);
