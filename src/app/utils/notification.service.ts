import { Injectable } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})

// 通知服务工具，当网络请求成功或者失败都可以调用消息通知框
export class NotificationService {

  constructor(private msg: NzMessageService) { }
  showSuccess(msg) {
    this.msg.success(msg,{nzDuration: 2500});
  }

  showWarning(msg) {
    this.msg.warning(msg,{nzDuration: 2500});
  }

  showInfo(msg) {
   this.msg.info(msg,{nzDuration: 2500});
  }
  showError(msg) {
   this.msg.error(msg,{nzDuration: 2500});
  }
}
