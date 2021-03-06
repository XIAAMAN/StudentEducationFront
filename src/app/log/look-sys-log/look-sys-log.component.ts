import { Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';

@Component({
  selector: 'app-look-sys-log',
  templateUrl: './look-sys-log.component.html',
  styleUrls: ['./look-sys-log.component.css']
})
export class LookSysLogComponent implements OnInit{

   loading:boolean=true;
   totalSize: number;
   currentPageIndex: number=1;
   pageSize: number = 10;
   sysData: any[];
  constructor( private http: HttpClient, private constUrl: ConstUrlService) { }

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
    url = this.constUrl.GETLOGURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

}
