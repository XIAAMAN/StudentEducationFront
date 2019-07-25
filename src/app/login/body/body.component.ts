import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationService} from '../../utils/notification.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  user = {
    userName: '',
    password: ''
  };
  validateForm: FormGroup;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // 处理登录请求
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log("validateForm.valid : ", this.validateForm.valid)
    if (this.validateForm.valid) {
      this.http.post('apidata/login',
        {
          userName: this.user.userName,
          userPassword: this.user.password}, this.httpOptions)
        .subscribe((res:any)=> {
          if ( res.state === 200) {
            //将返回的数据存储到PermisUnion中
            // console.log("parentPermisList : ", JSON.stringify(res.parentPermisList));
            // console.log("permisAll : ", res.permisValueList);
            window.sessionStorage.setItem("parentPermisList", JSON.stringify(res.parentPermisList));
            window.sessionStorage.setItem('userName', this.user.userName);
            window.sessionStorage.setItem("permisAll", res.permisValueList);
            this.router.navigateByUrl('/home');
            this.notify.showSuccess(this.user.userName + '  登录成功');
          } else {
            this.user.userName = "";
            this.user.password = "";
            // this.notify.showWarning("用户名或密码错误");
          }
        });
    } else {
      this.user.userName = "";
      this.user.password = "";
    }
  }
  constructor(private notify:NotificationService, private router:Router, private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

}
