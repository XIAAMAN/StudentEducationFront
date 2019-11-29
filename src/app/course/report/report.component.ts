import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';
import {UploadFile} from 'ng-zorro-antd';
import {filter} from 'rxjs/operators';
import {NotificationService} from '../../utils/notification.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  loading:boolean=true;
  totalSize: number;
  unionData = {
    exercise : {},
    collectionId : ""
  }
  currentPageIndex: number=1;
  pageSize: number = 10;
  fileList: UploadFile[] = [];
  currentExercise: any;
  sysData: any[];

  isVisible: boolean = false;
  constructor( private http: HttpClient, private constUrl: ConstUrlService,private notify: NotificationService) { }

  ngOnInit() {
    // console.log("array judge : ", this.permisAll.indexOf("experiment12"));
    this.loadData();
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

  loadData() {
    let url: string;
    this.loading=true;
    url = this.constUrl.GETREPORTURL;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = data;
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.handleUploadExcelOk();
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  uploadFile(data: any) {
    this.isVisible = true;
    this.currentExercise = data;
  }

  // 提交上传实验报告

  handleUploadExcelOk():void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    if(this.fileList.length != 1) {
      this.notify.showError("请上传一个文件，有且只能上传一个文件")
      return;
    }
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });

    // You can use any AJAX library you like
    const req = new HttpRequest('POST', this.constUrl.FILELABWORDURL, formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (data:any) => {

          // this.isSubmit = true;
          // this.compilerResult = data;

          let ss = data.body
          let url;
          this.fileList = [];
          url = this.constUrl.SUBMITCOMPILEURL;
          this.unionData.collectionId = this.currentExercise.exerciseWarning;
          this.currentExercise.exerciseCode = "实验报告文件已交";
          this.unionData.exercise = this.currentExercise;

          this.http.post(url, this.unionData,this.constUrl.httpOptions).subscribe((data:any)=>{
            this.notify.showInfo("实验报告上传成功")
          })

        },
        () => {
          this.notify.showError('文件上传失败');
        }
      );
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    let isExcel = file.type;
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
}
