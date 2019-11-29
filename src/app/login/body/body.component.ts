import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
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
            this.router.navigateByUrl('/home/manageCourse');
            this.notify.showSuccess(this.user.userName + '  登录成功');
          } else if(res.state === 600){
            this.user.userName = "";
            this.user.password = "";
            this.notify.showWarning("该浏览器已有账号登录,请关闭浏览器重新登录");
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

      // window.onunload = function(event){
      //   if(window.innerWidth>document.body.clientWidth&&window.innerHeight<0)
      //   {
      //     // alert("点关闭按钮");
      //     window.sessionStorage.clear();
      //     // window.event.returnValue="确定要退出本页吗?";
      //   }
      //   //用户点击任务栏，右键关闭。s或是按alt+F4关闭
      //   else if(window.innerHeight> document.body.clientHeight )
      //   {
      //     // alert("任务栏右击关闭");
      //     window.sessionStorage.clear();
      //     // window.event.returnValue="确定要退出本页吗?";
      //   }
      //
      // }

      // 关闭浏览器，清除localStorage
      // window.onbeforeunload = function() {
      //   window.
      //     window.sessionStorage.clear();
      //
      //
      // }
    });

  }


}
