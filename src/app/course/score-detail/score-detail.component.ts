import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../utils/notification.service';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ConstUrlService} from '../../const/const-url.service';

@Component({
  selector: 'app-score-detail',
  templateUrl: './score-detail.component.html',
  styleUrls: ['./score-detail.component.css']
})
export class ScoreDetailComponent implements OnInit {
  collectionId:string;
  userNumber:string;

  constructor(private http: HttpClient, private notify: NotificationService,
              private fb:FormBuilder,  private route: ActivatedRoute,
              private constUrl: ConstUrlService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('collectionId');
      this.userNumber = params.get('userNumber');
      this.loadData();
    });
  }

  backCollections() {
    history.back();
  }

  loading:boolean=true;
  totalSize: number;
  currentPageIndex: number=1;
  pageSize: number = 10;
  sysData: any[];

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
    if(this.userNumber == "0000") {
      url = this.constUrl.STUDENTSCOREDETAILURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize+"&collectionId="+this.collectionId;
    } else {
      url = this.constUrl.TEACHERSCOREDETAILURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize+"&collectionId="+this.collectionId + "&userNumber=" + this.userNumber;
    }
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

}
