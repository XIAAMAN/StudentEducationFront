import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {LoginPageComponent} from './login/login-page/login-page.component';
import {CanActivateGuard} from './interceptor/can-activate-guard';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './main/home/home.component';
import {PermisUnion} from './model/permis-union';

const appRoutes: Routes = [
  {path: 'login', component: LoginPageComponent},
  // 配置路由拦截，当访问home的时候，会被拦截到CanActivateGuard
  {path: 'home', component: HomeComponent, canActivate: [CanActivateGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: [CanActivateGuard, PermisUnion]   // 不要忘记这里，需要将服务提供出去
})
export class AppRoutingModule { }
