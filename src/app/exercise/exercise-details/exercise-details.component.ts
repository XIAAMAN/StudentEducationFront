import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.css']
})
export class ExerciseDetailsComponent implements OnInit {
  exerciseId: string = "";
  sysDetailsData: any = {};
  loading: boolean = false;
  exerciseCode: any;
  isSubmit: boolean = false;
  compilerResult: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private constUrl: ConstUrlService
  ) { }

  // 加载表格数据
  loadData() {
    let url: string;
    this.loading = true;
    url = this.constUrl.DETAILEXERCISEURL + '?exerciseId='+this.exerciseId;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data: any) => {
      this.sysDetailsData = data;
      console.log(this.sysDetailsData)
      this.loading = false;
    })
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.exerciseId = params.get('exerciseId');
    });
    this.loadData();
  }

  submitCode() {
    this.isSubmit = true;
    this.compilerResult = '运行结果显示';
  }
}
