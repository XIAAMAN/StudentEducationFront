import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../utils/notification.service';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {ConstUrlService} from '../../const/const-url.service';
import {isCheckDisabled} from 'ng-zorro-antd/core/tree/nz-tree-base-util';
import {disableDebugTools} from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   userName;

  constructor(
    private route: Router,
    private http: HttpClient,
    private notify:NotificationService,
    private fb: FormBuilder,
    private constUrl: ConstUrlService,
  ) { }

  ngOnInit() {
    this.userName  = window.sessionStorage.getItem('userName');
    //修改个人资料验证框
    this.validateUserInfoForm = this.fb.group({
      userName:  ['', [Validators.required]],
      userRealName: ['', [Validators.required]],
      userNumber:  ['', [Validators.required]],
      userPhone:  ['', [this.userPhoneValidator]],
      userEmail: ['', [Validators.email]],
    });
    //修改密码验证框
    this.validatePwdForm = this.fb.group({
      oldPassword:  ['',[Validators.required]],
      newPassword: ['',[Validators.required]],
      confirmPassword:  ['', [this.confirmValidator]],
    });
  }

  //加载用户信息
  loadUserInfo() {
    let url: string;
    url = this.constUrl.GETUSERINFOURL + '?userName=' + this.userName;
    this.http.get(url, this.constUrl.httpOptions).subscribe((data:any) => {
      this.infoModalData = data;
    })
  }


  //************************************************************************************//
  //修改个人资料模态框
   modifyInfoModalVisible: boolean = false;
  validateUserInfoForm: FormGroup;
   infoModalData:any = {};
   emailSuffixOptions: string[] = [];


  // 邮箱后缀自动完成
  onChangeEmailSuffix(value: string): void {
    if (!value || value.indexOf('@') >= 0) {
      this.emailSuffixOptions = [];
    } else {
      this.emailSuffixOptions = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
  }

  //弹出修改个人资料框
  modifyInfo() {
    this.modifyInfoModalVisible = true;
    this.loadUserInfo();
  }

  //模态框取消
  modifyInfoCancel() {
    this.modifyInfoModalVisible = false;
    this.loadUserInfo();
  }

  //提交修改个人资料
  handleModifyInfoOk() {
    if(this.validateUserInfoForm.valid) {
        let url: string;
        this.http.post(this.constUrl.MODIFYUSERINFOURL, this.infoModalData, this.constUrl.httpOptions).subscribe( data =>{
          if(data===200) {
            this.notify.showSuccess("个人资料修改成功");
            this.loadUserInfo();
          }
        });
        this.modifyInfoModalVisible = false;
    }
  }

  // 当鼠标悬浮在注销按钮上，则交换图片
  jiaohuan() {
    document.getElementById('log_out').setAttribute
    ('src', 'assets/images/log_out_red.png');
  }

  // 当鼠标离开注销按钮，则还原图片
   huanyuan() {
     document.getElementById('log_out').setAttribute
     ('src', 'assets/images/log_out_black.png');
  }
  // 注销登录后，需要清除会话数据
  logOut() {
    // 退出登录，前后台都需要清除session
    window.sessionStorage.clear();
    this.http.get('apidata/sys_user/logOut').subscribe();
  }

  //************************************************************************************//
  //修改资料模态框
  modifyPwdModalVisible: boolean = false;
  validatePwdForm: FormGroup;
  PwdModalData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  //弹出修改密码框
  modifyPwd() {
    this.modifyPwdModalVisible = true;
  }

  //模态框取消
  modifyPwdCancel() {
    this.modifyPwdModalVisible = false;
    this.validatePwdForm.reset();
  }

  //提交修改密码
  handleModifyPwdOk() {
    if(this.validatePwdForm.valid) {
      let url: string;
      url = this.constUrl.MODIFYPWDURL + "?oldPassword=" +this.PwdModalData.oldPassword +"&newPassword=" +this.PwdModalData.newPassword;
      this.http.get(url, this.constUrl.httpOptions).subscribe( data =>{
        if(data===400) {
          this.notify.showError("原密码输入错误！请重新输入！");
        }else if(data===200) {
          this.notify.showSuccess("密码修改成功");
          this.modifyPwdModalVisible = false;
        }
      });
      this.validatePwdForm.reset();
    }
  }


  // ***************************************************************************************//
  // 表单校验

  userPhoneValidator = (control: FormControl): { [s: string]: boolean } => {
    let userPhone: string = control.value;
    let re = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
    // let re = new RegExp("(13[0-9])|(17[0-1,6-8])|(15[^4,\\\\D])|(18[0-9])\\d{8}");

    // ^1 以1开头，\d表示数字，\d{10}表示数字出现10次，加上前面以1开头，正好是11个数字，X$表示以X结尾，
    // 这里用$表示后面没有了，11个数字后已经是匹配字符串的结尾。

    if (!re.test(userPhone)) {
      return { required: true, error: true };
    }
    return { };
  };

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validatePwdForm.controls.newPassword.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  validateConfirmPassword(): void {
    setTimeout(() => this.validatePwdForm.controls.confirmPassword.updateValueAndValidity());
  }
}
