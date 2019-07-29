import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../utils/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private userName;
  constructor(private route: Router, private http: HttpClient, private notify:NotificationService) { }

  ngOnInit() {
    this.userName  = window.sessionStorage.getItem('userName');
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
}
