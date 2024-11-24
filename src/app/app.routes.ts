import { Routes } from '@angular/router';

import { AffectionMessageComponent } from './components/affection-message/affection-message.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'para-minha-pessoa-predileta/:id', component: AffectionMessageComponent },
  { path: 'registrar-informacoes-pessoa', component: UpdateUserComponent, canActivate: [AuthGuard] },
  { path: 'entrar', component: LoginComponent },
  { path: 'registrar', component: RegisterComponent },
];
