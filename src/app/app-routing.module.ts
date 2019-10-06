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
import {LookUserComponent} from './user/look-user/look-user.component';
import {CheckExerciseComponent} from './exercise/check-exercise/check-exercise.component';
import {ManageCollectionComponent} from './collection/manage-collection/manage-collection.component';
import {PracticeExerciseComponent} from './practice/practice-exercise/practice-exercise.component';
import {ExerciseDetailsComponent} from './exercise/exercise-details/exercise-details.component';
import {ManageCourseComponent} from './course/manage-course/manage-course.component';
import {ManagePermisComponent} from './user/manage-permis/manage-permis.component';
import {LookScoreComponent} from './course/look-score/look-score.component';
import {HomePageComponent} from './home-page/home-page.component';
import {ScoreDetailComponent} from './course/score-detail/score-detail.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'test', component: TestComponent},
  // 配置路由拦截，当访问home的时候，会被拦截到CanActivateGuard
  {path: 'home', component: HomeComponent, canActivate: [CanActivateGuard],
    children: [
      {path: 'homePage', component: HomePageComponent, canActivate: [CanActivateGuard]},
      {path: 'lookLog', component: LookSysLogComponent, canActivate: [CanActivateGuard]},
      {path: 'lookExercise', component: LookExerciseComponent, canActivate: [CanActivateGuard]},
      {path: 'lookUser', component: LookUserComponent, canActivate: [CanActivateGuard]},
      {path: 'checkExercise', component: CheckExerciseComponent, canActivate: [CanActivateGuard]},
      {path: 'manageCollection', component: ManageCollectionComponent, canActivate: [CanActivateGuard]},
      {path: 'manageCollection/:courseId', component: ManageCollectionComponent, canActivate: [CanActivateGuard]},
      // {path: 'scoreDetail/:collectionId', component: ScoreDetailComponent, canActivate: [CanActivateGuard]},
      {path: 'scoreDetail/:collectionId/:userNumber', component: ScoreDetailComponent, canActivate: [CanActivateGuard]},
      {path: 'practiceExercise', component: PracticeExerciseComponent, canActivate: [CanActivateGuard]},
      {path: 'lookScore', component: LookScoreComponent, canActivate: [CanActivateGuard]},
      // {path: 'lookScore/:userNumber/:courseName', component: LookScoreComponent, canActivate: [CanActivateGuard]},
      {path: 'practiceExercise/:exerciseId/:collectionId', component: ExerciseDetailsComponent, canActivate: [CanActivateGuard]},
      {path: 'manageCourse', component: ManageCourseComponent, canActivate: [CanActivateGuard]},
      {path: 'managePermis', component: ManagePermisComponent, canActivate: [CanActivateGuard]},
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
