import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './features/register/register.component';
import { IngresosComponent } from './features/ingresos/ingresos.component';
import { GastosComponent } from './features/gastos/gastos.component';
import { PlanificarEventoComponent } from './features/planificar-evento/planificar-evento.component';
import { PerfilComponent } from './features/perfil/perfil.component';
import { AyudaComponent } from './features/ayuda/ayuda.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { path: 'ingresos', component: IngresosComponent, canActivate: [authGuard] },
  { path: 'gastos', component: GastosComponent, canActivate: [authGuard] },
  { path: 'planificar-evento', component: PlanificarEventoComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'ayuda', component: AyudaComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];