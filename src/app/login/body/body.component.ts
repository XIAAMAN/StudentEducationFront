import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationService} from '../../utils/notification.service';
import {ConstUrlService} from '../../const/const-url.service';

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

  // 处理登录请求
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.http.post(this.constUrl.LOGINURL,
        {
          userName: this.user.userName,
          userPassword: this.user.password}, this.constUrl.httpOptions)
        .subscribe((res:any)=> {
          if ( res.state === 200) {
            //将返回的数据存储到PermisUnion中
            // console.log("parentPermisList : ", JSON.stringify(res.parentPermisList));
            // console.log("permisAll : ", res.permisValueList);
            window.sessionStorage.setItem("parentPermisList", JSON.stringify(res.parentPermisList));
            window.sessionStorage.setItem('userName', this.user.userName);
            window.sessionStorage.setItem("permisAll", res.permisValueList);
            window.sessionStorage.setItem("rankValue", res.rankValue);
            this.router.navigateByUrl('/home');
            this.notify.showSuccess(this.user.userName + '  登录成功');
          } else if(res.state === 600){
            this.user.userName = "";
            this.user.password = "";
            this.notify.showWarning("该浏览器已有账号登录");
          } else {
            this.user.userName = "";
            this.user.password = "";
            this.notify.showWarning("用户名或密码错误");
          }
        });
    } else {
      this.user.userName = "";
      this.user.password = "";
    }
  }
  constructor(private notify:NotificationService,private constUrl:ConstUrlService, private router:Router, private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    window.onload = function() {
      let divHeight = $("#bodyHeight").height();
      let imgHeight = $("#bodyImageHeight").height();
      let loginHeight = $("#bodyLoginHeight").height();
      document.getElementById("bodyImageHeight").style.paddingTop = (divHeight - imgHeight)/2 +"px";
      document.getElementById("bodyLoginHeight").style.paddingTop = (divHeight - loginHeight)/2 - 20 +"px";
    }
    $(function() {

      window.onresize = function() {
        if(!window.sessionStorage.getItem("userName")) {
          let divHeight = $("#bodyHeight").height();
          let imgHeight = $("#bodyImageHeight").height();
          let loginHeight = $("#bodyLoginHeight").height();
          document.getElementById("bodyImageHeight").style.paddingTop = (divHeight - imgHeight)/2 +"px";
          document.getElementById("bodyLoginHeight").style.paddingTop = (divHeight - loginHeight)/2 - 20 +"px";
        }
      }
    });

  }


}
