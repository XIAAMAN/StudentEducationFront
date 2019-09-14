import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-look-score',
  templateUrl: './look-score.component.html',
  styleUrls: ['./look-score.component.css']
})
export class LookScoreComponent implements OnInit {

  loading:boolean=false;
  totalSize: number;
  currentPageIndex: number=1;
  pageSize: number = 10;
  rankValue: number =+ window.sessionStorage.getItem("rankValue");
  sysData: any[];
  classValue: string = "";
  courseValue: string = "";
  courseName: string = null;
  userNumber: string = null;
  classListOfOption: string[] = [];
  courseListOfOption: string[] = [];
  constructor( private http: HttpClient, private constUrl: ConstUrlService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userNumber = params.get('userNumber');
      this.courseName = params.get('courseName');
    });
    this.judgeUrl();
  }

  judgeUrl() {
    if(this.userNumber==null && this.courseName==null) {
      if(this.rankValue == 6) {
        this.studentLook();
      } else if(this.rankValue>7){
        this.loadClass();
        this.loadCourse()
      }
    } else {
      this.loadStudentDetail();
    }
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

  loadStudentDetail() {
    let url: string;
    this.loading=true;
    url = this.constUrl.STUDENTDETAILSCOREURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize + "&courseName=" + this.courseName +"&userNumber=" + this.userNumber;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })

  }

  loadData() {
    if(this.userNumber==null && this.courseName==null) {
      if(this.rankValue == 6) {
        this.studentLook();
      } else if(this.rankValue>7){
        this.teacherLook();
      }
    } else {
      this.loadStudentDetail();
    }

  }

   loadClass() {
    this.http.get(this.constUrl.TEACHERGETCLASSURL,this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        for(let tt of data) {
          this.classListOfOption.push(""+tt);
          this.classValue = this.classListOfOption[0];
        }
      })
  }

  studentLook() {
    let url: string;
    this.loading=true;
    url = this.constUrl.STUDENTLOOKSCOREURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  teacherLook() {
    let url: string;
    this.loading=true;
    url = this.constUrl.TEACHERLOOKSCOREURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize +"&classNumber="+this.classValue +"&courseName=" + this.courseValue;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      if(data != "400") {
        this.sysData = JSON.parse(JSON.stringify(data.content));
        this.totalSize = <number> data.totalElements;
      }else {
        this.sysData = [];
        this.totalSize = 0;
      }

      this.loading=false;

    })
  }

  loadCourse() {
    this.http.get(this.constUrl.TEACHERGETCOURSEURL,this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        for(let tt of data) {
          this.courseListOfOption.push(""+tt);
          this.courseValue = this.courseListOfOption[0];
        }
        setTimeout(()=>{
          this.teacherLook();
        })
      })
  }

  //课程值变化回调函数
  courseChange($event: any[]) {
    this.teacherLook()
  }

  classChange($event: any[]) {
    this.teacherLook();
  }

  back() {
    history.back();
  }


}
