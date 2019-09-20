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
  exerciseType:number;
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
  programExercise: any = [];
  chooseExercise: any = [];
  judgeExercise: any = [];
  blankExercise: any = [];
  loading: boolean = false;
  exerciseCode: string = "";
  tempExerciseBlank: string[] = ["","","","","","","","","",""];
  exerciseBlankAnswer: string [] = [];
  exerciseBlank: string[] = [];
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
        if(this.exerciseCode.length>0 && this.exerciseType==4) {
          this.exerciseBlankAnswer = this.exerciseCode.split(";xiaaman;");
          for(let t=0; t<this.exerciseBlankAnswer.length; t++) {
            this.tempExerciseBlank[t] = this.exerciseBlankAnswer[t];
          }
        }
        this.loading = false;
      })
    } else {
      url = this.constUrl.GETCOLLECTIONEXERCISEURL + '?collectionId='+this.collectionId;
      this.http.get(url,this.constUrl.httpOptions).subscribe((data: any) => {
        this.sysCollectionData = data;

        if(this.sysCollectionData.length > 0) {
          for(let i=0; i<this.sysCollectionData.length; i++) {
            if(this.sysCollectionData[i].exerciseType == 1) {
              this.programExercise.push(this.sysCollectionData[i]);
            }else if(this.sysCollectionData[i].exerciseType == 2) {
              this.chooseExercise.push(this.sysCollectionData[i]);
            }else if(this.sysCollectionData[i].exerciseType == 3) {
              this.judgeExercise.push(this.sysCollectionData[i]);
            }else{
              this.blankExercise.push(this.sysCollectionData[i]);
            }
          }

          if(this.chooseExercise.length > 0) {
            this.sysDetailsData = this.chooseExercise[this.exerciseIndex];
            this.exerciseLength = this.chooseExercise.length;
            this.exerciseType = 2;
          }else if(this.judgeExercise.length > 0) {
            this.sysDetailsData = this.judgeExercise[this.exerciseIndex];
            this.exerciseLength = this.judgeExercise.length;
            this.exerciseType = 3;
          }else if(this.blankExercise.length > 0) {
            this.sysDetailsData = this.blankExercise[this.exerciseIndex];
            this.exerciseLength = this.blankExercise.length;
            this.exerciseType = 4;
            this.http.get(this.constUrl.GETBLANKNUMBERURL + "?exerciseId=" + this.sysDetailsData.exerciseId, this.constUrl.httpOptions)
              .subscribe((data:any)=>{
                this.exerciseBlank = [];
                for(let tt=0; tt<data; tt++) {
                  this.exerciseBlank[tt] = "";
                }
                console.log(this.exerciseBlank)
              })
          } else {
            this.sysDetailsData = this.programExercise[this.exerciseIndex];
            this.exerciseLength = this.programExercise.length;
            this.exerciseType = 1;
          }
        }
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
        this.http.get(this.constUrl.GETEXERCISETYPEURL + "?exerciseId=" + this.exerciseId,this.constUrl.httpOptions)
          .subscribe((data:any)=>{
            this.exerciseType = data;
            if(this.exerciseType == 4) {
              this.http.get(this.constUrl.GETBLANKNUMBERURL + "?exerciseId=" + this.exerciseId, this.constUrl.httpOptions)
                .subscribe((data:any)=>{
                  this.exerciseBlank = [];
                  // for(let mm=0; mm<this.tempExerciseBlank.length; mm++) {
                  //   this.tempExerciseBlank[mm] = "";
                  // }
                  for(let tt=0; tt<data; tt++) {
                    this.exerciseBlank[tt] = "";
                  }
                })
            }
          })
      }
    });
    if(this.exerciseId!=null) {
      this.http.get(this.constUrl.GETEXERCISEPRACTICECOMPILEURL + "?exerciseId=" + this.exerciseId, this.constUrl.httpOptions)
        .subscribe((data:any)=> {
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
    if(this.exerciseType == 1) {
      this.sysDetailsData = this.programExercise[this.exerciseIndex];
    } else if(this.exerciseType == 2) {
      this.sysDetailsData = this.chooseExercise[this.exerciseIndex];
    }else if(this.exerciseType == 3) {
      this.sysDetailsData = this.judgeExercise[this.exerciseIndex];
    } else {
      this.sysDetailsData = this.blankExercise[this.exerciseIndex];
      this.http.get(this.constUrl.GETBLANKNUMBERURL + "?exerciseId=" + this.sysDetailsData.exerciseId, this.constUrl.httpOptions)
        .subscribe((data:any)=>{
          this.exerciseBlank = [];
          for(let tt=0; tt<data; tt++) {
            this.exerciseBlank[tt] = "";
          }
          console.log(this.exerciseBlank)
        })
    }
  }

  nextExercise() {
    this.isSubmit = false;
    this.exerciseIndex++;
    if(this.exerciseType == 1) {
      this.sysDetailsData = this.programExercise[this.exerciseIndex];
    } else if(this.exerciseType == 2) {
      this.sysDetailsData = this.chooseExercise[this.exerciseIndex];
    }else if(this.exerciseType == 3) {
      this.sysDetailsData = this.judgeExercise[this.exerciseIndex];
    } else {
      this.sysDetailsData = this.blankExercise[this.exerciseIndex];
      this.http.get(this.constUrl.GETBLANKNUMBERURL + "?exerciseId=" + this.sysDetailsData.exerciseId, this.constUrl.httpOptions)
        .subscribe((data:any)=>{
          this.exerciseBlank = [];
          for(let tt=0; tt<data; tt++) {
            this.exerciseBlank[tt] = "";
          }
          console.log(this.exerciseBlank)
        })
    }
  }

  backCollections() {
    history.back();
  }

  //提交代码
  submitCode() {
    if(this.exerciseType == 4) {
      this.sysDetailsData.exerciseCode = "";
      for(let i=0; i<this.exerciseBlank.length; i++) {
        if(this.tempExerciseBlank[i].length == 0) {
          this.sysDetailsData.exerciseCode = "";
          break;
        }
        if(i==this.exerciseBlank.length-1) {
          this.sysDetailsData.exerciseCode += this.tempExerciseBlank[i];
        }else {
          this.sysDetailsData.exerciseCode += this.tempExerciseBlank[i] +";xiaaman;";
        }
        this.exerciseBlank[i] = this.tempExerciseBlank[i];
      }

    }
    if(this.sysDetailsData.exerciseCode.length > 0) {


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

    } else {
      alert("答案不能为空");
    }

  }

  //在线测试
  onlineTest() {
    if(this.sysDetailsData.exerciseCode.length > 0) {
      this.compileTestLoading = true;
      this.isSubmit = false;
      this.compilerResult = "";
      if(this.submitDisable) {
        this.http.post(this.constUrl.TESTCOMPILEURL, this.sysDetailsData,this.constUrl.httpOptions)
          .subscribe((data:any)=> {
            this.compileTestLoading = false;
            this.isSubmit = true;
            this.compilerResult = data.result;
          })
      } else {
        this.http.post(this.constUrl.TESTCOMPILEURL, this.sysDetailsData,this.constUrl.httpOptions)
          .subscribe((data:any)=> {
            this.compileTestLoading = false;
            this.isSubmit = true;
            this.submitDisable = false;
            this.compilerResult = data.result;
          })
      }

    }else {
      alert("答案不能为空");
    }

  }

  chooseChange() {
    if(this.exerciseType != 2) {
      this.isSubmit = false;
      this.exerciseType = 2;
      this.exerciseIndex = 0;
      this.exerciseLength = this.chooseExercise.length;
      this.sysDetailsData = this.chooseExercise[0];
    }
  }

  judgeChange() {
    if(this.exerciseType != 3) {
      this.isSubmit = false;
      this.exerciseType = 3;
      this.exerciseIndex = 0;
      this.exerciseLength = this.judgeExercise.length;
      this.sysDetailsData = this.judgeExercise[0]
    }
  }

  blankChange() {
    if(this.exerciseType != 4) {
      this.isSubmit = false;
      this.exerciseType = 4;
      this.exerciseIndex = 0;
      this.exerciseLength = this.blankExercise.length;
      this.sysDetailsData = this.blankExercise[0];
      this.http.get(this.constUrl.GETBLANKNUMBERURL + "?exerciseId=" + this.sysDetailsData.exerciseId, this.constUrl.httpOptions)
        .subscribe((data:any)=>{
          this.exerciseBlank = [];
          for(let tt=0; tt<data; tt++) {
            this.exerciseBlank[tt] = "";
          }
          console.log(this.exerciseBlank)
        })
    }
  }

  programChange() {
    if(this.exerciseType != 1) {
      this.isSubmit = false;
      this.exerciseType = 1;
      this.exerciseIndex = 0;
      this.exerciseLength = this.programExercise.length;
      this.sysDetailsData = this.programExercise[0];
    }
  }

}
