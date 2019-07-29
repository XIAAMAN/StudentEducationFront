import { Injectable } from '@angular/core';
import { ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

// 通知服务工具，当网络请求成功或者失败都可以调用消息通知框
export class NotificationService {

  constructor(private toastr: ToastrService) { }
  showSuccess(msg) {
    this.toastr.success(msg, "Success Tips", {
      timeOut: 3000,
      closeButton: true,
      easing: 'ease-in',
      progressBar: false,
      positionClass: 'toast-top-center',
    });
  }

  showWarning(msg) {
    this.toastr.warning(msg, "Warning", {
      timeOut: 3000,
      closeButton: false,
      easing: 'ease-in',
      progressBar: false,
      positionClass: 'toast-top-center'
    });
  }

  showInfo(msg) {
    this.toastr.info(msg, "Informational Notes", {
      timeOut: 3000,
      closeButton: false,
      easing: 'ease-in',
      progressBar: false,
      positionClass: 'toast-top-center'
    });
  }
  showError(msg) {
    this.toastr.error(msg, "Error", {
      timeOut: 3500,
      closeButton: false,
      easing: 'ease-in',
      progressBar: false,
      positionClass: 'toast-top-center'
    });
  }
}
