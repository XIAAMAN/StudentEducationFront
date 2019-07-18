import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {of} from 'rxjs/internal/observable/of';
import {NotificationService} from '../utils/notification.service';

// 网络服务拦截器，当http请求出错时，会被拦截到这里
const CODEMESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

@Injectable({
  providedIn: 'root'
})
export class LoginInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private notify: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 业务处理：一些通用操作
    switch (event.status) {
      case 400:
        this.notify.showError(CODEMESSAGE['400']);
        return of(event) ;
        break ;
      case 401:
        this.notify.showError(CODEMESSAGE['401']);
        // this.router.navigate(['/']);
        return of(event) ;
        break ;
      case 403:
        this.notify.showError(CODEMESSAGE['403']);
        return of(event) ;
        break ;
      case 404:
        console.log(CODEMESSAGE['404']);
        // alert(404);
        this.notify.showError(CODEMESSAGE['404']);
        return of(event) ;
        break ;
      case 406:
        this.notify.showError(CODEMESSAGE['406']);
        return of(event) ;
        break ;
      case 410:
        this.notify.showError(CODEMESSAGE['410']);
        return of(event) ;
        break ;
      case 422:
        this.notify.showError(CODEMESSAGE['422']);
        return of(event) ;
        break ;
      case 500:
        this.notify.showError(CODEMESSAGE['500']);
        return of(event);
        break;
      case 502:
        this.notify.showError(CODEMESSAGE['502']);
        return of(event);
        break;
      case 503:
        this.notify.showError(CODEMESSAGE['503']);
        return of(event);
        break;
      case 504:
        this.notify.showError(CODEMESSAGE['504']);
        return of(event);
        break;
      default:
    }
    return throwError(event) ;
  }
}
