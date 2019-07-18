import { Component, OnInit } from '@angular/core';
import {LoginRequestService} from '../login-request.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  message: string;
  user = {
    userName: '',
    password: ''
  };
  onSubmit(value: any): void {
    // 当登录输入框输入的数据符合格式要求时，再请求后台验证请求
    if (value.userName.length > 2 && value.password.length >= 6 ) {
      this.loginService.init(this.user);
    }
  }
  constructor(private loginService: LoginRequestService) { }

  ngOnInit() {
  }

}
