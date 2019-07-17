import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

  constructor(private router: Router) { }

  // 路由拦截器，判断是否已经登录，如果没有登录则返回到登录页面
  canActivate(): boolean {
    let isLogin: boolean;
    const user = window.sessionStorage.getItem('userName');
    if (!user) {          // 判断用户是否存在
      isLogin = false;
      this.router.navigateByUrl('/login');
    } else {
      isLogin = true;
    }
    // 返回true则会继续原来的操作
    return isLogin;
  }
}
