import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';

@Component({
  selector: 'app-correct',
  templateUrl: './correct.component.html',
  styleUrls: ['./correct.component.css']
})
export class CorrectComponent implements OnInit {

  loading:boolean = true;
  totalSize: number;
  currentPageIndex: number=1;
  pageSize: number = 10;
  sysData: any[];
  classValue: string = "";
  courseValue: string = "";
  collectionValue: string = "";
  classListOfOption: string[] = [];
  courseListOfOption: string[] = [];
  collectionListOfOption: string[] = [];
  constructor( private http: HttpClient, private constUrl: ConstUrlService) { }

  ngOnInit() {
    // console.log("array judge : ", this.permisAll.indexOf("experiment12"));
    // this.loadData();
    this.loadClass();
    this.loadCollection();
    this.loadCourse();
    // this.loading = false;
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
    url = this.constUrl.CORRECTEXERCISEURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize +"&classNumber="+this.classValue +"&courseName=" + this.courseValue +"&collectionName=" + this.collectionValue;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
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

  loadCourse() {
    this.http.get(this.constUrl.TEACHERGETCOURSEURL,this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        for(let tt of data) {
          this.courseListOfOption.push(""+tt);
          this.courseValue = this.courseListOfOption[0];
        }
        setTimeout(()=>{
          this.loadData();
        },2000)
      })
  }

  loadCollection() {
    this.http.get(this.constUrl.TEACHERGETCOLLECTIONURL,this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        for(let tt of data) {
          this.collectionListOfOption.push(""+tt);
          this.collectionValue = this.collectionListOfOption[0];
        }
      })
  }


  //课程值变化回调函数
  courseChange($event: any[]) {
    this.loadData();
  }

  classChange($event: any[]) {
    this.loadData();
  }

  collectionChange($event: any[]) {
    this.loadData();
  }

}
