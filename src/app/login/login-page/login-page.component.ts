import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
    // 如果已经登录，则直接返回到主页面
    const user = window.sessionStorage.getItem('userName');
    if (user) {
      this.route.navigateByUrl('/home');
    }
  }

}
