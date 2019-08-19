import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';

@Component({
  selector: 'app-practice-exercise',
  templateUrl: './practice-exercise.component.html',
  styleUrls: ['./practice-exercise.component.css']
})
export class PracticeExerciseComponent implements OnInit {
  // 表格
   loading:boolean = true;
   pageSize: number = 10;
   totalSize: number;
   currentPageIndex: number=1;
   sysData: any[];


  constructor(private http: HttpClient, private constUrl: ConstUrlService) { }

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

  // 加载表格数据
   loadData() {
    let url: string;
    this.loading = true;
    url = this.constUrl.PRACTICEEXERCISEURL +  '?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url, this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading = false;
    })
  }

  ngOnInit() {
    this.loadData();
  }


}
