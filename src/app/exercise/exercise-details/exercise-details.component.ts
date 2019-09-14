import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.css']
})
export class ExerciseDetailsComponent implements OnInit {
  exerciseId: string = null;
  sysDetailsData: any = {};
  unionData = {
    exercise : {},
    collectionId : ""
  }
  cmOptions: any = { // codemirror组件的配置项
    lineNumbers: true, // 显示行号
    styleActiveLine: true, // 当前行背景高亮
    matchBrackets: true,
    lineWrapping: true, // 自动换行
    mode: { name: 'text/x-mysql' }, // 定义mode
    indentUnit: 4,         // 缩进单位为4
    theme: 'default', // 设置黑色主题

    extraKeys: {
      'Ctrl': 'autocomplete', // 提示快捷键
      Tab: function (cm) {
        const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
        cm.replaceSelection(spaces);
      }
    }, // 自动提示配置
  };
  sysCollectionData: any = [];
  loading: boolean = false;
  exerciseCode: string = "";
  exerciseLength: number;
  exerciseIndex: number=0;
  isSubmit: boolean = false;
  compilerResult: any;
  collectionId:string=null;
  testDisable:boolean = false;
  submitDisable:boolean = false;
  compileTestLoading:boolean = false;
  compileSubmitLoading:boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private constUrl: ConstUrlService
  ) { }

  // 加载表格数据
  loadData() {
    let url: string;
    this.loading = true;
    if(this.exerciseId!=null) {
      url = this.constUrl.DETAILEXERCISEURL + '?exerciseId='+this.exerciseId;
      this.http.get(url,this.constUrl.httpOptions).subscribe((data: any) => {
        this.sysDetailsData = data;
        this.sysDetailsData.exerciseCode = this.exerciseCode;
        this.loading = false;
      })
    } else {
      url = this.constUrl.GETCOLLECTIONEXERCISEURL + '?collectionId='+this.collectionId;
      this.http.get(url,this.constUrl.httpOptions).subscribe((data: any) => {
        this.sysCollectionData = data;
        if(this.sysCollectionData.length > 0) {
          this.sysDetailsData = this.sysCollectionData[this.exerciseIndex]
          this.exerciseLength = this.sysCollectionData.length;
        }

        console.log(this.sysCollectionData)
        this.loading = false;
      })
    }

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.exerciseId = params.get('exerciseId');
      this.collectionId = params.get('collectionId');
      if(this.exerciseId==="0000") {
        this.exerciseId = null;
      }
      if(this.collectionId === "0000") {
        this.collectionId = null;
      }
    });
    if(this.exerciseId!=null) {
      this.http.get(this.constUrl.GETEXERCISEPRACTICECOMPILEURL + "?exerciseId=" + this.exerciseId, this.constUrl.httpOptions)
        .subscribe((data:any)=> {
          console.log(data)
          console.log(typeof data)
          this.exerciseCode = "" + data;
          if(this.exerciseCode.length > 0) {
            document.getElementById("submitId").textContent = "已通过";
            this.submitDisable = true;
          }
        })
    }
    this.loadData();
  }



  backExercise() {
    this.isSubmit = false;
    this.exerciseIndex--;
    this.sysDetailsData = this.sysCollectionData[this.exerciseIndex]
  }

  nextExercise() {
    this.isSubmit = false;
    this.exerciseIndex++;
    this.sysDetailsData = this.sysCollectionData[this.exerciseIndex]
  }

  backCollections() {
    history.back();
  }

  //提交代码
  submitCode() {
    let url="";
    this.compileSubmitLoading = true;
    this.testDisable = true;
    this.isSubmit = true;
    this.compilerResult = "";
    if(this.exerciseId == null) {
      url = this.constUrl.SUBMITCOMPILEURL;
      this.unionData.collectionId = <string> this.collectionId;
      this.unionData.exercise = <any> this.sysDetailsData;
      this.http.post(url, this.unionData,this.constUrl.httpOptions)
        .subscribe((data:any)=> {
          this.compileSubmitLoading = false;
          this.testDisable = false;
          this.isSubmit = true;
          this.compilerResult = data.result;
          if(data.state === "600") {
            this.submitDisable = true;
          }
        })
    } else {
      url = this.constUrl.PRACTICECOMPILEURL;
      this.http.post(url, this.sysDetailsData,this.constUrl.httpOptions)
        .subscribe((data:any)=> {
          console.log(data)
          this.compileSubmitLoading = false;
          this.testDisable = false;
          if(data.state === "200") {
            document.getElementById("submitId").textContent = "已通过";
            this.submitDisable = true;
          }
          if(data.state === "600") {
            this.submitDisable = true;
          }
          this.isSubmit = true;
          this.compilerResult = data.result;
        })
    }


  }

  //在线测试
  onlineTest() {
    this.compileTestLoading = true;
    this.isSubmit = false;
    this.compilerResult = "";
    if(this.submitDisable) {
      this.http.post(this.constUrl.TESTCOMPILEURL, this.sysDetailsData,this.constUrl.httpOptions)
        .subscribe((data:any)=> {
          console.log(data)
          this.compileTestLoading = false;
          this.isSubmit = true;
          this.compilerResult = data.result;
        })
    } else {
      this.http.post(this.constUrl.TESTCOMPILEURL, this.sysDetailsData,this.constUrl.httpOptions)
        .subscribe((data:any)=> {
          console.log(data)
          this.compileTestLoading = false;
          this.isSubmit = true;
          this.submitDisable = false;
          this.compilerResult = data.result;
        })
    }

  }
}
