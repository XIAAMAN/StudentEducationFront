import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NotificationService} from '../../utils/notification.service';

@Component({
  selector: 'app-manage-permis',
  templateUrl: './manage-permis.component.html',
  styleUrls: ['./manage-permis.component.css']
})
export class ManagePermisComponent implements OnInit {

  private loading:boolean=true;
  private totalSize: number;
  private currentPageIndex: number=1;
  private pageSize: number = 10;
  private sysData: any[];
  private permisAll :string[] = JSON.parse(window.sessionStorage.getItem("permisAll"));
  private modifyUserPermis: string = "sys_users:permis:modify";     //增加用户权限
  private judgePermis:boolean = false;
  constructor( private http: HttpClient, private notify: NotificationService,
               private fb:FormBuilder, private constUrl: ConstUrlService) { }

  ngOnInit() {
    this.loadData();
    if(this.permisAll.indexOf(this.modifyUserPermis)>=0) {
      this.judgePermis = true;
    }
    this.http.get(this.constUrl.GETPERMISURL, this.constUrl.httpOptions).subscribe((data:any)=>{
      this.permisOptionList = data;
    });
    this.modifyPermisForm = this.fb.group({
      modifyPermis: ['']
    });
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
    url = this.constUrl.GETROLELISTURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  // **************************************************************************************************************************************
  //修改权限
  permisOptionList:any[] = [];
  permisValueList:string[] = [];
  modifyPermisForm : FormGroup;
  modifyVisible: boolean = false;
  roleId: string = "";

  openModifyModal(roleId:string) {
    this.modifyVisible = true;
    this.roleId = roleId;
    this.http.get(this.constUrl.GETROLEPERMISURL + "?roleId=" + roleId, this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        this.permisValueList = [];
        console.log(data)
        for(let tt of data) {
          this.permisValueList.push(tt);
        }
      })
  }


  onChange($event: string[]): void {
    console.log($event)
  }

  cancelModifyExercise() {
    this.modifyVisible = false;
  }

  submitModifyExercise() {
    this.modifyVisible = false;
    this.http.get(this.constUrl.MODIFYPERMISURL + "?roleId=" + this.roleId +"&permisList=" + this.permisValueList, this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        this.notify.showSuccess("角色权限修改成功");
      })

  }
}
