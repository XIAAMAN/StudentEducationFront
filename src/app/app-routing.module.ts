import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {LoginPageComponent} from './login/login-page/login-page.component';
import {CanActivateGuard} from './interceptor/can-activate-guard';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './main/home/home.component';
import {LookSysLogComponent} from './log/look-sys-log/look-sys-log.component';
import {TestComponent} from './test/test.component';
import {LookExerciseComponent} from './exercise/look-exercise/look-exercise.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'test', component: TestComponent},
  // 配置路由拦截，当访问home的时候，会被拦截到CanActivateGuard
  {path: 'home', component: HomeComponent, canActivate: [CanActivateGuard],
    children: [
      {path: 'lookLog', component: LookSysLogComponent, canActivate: [CanActivateGuard]},
      {path: 'lookExercise', component: LookExerciseComponent, canActivate: [CanActivateGuard]},
    ]
  },
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
  providers: [CanActivateGuard]   // 不要忘记这里，需要将服务提供出去
})
export class AppRoutingModule { }
