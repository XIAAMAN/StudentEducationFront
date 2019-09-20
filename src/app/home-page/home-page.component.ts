import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstUrlService} from '../const/const-url.service';
import {NotificationService} from '../utils/notification.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  radioValue = 'A';
  rankValue:number;
  relationData:any[] = [];
  sysData:any[] = [];
  isDisable:boolean = false;
  constructor(private http: HttpClient,
              private constUrl: ConstUrlService, private notify: NotificationService) { }

  ngOnInit() {
    this.rankValue =+ window.sessionStorage.getItem("rankValue");
    if(this.rankValue == 6) {
      this.loadData();
    }

  }
  loadData() {
    this.http.get(this.constUrl.GETSAMETEACHERUSERURL, this.constUrl.httpOptions)
      .subscribe((data:any) =>{
        this.sysData = data;
        this.http.get(this.constUrl.GETBLANKUSERURL + "?number=" + this.sysData.length, this.constUrl.httpOptions)
          .subscribe((data:any)=>{
            this.relationData = data;
            if((""+this.relationData[0].userRelationshipRank).length == 0) {
              for(let i=0; i<this.sysData.length; i++) {
                this.relationData[i].friendId = this.sysData[i].userId;
                this.relationData[i].userRelationshipRank = "没听说过";
              }
            }
            console.log(this.relationData)
          })

        console.log(this.sysData)
        // console.log(this.relationData)
    })

    this.http.get(this.constUrl.JUDGEDATEURL, this.constUrl.httpOptions)
      .subscribe((data:any)=>{
          if(data==200) {
            this.isDisable = false;
          } else {
            this.isDisable = true;
          }
      })
  }

  submit() {
    this.http.post(this.constUrl.SAVERELATIONSHIPURL, this.relationData, this.constUrl.httpOptions)
      .subscribe((data:any)=>{
          if(data==200) {
            this.notify.showSuccess("提交成功");
            this.isDisable = true;
          } else {
            this.notify.showError("提交失败");
          }
      })
  }
}
