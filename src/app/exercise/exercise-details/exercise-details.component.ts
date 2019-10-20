import {Component, ElementRef, OnInit, Renderer} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import * as wangEditor from '../../../../node_modules/wangeditor/release/wangEditor.js';
import {UploadFile} from 'ng-zorro-antd';
import {filter} from 'rxjs/operators';
import {NotificationService} from '../../utils/notification.service';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.css']
})
export class ExerciseDetailsComponent implements OnInit {
  exerciseId: string = null;
  sysDetailsData: any = {};
  exerciseType:number;
  multiAbleOne:boolean = false;
  multiAbleTwo:boolean = false;
  multiAbleThree:boolean = false;
  multiAbleFour:boolean = false;
  //记录原来答案
  chooseExerciseCode:string[] = [];
  multiExerciseCode:string[] = [];
  blankExerciseCode:string[] = [];
  selfExerciseCode:string[] = [];
  judgeExerciseCode:string[] = [];
  programExerciseCode:string[] = [];
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
  multiChooseValue:string[] = [];
  programExercise: any = [];
  chooseExercise: any = [];
  multiChooseExercise: any = [];
  selfExercise: any = [];
  judgeExercise: any = [];
  blankExercise: any = [];
  // 各题目类型提交个数
  programDecided: number = 0;
  chooseDecided: number = 0;
  multiChooseDecided: number = 0;
  selfDecided: number = 0;
  judgeDecided: number = 0;
  blankDecided: number = 0;
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
    private constUrl: ConstUrlService,
    private notify: NotificationService,
    private el: ElementRef, private renderer: Renderer

  ) { }

  // 加载表格数据
  loadData() {
    let url: string;
    this.loading = true;
    if(this.exerciseId!=null) {
      url = this.constUrl.DETAILEXERCISEURL + '?exerciseId='+this.exerciseId;
      this.http.get(url,this.constUrl.httpOptions).subscribe((data: any) => {
        this.sysDetailsData = data;
        // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;
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
              this.programExerciseCode.push(this.sysCollectionData[i].exerciseCode);
              if(this.sysCollectionData[i].exerciseCode.length > 0) {
                this.programDecided++;
              }
            }else if(this.sysCollectionData[i].exerciseType == 2) {
              this.chooseExercise.push(this.sysCollectionData[i]);
              this.chooseExerciseCode.push(this.sysCollectionData[i].exerciseCode);
              if(this.sysCollectionData[i].exerciseCode.length > 0) {
                this.chooseDecided++;
              }
            }else if(this.sysCollectionData[i].exerciseType == 3) {
              this.judgeExercise.push(this.sysCollectionData[i]);
              this.judgeExerciseCode.push(this.sysCollectionData[i].exerciseCode);
              if(this.sysCollectionData[i].exerciseCode.length > 0) {
                this.judgeDecided++;
              }
            }else if(this.sysCollectionData[i].exerciseType == 4) {
              this.blankExercise.push(this.sysCollectionData[i]);
              this.blankExerciseCode.push(this.sysCollectionData[i].exerciseCode);
              if(this.sysCollectionData[i].exerciseCode.length > 0) {
                this.blankDecided++;
              }
            }else if(this.sysCollectionData[i].exerciseType == 5) {
              this.multiChooseExercise.push(this.sysCollectionData[i]);
              this.multiExerciseCode.push(this.sysCollectionData[i].exerciseCode);
              if(this.sysCollectionData[i].exerciseCode.length > 0) {
                this.multiChooseDecided++;
              }
            }else{
              this.selfExercise.push(this.sysCollectionData[i]);
              this.selfExerciseCode.push(this.sysCollectionData[i].exerciseCode);
              if(this.sysCollectionData[i].exerciseCode.length > 0) {
                this.selfDecided++;
              }
            }
          }

          if(this.chooseExercise.length > 0) {
            this.sysDetailsData = this.chooseExercise[this.exerciseIndex];
            this.exerciseLength = this.chooseExercise.length;
            this.exerciseType = 2;
          }else if(this.multiChooseExercise.length > 0) {
            this.sysDetailsData = this.multiChooseExercise[this.exerciseIndex];
            if(this.sysDetailsData.exerciseCode.length > 0) {
              this.dealMulti();
            }
            this.exerciseLength = this.multiChooseExercise.length;
            this.exerciseType = 5;
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
              })
            this.dealBlank();
          }else if(this.programExercise.length > 0) {
            this.sysDetailsData = this.programExercise[this.exerciseIndex];
            this.exerciseLength = this.programExercise.length;
            this.exerciseType = 1;
          } else {
            this.sysDetailsData = this.selfExercise[this.exerciseIndex];
            this.exerciseLength = this.selfExercise.length;
            this.exerciseType = 6;
          }

          // document.getElementById("exerciseNameHtml").innerHTML= this.sysDetailsData.exerciseName;
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
            if(this.exerciseType == 6) {
              document.getElementById("wangEditor").style.display = "block";
            }
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
    this.editor = new wangEditor('#editorMenu', '#editor');
    // console.log(this.editor);
    // 设置编辑器配置
    this.setEditorConfig();
    // 创建编辑器
    this.editor.create();

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
    }else if(this.exerciseType == 5) {
      this.multiAbleOne = false;
      this.multiAbleTwo = false;
      this.multiAbleThree = false;
      this.multiAbleFour = false;
      this.sysDetailsData = this.multiChooseExercise[this.exerciseIndex];
      if(this.sysDetailsData.exerciseCode.length > 0) {
        this.dealMulti();
      }
    }else if(this.exerciseType == 6) {
      this.sysDetailsData = this.selfExercise[this.exerciseIndex];
      this.editor.txt.html(this.sysDetailsData.exerciseCode);
    } else {
      this.sysDetailsData = this.blankExercise[this.exerciseIndex];
      if(this.sysDetailsData.exerciseCode.length > 0 ) {
        this.dealBlank();
      } else {
        for(let i=0; i<this.tempExerciseBlank.length;i++) {
          this.tempExerciseBlank[i] = "";
        }
      }
      this.http.get(this.constUrl.GETBLANKNUMBERURL + "?exerciseId=" + this.sysDetailsData.exerciseId, this.constUrl.httpOptions)
        .subscribe((data:any)=>{
          this.exerciseBlank = [];
          for(let tt=0; tt<data; tt++) {
            this.exerciseBlank[tt] = "";
          }
        })
    }
    // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;
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
    }else if(this.exerciseType == 5) {
      this.multiAbleOne = false;
      this.multiAbleTwo = false;
      this.multiAbleThree = false;
      this.multiAbleFour = false;
      this.sysDetailsData = this.multiChooseExercise[this.exerciseIndex];
      if(this.sysDetailsData.exerciseCode.length > 0) {
        this.dealMulti();
      }
    }else if(this.exerciseType == 6) {
      this.sysDetailsData = this.selfExercise[this.exerciseIndex];
      this.editor.txt.html(this.sysDetailsData.exerciseCode);
    } else {
      this.sysDetailsData = this.blankExercise[this.exerciseIndex];
      if(this.sysDetailsData.exerciseCode.length > 0 ) {
        this.dealBlank();
      } else {
        for(let i=0; i<this.tempExerciseBlank.length;i++) {
          this.tempExerciseBlank[i] = "";
        }
      }
      this.http.get(this.constUrl.GETBLANKNUMBERURL + "?exerciseId=" + this.sysDetailsData.exerciseId, this.constUrl.httpOptions)
        .subscribe((data:any)=>{
          this.exerciseBlank = [];
          for(let tt=0; tt<data; tt++) {
            this.exerciseBlank[tt] = "";
          }
        })
    }
    // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;
  }

  backCollections() {
    history.back();
  }

  //提交代码
  submitCode() {
    if(this.exerciseType==6 && this.sysDetailsData.exerciseName.length<30&&this.sysDetailsData.exerciseName.includes("实验报告")) {
      //上传实验报告
      this.handleUploadExcelOk();
    } else {
      if(this.exerciseType == 6) {
        if((""+this.editor.txt.text()).length == 0 && this.editor.txt.html().length==11) {
          this.sysDetailsData.exerciseCode = "";
        }
      }
      if(this.exerciseType == 4) {
        // this.sysDetailsData.exerciseCode = "";
        for(let i=0; i<this.exerciseBlank.length; i++) {
          if(this.tempExerciseBlank[i].length == 0) {
            this.sysDetailsData.exerciseCode = "";
            break;
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
            .subscribe((data:string)=> {
              this.compileSubmitLoading = false;
              this.testDisable = false;
              this.isSubmit = true;
              this.compilerResult = data;
              this.dealDeciedNumber();
              // if(data.state === "600") {
              //   this.submitDisable = true;
              // }
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
            this.compilerResult = data;
          })
      } else {
        this.http.post(this.constUrl.TESTCOMPILEURL, this.sysDetailsData,this.constUrl.httpOptions)
          .subscribe((data:any)=> {
            this.compileTestLoading = false;
            this.isSubmit = true;
            this.submitDisable = false;
            this.compilerResult = data;
          })
      }

    }else {
      alert("答案不能为空");
    }

  }

  chooseChange() {
    document.getElementById("wangEditor").style.display = "none";
    if(this.exerciseType != 2) {
      this.isSubmit = false;
      this.exerciseType = 2;
      this.exerciseIndex = 0;
      this.exerciseLength = this.chooseExercise.length;
      this.sysDetailsData = this.chooseExercise[0];
      // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;
    }
  }

  judgeChange() {
    document.getElementById("wangEditor").style.display = "none";
    if(this.exerciseType != 3) {
      this.isSubmit = false;
      this.exerciseType = 3;
      this.exerciseIndex = 0;
      this.exerciseLength = this.judgeExercise.length;
      this.sysDetailsData = this.judgeExercise[0];
      // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;

    }
  }

  blankChange() {
    document.getElementById("wangEditor").style.display = "none";
    if(this.exerciseType != 4) {
      this.isSubmit = false;
      this.exerciseType = 4;
      this.exerciseIndex = 0;
      this.exerciseLength = this.blankExercise.length;
      this.sysDetailsData = this.blankExercise[0];
      if(this.sysDetailsData.exerciseCode.length > 0 ) {
        this.dealBlank();
      } else {
        for(let i=0; i<this.tempExerciseBlank.length;i++) {
          this.tempExerciseBlank[i] = "";
        }
      }
      this.http.get(this.constUrl.GETBLANKNUMBERURL + "?exerciseId=" + this.sysDetailsData.exerciseId, this.constUrl.httpOptions)
        .subscribe((data:any)=>{
          this.exerciseBlank = [];
          for(let tt=0; tt<data; tt++) {
            this.exerciseBlank[tt] = "";
          }
        })
      // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;

    }
  }

  programChange() {
    document.getElementById("wangEditor").style.display = "none";
    if(this.exerciseType != 1) {
      this.isSubmit = false;
      this.exerciseType = 1;
      this.exerciseIndex = 0;
      this.exerciseLength = this.programExercise.length;
      this.sysDetailsData = this.programExercise[0];
      // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;
    }
  }

  multiChange() {
    document.getElementById("wangEditor").style.display = "none";
    if(this.exerciseType != 5) {
      this.isSubmit = false;
      this.exerciseType = 5;
      this.exerciseIndex = 0;
      this.exerciseLength = this.multiChooseExercise.length;
      this.sysDetailsData = this.multiChooseExercise[0];
      this.multiAbleOne = false;
      this.multiAbleTwo = false;
      this.multiAbleThree = false;
      this.multiAbleFour = false;
      if(this.sysDetailsData.exerciseCode.length > 0) {
        this.dealMulti();
      }
      // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;
    }
  }

  selfChange() {
    if(this.exerciseType != 6) {
      this.isSubmit = false;
      this.exerciseType = 6;
      this.exerciseIndex = 0;
      this.exerciseLength = this.selfExercise.length;
      this.sysDetailsData = this.selfExercise[0];
      this.editor.txt.html(this.sysDetailsData.exerciseCode);

      document.getElementById("wangEditor").style.display = "block";

      // document.getElementById("exerciseNameHtml").innerHTML = this.sysDetailsData.exerciseName;
    }
  }

  log($event: string[]) {
    this.multiChooseValue = $event;
    this.sysDetailsData.exerciseCode = "";
    if(this.multiChooseValue.length > 0) {
      for(let i=0; i<this.multiChooseValue.length; i++) {
        this.sysDetailsData.exerciseCode += this.multiChooseValue[i];
      }
    }
  }
  tempStr: string[] = [];
  dealMulti() {
    this.tempStr = this.sysDetailsData.exerciseCode.split("");
    for(let i=0; i<this.sysDetailsData.exerciseCode.length; i++) {
      if(this.tempStr[i] == "A") {
        this.multiAbleOne = true;
      } else if(this.tempStr[i] == "B") {
        this.multiAbleTwo = true;
      } else if(this.tempStr[i] == "C") {
        this.multiAbleThree = true;
      } else {
        this.multiAbleFour = true;
      }
    }
  }

  dealBlank() {
    let str = new Array();
    str = this.sysDetailsData.exerciseCode.split(";xiaaman;");
    for(let i=0;i<str.length; i++) {
      this.tempExerciseBlank[i] = str[i];
    }
  }

  dealBlankChange($event: any) {
    this.sysDetailsData.exerciseCode = "";
    for(let i=0; i<this.exerciseBlank.length; i++) {
      if(i==this.exerciseBlank.length-1) {
        this.sysDetailsData.exerciseCode += this.tempExerciseBlank[i];
      }else {
        this.sysDetailsData.exerciseCode += this.tempExerciseBlank[i] +";xiaaman;";
      }
    }
  }


  public sign = 'wang_editor';

  private editor: any;

  // 展示api获取到的数据
  public showMessage = 'Waiting for display';

  // 默认显示
  public defaultMessage = '';

  // 编辑器相关配置设置
  setEditorConfig () {
    // 使用 base64 保存图片
    this.editor.customConfig.uploadImgShowBase64 = true;
    // 菜单展示项配置
    // this.editor.customConfig.menus = this.getMenuConfig();
    // 自定义配置颜色（字体颜色、背景色）
    this.editor.customConfig.colors = this.getColorConfig();
    // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
    this.editor.customConfig.emotions = this.getEmotionsConfig();
    // 自定义字体
    this.editor.customConfig.fontNames = this.getFontFamilyConfig();
    // 编辑区域的z-index默认为10000
    // this.editor.customConfig.zIndex = 100;
    // 配置编辑器内容改变触发方法
    this.editor.customConfig.onchange = this.editorContentChange;
    // 编辑器获取到焦点触发方法
    this.editor.customConfig.onfocus = this.editorOnFocus;
    // 编辑器失去焦点触发方法
    this.editor.customConfig.onblur = this.editorOnBlur;
  }

  // 获取显示菜单项
  getMenuConfig (): string[] {
    return [
      'bold',  // 粗体
      'italic',  // 斜体
      'underline',  // 下划线
      'head',  // 标题
      'fontName',  // 字体
      'fontSize',  // 字号
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'emoticon',  // 表情
      'table',  // 表格
      'image',  // 插入图片
      'video',  // 插入视频
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
  }

  // 获取字体、背景颜色列表配置
  getColorConfig(): string[] {
    return [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#ffffff'
    ];
  }

  // 获取表情配置
  getEmotionsConfig() {
    return [
      {
        // tab 的标题
        title: '默认',
        // type -> 'emoji' / 'image'
        type: 'image',
        // content -> 数组
        content: [
          {
            alt: '[坏笑]',
            src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
          },
          {
            alt: '[舔屏]',
            src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
          }
        ]
      },
      {
        // tab 的标题
        title: 'emoji',
        // type -> 'emoji' / 'image'
        type: 'emoji',
        // content -> 数组
        content: ['😀', '😃', '😄', '😁', '😆']
      }
    ];
  }

  // 获取字体列表配置
  getFontFamilyConfig(): string[] {
    return [
      '宋体',
      '微软雅黑',
      'Arial',
      'Tahoma',
      'Verdana'
    ];
  }

  // 富文本编辑器内容变化触发方法
  editorContentChange = (html) => {
    this.sysDetailsData.exerciseCode = this.editor.txt.html();
    // console.log(this.sysDetailsData.exerciseCode);
    // console.log(this.editor.txt.text())
    // console.log(html);
  }

  // 编辑器获取到焦点触发事件
  editorOnFocus = () => {
    // console.log('on focus');
  }

  // 编辑器失去焦点触发事件
  editorOnBlur = (html) => {
    // console.log('on blur');
    // console.log(html);
  }


  // 获取编辑器内容，带html
  getContent() {
      this.showMessage = this.editor.txt.html();
    }

    //提交题目后重新计算个体性题目提交数量
  dealDeciedNumber() {
    // this.chooseDecided = 0;
    // this.selfDecided = 0 ;
    // this.programDecided = 0;
    // this.multiChooseDecided = 0;
    // this.blankDecided = 0;
    // this.judgeDecided = 0;
    // for(let i=0; i<this.sysCollectionData.length; i++) {
      if(this.sysDetailsData.exerciseType == 1) {
        if(this.programExerciseCode[this.exerciseIndex].length == 0) {
          this.programExerciseCode[this.exerciseIndex] = "" + this.sysDetailsData.exerciseCode;
          this.programDecided++;
        }
      }else if(this.sysDetailsData.exerciseType == 2) {
        if(this.chooseExerciseCode[this.exerciseIndex].length == 0) {
          this.chooseExerciseCode[this.exerciseIndex] = "" + this.sysDetailsData.exerciseCode;
          this.chooseDecided++;
        }
      }else if(this.sysDetailsData.exerciseType == 3) {
        if(this.judgeExerciseCode[this.exerciseIndex].length == 0) {
          this.judgeExerciseCode[this.exerciseIndex] = "" + this.sysDetailsData.exerciseCode;
          this.judgeDecided++;
        }
      }else if(this.sysDetailsData.exerciseType == 4) {
        if(this.blankExerciseCode[this.exerciseIndex].length == 0) {
          this.blankExerciseCode[this.exerciseIndex] = "" + this.sysDetailsData.exerciseCode;
          this.blankDecided++;
        }
      }else if(this.sysDetailsData.exerciseType == 5) {
        if(this.multiExerciseCode[this.exerciseIndex].length == 0) {
          this.multiExerciseCode[this.exerciseIndex] = "" + this.sysDetailsData.exerciseCode;
          this.multiChooseDecided++;
        }
      }else{
        if(this.selfExerciseCode[this.exerciseIndex].length == 0) {
          this.selfExerciseCode[this.exerciseIndex] = "" + this.sysDetailsData.exerciseCode;
          this.selfDecided++;
        }
      }
    }
  // }




  //*******************************************************************************//
  // 上传学生Excel表模态框
  fileList: UploadFile[] = [];

  // 提交上传实验报告
  handleUploadExcelOk():void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    if(this.fileList.length != 1) {
      this.notify.showError("请上传一个文件，有且只能上传一个文件")
      return;
    }
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });

    // You can use any AJAX library you like
    const req = new HttpRequest('POST', this.constUrl.FILELABWORDURL, formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (data:any) => {
          this.notify.showInfo("实验报告上传成功")
          this.compileSubmitLoading = false;
          this.testDisable = false;
          // this.isSubmit = true;
          // this.compilerResult = data;

          let ss = data.body
          let url;
          this.fileList = [];
          url = this.constUrl.SUBMITCOMPILEURL;
          this.unionData.collectionId = <string> this.collectionId;
          this.sysDetailsData.exerciseCode = "实验报告文件已交";
          this.unionData.exercise = <any> this.sysDetailsData;

          this.http.post(url, this.unionData,this.constUrl.httpOptions).subscribe((data:any)=>{
            this.editor.txt.text("实验报告文件已交");
            if(this.exerciseId == null) {
              this.dealDeciedNumber();
            }

          })

        },
        () => {
          this.notify.showError('文件上传失败');
        }
      );
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    let isExcel = file.type;
    console.log(isExcel)
    if (isExcel !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && isExcel !== 'application/msword') {
      this.notify.showError('只能上传word(.docx,.doc)文件');
      return;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.notify.showError('文件大小不能超过10M');
      return;
    }
    return false;
  };

  }
