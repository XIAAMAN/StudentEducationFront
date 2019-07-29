import {Component, OnInit} from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private msg: NzMessageService){}
  ngOnInit() {

  }

  beforeUpload = (file: File) => {
    console.log("file.type ",file.type)
    console.log("file.name ",file.name)
    return new Observable((observer: Observer<boolean>) => {
      const isZip = file.type === 'application/x-zip-compressed';
      if (!isZip) {
        this.msg.error('只能够上传zip压缩包!');
        observer.complete();
        return;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.msg.error('文件大小不能超过10M');
        observer.complete();
        return;
      }

      observer.next(isZip && isLt10M);
      observer.complete();
    });
  };


  handleChange({ file, fileList }: { [key: string]: any }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} 文件上传成功.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} 文件上传失败.`);
    }
  }
}
