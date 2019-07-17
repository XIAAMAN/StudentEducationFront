import { Injectable } from '@angular/core';
import { ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }
  showSuccess(msg) {
    this.toastr.success(msg, null, {
      timeOut: 2000,
      closeButton: true,
      easing: 'ease-in',
      progressBar: false,
      positionClass: 'toast-top-center',
    });
  }

  showWarning(msg) {
    this.toastr.warning(msg, null, {
      timeOut: 2000,
      closeButton: false,
      easing: 'ease-in',
      progressBar: false,
      positionClass: 'toast-top-center'
    });
  }

  showInfo(msg) {
    this.toastr.info(msg, null, {
      timeOut: 2000,
      closeButton: false,
      easing: 'ease-in',
      progressBar: false,
      positionClass: 'toast-top-center'
    });
  }
  showError(msg) {
    this.toastr.error(msg, null, {
      timeOut: 2000,
      closeButton: false,
      easing: 'ease-in',
      progressBar: false,
      positionClass: 'toast-top-center'
    });
  }
}
