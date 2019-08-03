import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { HeaderComponent } from './login/header/header.component';
import { BodyComponent } from './login/body/body.component';
import { FooterComponent } from './login/footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { LoginInterceptorService} from './interceptor/login-interceptor.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './app-routing.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './main/home/home.component';
import { NavigationComponent } from './main/navigation/navigation.component';
import { LookSysLogComponent } from './log/look-sys-log/look-sys-log.component';
import { TestComponent } from './test/test.component';
import {NgZorroAntdModule, NZ_I18N, NZ_ICONS, zh_CN} from 'ng-zorro-antd';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzFormModule } from 'ng-zorro-antd/form';
import { IconDefinition } from '@ant-design/icons-angular';
import { LockOutline, UserOutline, PlusOutline, InboxOutline } from '@ant-design/icons-angular/icons';
import { NzResultModule } from 'ng-zorro-antd/result';
import { LookExerciseComponent } from './exercise/look-exercise/look-exercise.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { LookUserComponent } from './user/look-user/look-user.component';
const icons: IconDefinition[] = [ LockOutline, UserOutline, PlusOutline, InboxOutline ];
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomeComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    PageNotFoundComponent,
    NavigationComponent,
    LookSysLogComponent,
    TestComponent,
    LookExerciseComponent,
    LookUserComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    RouterTestingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgZorroAntdModule,
    NzTableModule,
    NzAutocompleteModule,
    NzFormModule,
    NzResultModule,
    NzPopconfirmModule,
    NzModalModule,
    NzInputModule,
    NzSelectModule,
    NzUploadModule


  ],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoginInterceptorService, multi: true },
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NZ_ICONS, useValue: icons }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
