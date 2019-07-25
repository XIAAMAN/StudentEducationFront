import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-look-exercise',
  templateUrl: './look-exercise.component.html',
  styleUrls: ['./look-exercise.component.css']
})
export class LookExerciseComponent implements OnInit {
  private loading:boolean=true;
  private totalSize: number;
  private currentPageIndex: number=1;
  private pageSize: number = 10;
  private sysData: any[];

  //用户拥有的所有权限
  private permisAll :string[] = JSON.parse(window.sessionStorage.getItem("permisAll"));
  private  exercise_detail_permis: string = "exercises:management:detail";     //题目查看详情权限值
  private  exercise_modify_permis: string = "exercises:management:modify";     //修改题目权限值
  private  exercise_add_permis: string = "exercises:management:add";     //增加题目权限值
  private  exercise_delete_permis: string = "exercises:management:delete";     //删除题目权限值
  private judgePermis: boolean = false; //表示用户是否拥有查看详情、修改、删除题目之一的权限
  constructor(private http: HttpClient) { }

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
    url = 'apidata/sys_exercise/get?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  ngOnInit() {
    if(this.permisAll.indexOf(this.exercise_detail_permis)>=0 ||
      this.permisAll.indexOf(this.exercise_modify_permis) ||
      this.permisAll.indexOf(this.exercise_delete_permis)) {
      this.judgePermis = true;
    }
    this.loadData();
  }

}
