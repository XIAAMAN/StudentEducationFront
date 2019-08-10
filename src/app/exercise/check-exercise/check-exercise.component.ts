import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../utils/notification.service';
import {ConstUrlService} from '../../const/const-url.service';

@Component({
  selector: 'app-check-exercise',
  templateUrl: './check-exercise.component.html',
  styleUrls: ['./check-exercise.component.css']
})
export class CheckExerciseComponent implements OnInit {

  private loading:boolean=true;
  private totalSize: number;
  private currentPageIndex: number=1;
  private pageSize: number = 10;
  private sysData: any[];
  //用户拥有的所有权限
  private permisAll :string[] = JSON.parse(window.sessionStorage.getItem("permisAll"));
  private exercisePassPermis: string = "exercises:check:pass";     //通过权限
  private exerciseRefusePermis: string = "exercises:check:refuse";     //拒绝权限
  private judgePermis:boolean = false;
  constructor( private http: HttpClient, private notify:NotificationService, private constUrl: ConstUrlService) { }

  ngOnInit() {
    this.loadData();
    // 判断用户是否有操作栏中任意一项的权限
    if(this.permisAll.indexOf(this.exercisePassPermis)>=0 ||
      this.permisAll.indexOf(this.exerciseRefusePermis)>=0) {
      this.judgePermis = true;
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

  loadData() {
    let url: string;
    this.loading=true;
    url = this.constUrl.GETCHECKEXERCISEURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  //通过审核
  pass(data:string) {
    this.http.get(this.constUrl.PASSEXERCISEURL + "?exerciseId="+data, this.constUrl.httpOptions).subscribe((data)=>{
      this.notify.showSuccess("操作成功");
      this.loadData();
    })
  }

  //拒绝通过
  refuse(data:string) {
    this.http.get(this.constUrl.REFUSEEXERCISEURL + "?exerciseId="+data, this.constUrl.httpOptions).subscribe((data)=>{
      this.notify.showSuccess("操作成功");
      this.loadData();
    })
  }
}
