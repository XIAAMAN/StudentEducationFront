import {Component, ElementRef, OnInit, Renderer} from '@angular/core';
import {UploadFile} from 'ng-zorro-antd';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter} from 'rxjs/operators';
import {NotificationService} from '../utils/notification.service';
import {FormBuilder} from '@angular/forms';
import {ConstUrlService} from '../const/const-url.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent  implements OnInit {

  constructor(
    private http: HttpClient,
    private notify: NotificationService,
    private fb: FormBuilder,
    private constUrl: ConstUrlService
  ) { }

  // 上传学生Excel表模态框
  fileList: UploadFile[] = [];

  // 提交上传实验报告
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
    const req = new HttpRequest('POST', this.constUrl.FILESTUDENTEXCELURL, formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (data:any) => {
          let ss = data.body
          this.fileList = [];
          this.notify.showInfo("实验报告上传成功")
        },
        () => {
          this.notify.showError('文件上传失败');
        }
      );
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    let isExcel = file.type;
    console.log(isExcel)
    if (isExcel !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && isExcel !== 'application/msword') {
      this.notify.showError('只能上传word(.docx,.doc)文件');
      return;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.notify.showError('文件大小不能超过10M');
      return;
    }
    return false;
  };

  ngOnInit(): void {
  }
}
