import {Component, OnInit} from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {filter} from 'rxjs/operators';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  uploading = false;
  fileList: UploadFile[] = [];

  constructor(private http: HttpClient, private msg: NzMessageService) {}

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    let isExcel = file.type;
    if (isExcel !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && isExcel !== 'application/vnd.ms-excel') {
      this.msg.error('只能上传Excel(.xls,.xlsx)文件');
      return;
    }
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    if(this.fileList.length > 1) {
      this.msg.info("只能上传一个文件")
      return;
    }
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts/', formData, {
      reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        () => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('upload successfully.');
        },
        () => {
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
  }

  ngOnInit(): void {
  }

}
