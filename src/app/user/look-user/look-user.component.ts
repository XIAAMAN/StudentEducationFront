import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import { NotificationService } from '../../utils/notification.service';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import {stringify} from 'querystring';
import {filter} from 'rxjs/operators';
import {UploadFile} from 'ng-zorro-antd';

@Component({
  selector: 'app-look-user',
  templateUrl: './look-user.component.html',
  styleUrls: ['./look-user.component.css']
})
export class LookUserComponent implements OnInit {

  // 表格
  private loading:boolean=true;
  private totalSize: number;
  private currentPageIndex: number=1;
  private pageSize: number = 10;
  private sysData: any[];
  private judgePermis: boolean = false;

  //表示用户是否拥有修改、删除用户之一的权限

  constructor(
    private http: HttpClient,
    private notify: NotificationService,
    private fb: FormBuilder,
  ) { }

  // 加载表格数据
  loadData() {
    let url: string;
    this.loading=true;
    url = 'apidata/sys_user/get?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
      this.judgePermis = true;
    })
  }

  ngOnInit() {
    //增加用户验证框
    this.validateForm = this.fb.group({
      userName:  ['',[Validators.required],[this.userNameAsyncValidator]],
      userRealName: ['',[Validators.required]],
      userNumber:  ['', [Validators.required],[this.userNumberAsyncValidator]],
      userPhone:  ['', [this.userPhoneValidator],[Validators.required]],
      userEmail: ['', [Validators.email]],
      rolesName: ['',[Validators.required]],
    });
    this.loadData();
    this.loadRoleList();
  }

  //当每页数据大小发生改变
  pageSizeChange($event: number) {
    this.pageSize = $event;
    this.loadData();
  }

  //当页码发生改变
  pageIndexChange($event: number) {
    this.currentPageIndex = $event;
    this.loadData();
  }

  //********************************************************************************//
  //重置密码
  resetPassword(userId: String): void{
    let url:string;
    url = 'apidata/sys_user/resetPassword?userId=' + userId;
    this.http.get(url).subscribe((data:any) => {
      if(data===200) {
        this.notify.showSuccess("重置密码成功");
        this.loadData();
      }
  })
  }

  //删除用户
  deleteUser(userId: String): void {
    let url:string;
    url = 'apidata/sys_user/delete?userId=' + userId;
    this.http.get(url).subscribe((data:any) => {
      if(data===200) {
        this.notify.showSuccess("已删除");
        this.loadData();
      }
    })
  }

  //*******************************************************************************//
  // 增加用户模态框
  private addModalVisible: boolean = false;
  validateForm: FormGroup;
  private addModalData = {
    userName: '',
    userRealName: '',
    userNumber: '',
    userPhone: '',
    userEmail: '',
    userRecommendName: '',
    userPassword: '',
  };
  private listOfSelectedRole = [];
  private emailSuffixOptions: string[] = [];
  private listOfRoles: string[];
  private  roleName = {};
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  //弹出增加用户模态框
  showAddUserModal(): void {
    this.addModalVisible = true;
  }

  // 邮箱后缀自动完成
  onChangeEmailSuffix(value: string): void {
    if (!value || value.indexOf('@') >= 0) {
      this.emailSuffixOptions = [];
    } else {
      this.emailSuffixOptions = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
  }

  //模态框取消
  addCancel() {
    this.addModalVisible = false;
    this.uploadModalVisible = false;
    this.validateForm.reset();
    // this.addModalData.userName = ""
    // this.loadData();
  }

  // 提交增加用户
  handleAddUserOk(): void {
    if(this.validateForm.valid) {
      let url: string;
      this.addModalData.userRecommendName = window.sessionStorage.getItem("userName");
      for(let tt of this.listOfSelectedRole) {
        this.addModalData.userPassword += tt +" ";
      }
      let length = this.addModalData.userPassword.length;
      this.addModalData.userPassword = this.addModalData.userPassword.substring(0, length-1);
      url = "apidata/sys_user/add";
      // this.roleName = this.addModalData.roleName;
      console.log(this.roleName)
      this.http.post(url, this.addModalData, this.httpOptions).subscribe( data =>{
        if(data===200) {
          this.notify.showSuccess("用户添加成功");
          this.loadData();
        }

      });
      this.addModalVisible = false;

    } else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }


  //*******************************************************************************//
  // 上传学生Excel表模态框
  private uploadModalVisible: boolean = false;
  fileList: UploadFile[] = [];

  //弹出上传模态框
  showUploadExcelModal() {
    this.uploadModalVisible = true;
  }

  addStudentCancel() {
    this.uploadModalVisible = false;
  }
  // 提交上传学生Excel表
  handleUploadExcelOk():void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    if(this.fileList.length > 1) {
      this.notify.showError("只能上传一个文件")
      return;
    }
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });

    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'apidata/file/studentExcel', formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (data:any) => {
          let ss = data.body
          console.log("data : ", data)
          console.log("data : ", ss)
          this.fileList = [];
          if(data.body === 300) {
            this.notify.showError("学号格式错误，长度必须为8");
          } else if(data.body === 400) {
            this.notify.showError("学号已经被注册成用户名");
          }else if(data.body === 500) {
            this.notify.showError("班级已存在");
          }else if(data.body === 600) {
            this.notify.showError("学生班级号不一致");
          }else {
            this.notify.showInfo("成功注册 "+data.body+"个学生账户")
          }

          this.uploadModalVisible = false;
        },
        () => {
          this.notify.showError('文件上传失败');
          this.uploadModalVisible = false;
        }
      );
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
     let isExcel = file.type;
      if (isExcel !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && isExcel !== 'application/vnd.ms-excel') {
        this.notify.showError('只能上传Excel(.xls,.xlsx)文件');
        return;
      }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.notify.showError('文件大小不能超过10M');
      return;
    }
      return false;
  };

  // 加载角色列表
  loadRoleList() {
    let url:string= "apidata/role/get";

    this.http.get(url).subscribe((data:any)=>{
      this.listOfRoles = JSON.parse(JSON.stringify(data));
    })
  }


  // ***************************************************************************************//
  // 表单校验
  // 账号名称 异步验证器
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        let url: string;
        let userName: string = control.value;
        url = 'apidata/sys_user/judgeUserName?userName=' + userName;

        this.http.get(url).subscribe((data:any) => {
          // 账号名称字符数校验
          if(userName.length < 2 || userName.length > 20) {
            observer.next({error: true,required: true})
          } else if(data === 400) {    // 账号名称重复校验
            observer.next({error: true,duplicated: true});
          } else {   //验证通过
            observer.next(null);
          }
          observer.complete();   //验证完成
        });

      },200);

    });

  // 学号或工号 异步验证器
  userNumberAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        let url: string;
        let userNumber: string = control.value;
        url = 'apidata/sys_user/judgeUserNumber?userNumber=' + userNumber;
        this.http.get(url).subscribe((data:any) => {
          // 学号或工号字符数校验
          if(userNumber.length < 5 || userNumber.length > 20) {
            observer.next({error: true,required: true})
          } else if(data === 400) {    // 学号或工号重复校验
            observer.next({error: true,duplicated: true});
          } else {   //验证通过
            observer.next(null);
          }
          observer.complete();   //验证完成
        });

      },200);

    });

  userPhoneValidator = (control: FormControl): { [s: string]: boolean } => {
    let userPhone: string = control.value;
    let re = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;

    // ^1 以1开头，\d表示数字，\d{10}表示数字出现10次，加上前面以1开头，正好是11个数字，X$表示以X结尾，
    // 这里用$表示后面没有了，11个数字后已经是匹配字符串的结尾。
    if (!re.test(userPhone)) {
      return { invalid: true, error: true };
    }
    return {};
  };
}



