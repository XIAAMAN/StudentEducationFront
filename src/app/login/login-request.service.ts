import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NotificationService} from '../utils/notification.service';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginRequestService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private loginUrl: string;

  constructor(private http: HttpClient, private notify: NotificationService, private router: Router) { }
  post请求
  public init(user: { password: string; userName: string }): void {
    this.http.post('apidata/login',
      {
        userName: user.userName,
        userPassword: user.password}, this.httpOptions)
      .subscribe((res:any)=> {
        console.log("permisMenu : " , res.parentPermisList);
        if ( res.state === 200) {
          //将返回的数据存储到PermisUnion中
          window.sessionStorage.setItem("parentPermisList", JSON.stringify(res.parentPermisList));
          window.sessionStorage.setItem("permisAll", JSON.stringify(this.getPermisAll(res.parentPermisList)));
          window.sessionStorage.setItem('userName', user.userName);
          this.router.navigateByUrl('/home');
          this.notify.showSuccess(user.userName + '  登录成功');
        } else {

        }
      });
    // return this.state;
  }

  public getPermisAll(parentPermisList): any {
    let i:number;
    let j:number;
    let permisAll: string[] = new Array();
    for (i=0; i<parentPermisList.length; i++) {
      permisAll.push(parentPermisList[i].permisNameValue);
      for (j=0; j<parentPermisList[i].childrenPermisList.length; j++) {
        permisAll.push(parentPermisList[i].childrenPermisList[j].permisNameValue);
      }
    }
    return permisAll;

  }

  // public getParentPermisList(res) :any {
  // let  parentPermisList: [{
  //     permisId: null,
  //     permisParentId: null,
  //     permisName: null,
  //     permisNameValue: null,
  //     permisType: null,
  //     permisIcon: null,
  //     permisUrl: null,
  //     permisDescription: null,
  //     childrenPermisList: [{
  //       permisId: null,
  //       permisParentId: null,
  //       permisName: null,
  //       permisNameValue: null,
  //       permisType: null,
  //       permisIcon: null,
  //       permisUrl: null,
  //       permisDescription: null
  //     }]
  //   }];
  //
  //   parentPermisList = res;
  //   return parentPermisList;
  //
  // }
  // get请求
  // public init(user: { password: string; userName: string }): void {
  //   this.loginUrl = 'apidata/login?userName=' + user.userName + '&password=' + user.password;
  //   this.http.get(this.loginUrl).subscribe(res => {
  //     if ( res === 200) {
  //       window.sessionStorage.setItem('userName', user.userName);
  //       this.router.navigateByUrl('/home');
  //       this.notify.showSuccess(user.userName + '  登录成功');
  //     }
  //   });
  // }
}
