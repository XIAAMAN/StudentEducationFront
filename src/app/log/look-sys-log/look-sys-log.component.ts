import { Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-look-sys-log',
  templateUrl: './look-sys-log.component.html',
  styleUrls: ['./look-sys-log.component.css']
})
export class LookSysLogComponent implements OnInit{

  private loading:boolean=true;
  private totalSize: number;
  private currentPageIndex: number=1;
  private pageSize: number = 10;
  private sysData: any[];
  constructor( private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  ngOnInit() {
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
    url = 'apidata/log/get?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  deleteLog(data: any) {
    console.log("delete data : ", data)
  }

  modify(data: any) {
    console.log("modify data : ", data)
  }
}
