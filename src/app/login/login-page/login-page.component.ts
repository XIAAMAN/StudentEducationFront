import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private route: Router, private http: HttpClient, private constUrl:ConstUrlService) { }

  ngOnInit() {

    // 如果已经登录，则直接返回到主页面
    const user = window.sessionStorage.getItem('userName');
    if (user) {
      this.route.navigateByUrl('/home');
    }
  }


}
