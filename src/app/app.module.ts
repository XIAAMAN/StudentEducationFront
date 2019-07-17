import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './login/header/header.component';
import { BodyComponent } from './login/body/body.component';
import { FooterComponent } from './login/footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatIconModule} from '@angular/material';
import { TestComponent } from './login/test/test.component';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { LoginInterceptorService} from './interceptor/login-interceptor.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './app-routing.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
// const INTERCEPTOR_PROVIDES = [
//   { provide: HTTP_INTERCEPTORS, useClass: LoginInterceptorService, multi: true }
// ];
// import {MatSidenavModule, MatToolbarModule, MatIconModule} from '@angular/materialic';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomeComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    TestComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    RouterTestingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
  ],
  exports: [MatButtonModule, MatCheckboxModule, RouterModule],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: LoginInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
