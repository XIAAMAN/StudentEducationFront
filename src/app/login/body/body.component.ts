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
    // if (value.userName.length > 2 && value.password.length >= 6 ) {
    //   console.log(value);
    // } else {
    //   alert('请输入正确的账号');
    // }
    this.loginService.init(this.user);
    // console.log(this.message);
    // console.log(this.loginService.state);
  }
  constructor(public loginService: LoginRequestService) { }

  ngOnInit() {
  }

}
