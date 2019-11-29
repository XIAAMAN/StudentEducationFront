import {AfterViewInit, Component, ElementRef, OnInit, Renderer, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../utils/notification.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {ConstUrlService} from '../../const/const-url.service';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import * as wangEditor from '../../../../node_modules/wangeditor/release/wangEditor.js';
@Component({
  selector: 'app-look-exercise',
  templateUrl: './look-exercise.component.html',
  styleUrls: ['./look-exercise.component.css']
})
export class LookExerciseComponent implements OnInit {
  // 表格
   loading:boolean=true;
   totalSize: number;
   currentPageIndex: number=1;
   pageSize: number = 10;
   sysData: any[];

  //用户拥有的所有权限
   permisAll :string[] = JSON.parse(window.sessionStorage.getItem("permisAll"));
    exerciseDetailPermis: string = "exercises:management:detail";     //题目查看详情权限值
    exerciseModifyPermis: string = "exercises:management:modify";     //修改题目权限值
    exerciseAddPermis: string = "exercises:management:add";     //增加题目权限值
    exerciseDeletePermis: string = "exercises:management:delete";     //删除题目权限值
   judgePermis: boolean = false; //表示用户是否拥有查看详情、修改、删除题目之一的权限
  constructor(private http: HttpClient, private notify: NotificationService,
              private fb:FormBuilder, private constUrl: ConstUrlService,
              private el: ElementRef, private renderer: Renderer) {

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

  // 加载表格数据
  loadData() {
    let url: string;
    this.loading=true;
    url = this.constUrl.GETEXERCISEURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url, this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));

      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  //  decodeHtml(s) {
  //   var HTML_DECODE = {
  //     "&lt;": "<",
  //     "&gt;": ">",
  //     "&amp;": "&",
  //     "&nbsp;": " ",
  //     "&quot;": "\"",
  //     "&copy;": ""
  //
  //     // Add more
  //   };
  //
  //   var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
  //
  //   var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;
  //
  //   var REGX_TRIM = /(^\s*)|(\s*$)/g;
  //
  //   s = (s != undefined) ? s : "";
  //   return (typeof s != "string") ? s :
  //     s.replace(REGX_HTML_DECODE,
  //       function ($0, $1) {
  //         var c = HTML_DECODE[$0];
  //         if (c == undefined) {
  //           // Maybe is Entity Number
  //           if (!isNaN($1)) {
  //             c = String.fromCharCode(($1 == 160) ? 32 : $1);
  //           } else {
  //             c = $0;
  //           }
  //         }
  //         return c;
  //       });
  // };

  ngOnInit() {

    //题目修改验证框
    this.validateForm = this.fb.group({
      exerciseName: ['', [Validators.required]],
      exerciseLabel: ['', [Validators.required]],
      exerciseScore: ['', [Validators.required]],
      exerciseCode: ['', [Validators.required]]
    });
    //上传题目验证框
    this.exerciseForm = this.fb.group({
      // exerciseName: ['', [Validators.required]],
      exerciseLabel: ['', [Validators.required]],
      exerciseType: ['', [Validators.required]],
      // exerciseDifficult: ['', [Validators.required]],

      exerciseScore: ['', [Validators.required]],
      exerciseCode: ['', [Validators.required]]
    });
    //上传题目样例验证
    // this.exampleForm = this.fb.group({
    //   exerciseSelectOne: ['', [Validators.required]],
    //   exerciseSelectTwo: ['', [Validators.required]],
    //   exerciseSelectThree: ['', [Validators.required]],
    //   exerciseSelectFour: ['', [Validators.required]],
    //   exerciseDescription: ['', [Validators.required]],
    //   exerciseInputExample: ['', [Validators.required]],
    //   exerciseOutputExample: ['', [Validators.required]],
    //   exerciseWarning: ['', [Validators.required]]
    // });
    // 判断用户是否有操作栏中任意一项的权限
    if(this.permisAll.indexOf(this.exerciseDetailPermis)>=0 ||
      this.permisAll.indexOf(this.exerciseModifyPermis)>=0 ||
      this.permisAll.indexOf(this.exerciseDeletePermis)>=0) {
      this.judgePermis = true;
    }
    this.loadData();
    this.loadLabelList();
    this.editor = new wangEditor('#editorMenu', '#editor');
    // console.log(this.editor);
    // 设置编辑器配置
    this.setEditorConfig();
    // 创建编辑器
    this.editor.create();
  }


  //**********************************************************************************************//
  // 抽屉
   visible:boolean = false;
   data: any ={};

  //打开抽屉
  lookExerciseDetail(data: any): void {
    this.data = data;
    document.getElementById("wangEditor").style.display = "none";
    this.editor.txt.html("");
    document.getElementById("exerciseNameHtml").innerHTML = this.data.exerciseName;
    this.visible = true;
  }

  //关闭抽屉
  close(): void {
    this.visible = false;
  }

  // 删除题目
  deleteExercise(exerciseId: string) {
    document.getElementById("wangEditor").style.display = "none";
    this.editor.txt.html("");
    let url:string;
    this.http.get(this.constUrl.ISDELETEEXERCISEURL+"?exerciseId=" + exerciseId, this.constUrl.httpOptions)
      .subscribe((resp:any)=>{
          if(resp === 200) { //可以删除
            url = this.constUrl.DELETEEXERCISEURL + '?exerciseId=' + exerciseId;
            this.http.get(url, this.constUrl.httpOptions).subscribe((data:any) => {
              if(data===200) {
                this.notify.showSuccess("已删除");
                this.loadData();
              }
            })
          } else {
            this.notify.showError("该题已经被添加到题目集中，不可删除");
          }
      })

  }

  //*********************************************************************************************//
  // 修改模态框
   modalVisible: boolean = false;
   modifyExerciseName: string ="";
   modifyExerciseInput: string ="";
   modifyExerciseOutput: string ="";
   modifyExerciseWarning: string ="";
   modifyExerciseDescription: string ="";
   labelList:[
    {
      exerciseLabelId:string,
      exerciseLabelName:string,
      exerciseLabelValue:string,
      exerciseLabelLanguage:string,
      exerciseLabelDescription:string,
    }
  ];
  validateForm: FormGroup;
   listOfOption = [];
   listOfSelectedValue:string[] = [];
   modalData: any = {};
  cancelModify() {
    this.modalVisible = false;
    this.modalData.exerciseName = this.modifyExerciseName;
    this.modalData.exerciseInputExample = this.modifyExerciseInput;
    this.modalData.exerciseOutputExample = this.modifyExerciseOutput;
    this.modalData.exerciseDescription = this.modifyExerciseDescription;
    this.modalData.exerciseWarning = this.modifyExerciseWarning;
    // this.loadData();
  }

  // 提交修改
   submitModify(): void {
    if(this.validateForm.valid) {
      this.modalData.exerciseLabel = "";
      for(let tt of this.listOfSelectedValue) {
        this.modalData.exerciseLabel += tt +" ";
      }
      let length = this.modalData.exerciseLabel.length;
      this.modalData.exerciseLabel = this.modalData.exerciseLabel.substring(0, length-1);
      this.http.post(this.constUrl.MODIFYEXERCISEURL, this.modalData, this.constUrl.httpOptions).subscribe((data:any)=>{
        if(data===200) {
          this.modalVisible = false;
          this.notify.showInfo("修改成功");
          this.loadData();
        }
      })
    } else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

  }

  modifyExercise(data:any) {
    this.modalData = data;
    this.modifyExerciseName = data.exerciseName;
    this.modifyExerciseInput = data.exerciseInputExample;
    this.modifyExerciseOutput = data.exerciseOutputExample;
    this.modifyExerciseDescription = data.exerciseDescription;
    this.modifyExerciseWarning = data.exerciseWarning;
    document.getElementById("wangEditor").style.display = "none";
    this.editor.txt.html("");
    // document.getElementById("updateExerciseNameHtml").innerHTML = this.modalData.exerciseName;
    this.listOfSelectedValue = [];
    for(let tt of (""+this.modalData.exerciseLabel).split(' ')){
      this.listOfSelectedValue.push(tt);
    }
    // console.log(this.listOfSelectedValue)
    this.modalVisible = true;
  }

  loadLabelList() {
    this.http.get(this.constUrl.GETEXERCISLABELEURL, this.constUrl.httpOptions).subscribe((data:any)=>{
      this.labelList = JSON.parse(JSON.stringify(data));
      for(let tt of this.labelList) {
        this.listOfOption.push(""+tt.exerciseLabelName);
      }
    })
  }

  // *****************************************************************************************************
// 上传题目
  uploadExercisePermis: string = "exercises:management:add";
  exerciseForm: FormGroup;
  exampleForm: FormGroup;
  exerciseTypeValue:string = "";
  listOfType: string[] = ["编程题","单选题","判断题","填空题","多选题", "主观题"];
  isFree: boolean = true;
  uploadExerciseVisible: boolean = false;
  labelValue:string[] = [];
  uploadExercise = {
    exerciseName: '',
    exerciseUploadUserName: window.sessionStorage.getItem("userName"),
    exerciseDescription: '',
    exerciseDifficultValue: '',
    exerciseInputExample: '',
    exerciseOutputExample: '',
    exerciseErrorExample: '',
    exerciseLabel: '',
    exerciseScore: 5.0,
    exerciseWarning: '',
    exerciseCode: '',
    exerciseFree: 1,
    exerciseFileName: '',
    exerciseType: 1,
    exerciseFileUrl: ''

  }

  current = 0;

  index = 1;

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {

    if("编程题"==this.exerciseTypeValue) {
      if(this.uploadExercise.exerciseFileUrl.length>0) {
        this.uploadExercise.exerciseType = 1;
        this.submitExercise();
      } else {
        alert("请先上传文件");
      }
    }else if("单选题"==this.exerciseTypeValue) {
      this.uploadExercise.exerciseWarning = "";
      this.uploadExercise.exerciseInputExample = "";
      this.uploadExercise.exerciseOutputExample = "";
      this.uploadExercise.exerciseType = 2;
      this.submitExercise();
    } else if("判断题" == this.exerciseTypeValue) {
      this.uploadExercise.exerciseWarning = "";
      this.uploadExercise.exerciseInputExample = "";
      this.uploadExercise.exerciseOutputExample = "";
      this.uploadExercise.exerciseType = 3;
      this.submitExercise();
    } else if("填空题" == this.exerciseTypeValue){
      this.uploadExercise.exerciseWarning = "";
      this.uploadExercise.exerciseInputExample = "";
      this.uploadExercise.exerciseOutputExample = "";
      this.uploadExercise.exerciseType = 4;
      this.submitExercise();
    } else if("多选题" == this.exerciseTypeValue){
      this.uploadExercise.exerciseWarning = "";
      this.uploadExercise.exerciseInputExample = "";
      this.uploadExercise.exerciseOutputExample = "";
      this.uploadExercise.exerciseType = 5;
      this.submitExercise();
    } else if("主观题" == this.exerciseTypeValue){
      this.uploadExercise.exerciseWarning = "";
      this.uploadExercise.exerciseInputExample = "";
      this.uploadExercise.exerciseOutputExample = "";
      this.uploadExercise.exerciseType = 6;
      this.submitExercise();
    }


  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 1;
        break;
      }
      case 1: {
        this.index = 2;
        break;
      }
      case 2: {
        this.index = 3;
        break;
      }
      default: {
        this.index = 0;
      }
    }
  }

  changeVisible() {
    this.editor.txt.html("");
    this.editor.txt.text("");
    this.exerciseTypeValue = this.listOfType[0];
    document.getElementById("wangEditor").style.display = "block";
    this.defaultMessage = "";
  }

  closeModal() {
    this.uploadExerciseVisible = false;
    this.resetUploadExercise();
  }

  validateExercise() {
    if(this.exerciseForm.valid) {
      this.uploadExercise.exerciseName = this.editor.txt.html();

      // let url:string;
      // url = this.constUrl.JUDGEEXERCISENAMEURL + "?exerciseName="+this.uploadExercise.exerciseName;
      this.http.post(this.constUrl.JUDGEEXERCISENAMEURL,{
        exerciseName: this.uploadExercise.exerciseName
      }, this.constUrl.httpOptions)
        .subscribe(data=>{
          if(data!=200) {
            this.notify.showError("该题目名称已存在，请更换题目名称");
          } else {

            this.next();
          }
        })

    } else {
      for (const i in this.exerciseForm.controls) {
        this.exerciseForm.controls[i].markAsDirty();
        this.exerciseForm.controls[i].updateValueAndValidity();
      }
    }
  }

  // 验证题目说明表单模块
  validateExample() {
    // console.log(this.uploadExercise)
    if("编程题" == this.exerciseTypeValue) {
      if(this.uploadExercise.exerciseWarning.length>0 && this.uploadExercise.exerciseInputExample.length>0
        && this.uploadExercise.exerciseOutputExample.length> 0) {
        this.next();
      }else {
        alert("存在非法数据，请检查所有填写数据是否为空");
      }

    } else {
      this.next();
    }

    // console.log(this.uploadExercise)
    // if(this.exampleForm.valid ) {
    //   this.next();
    // } else {
    //   for (const i in this.exampleForm.controls) {
    //     this.exampleForm.controls[i].markAsDirty();
    //     this.exampleForm.controls[i].updateValueAndValidity();
    //   }
    // }
  }

  beforeUpload = (file: File) => {
    let length = file.name.length -4;
    return new Observable((observer: Observer<boolean>) => {
      const isZip = file.type === 'application/x-zip-compressed';
      if (!isZip) {
        this.notify.showError('只能够上传zip压缩包!');
        observer.complete();
        return;
      }

      if (length > 50) {
        this.notify.showError('文件名称过长');
        observer.complete();
        return;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.notify.showError('文件大小不能超过10M');
        observer.complete();
        return;
      }
      this.uploadExercise.exerciseFileName = file.name;
      // console.log(this.uploadExercise.exerciseFileUrl)
      observer.next(isZip && isLt10M);
      observer.complete();
    });
  };

  submitExercise() {
    this.uploadExerciseVisible = false;
    for(let tt of this.labelValue) {
      this.uploadExercise.exerciseLabel += tt +" ";
    }
    if(this.isFree) {
      this.uploadExercise.exerciseFree = 1;
    }else {
      this.uploadExercise.exerciseFree = 0;
    }
    let length = this.uploadExercise.exerciseLabel.length;
    this.uploadExercise.exerciseLabel = this.uploadExercise.exerciseLabel.substring(0,length-1);
    this.http.post(this.constUrl.ADDEXERCISEURL,this.uploadExercise, this.constUrl.httpOptions).subscribe(data=>{
      if(data===200) {
        this.notify.showSuccess("题目上传成功");
        this.resetUploadExercise();
        this.loadData();
      }
    });
  }

  handleChange({ file, fileList }: { [key: string]: any }): void {
    this.uploadExercise.exerciseFileName = "";
    this.uploadExercise.exerciseFileUrl = "";
    const status = file.status;

    if (status === 'done' && file.response!=null) {
      this.uploadExercise.exerciseFileName = file.name;
      this.uploadExercise.exerciseFileUrl = "D:\\compileFiles\\"+file.response+file.name;
      this.notify.showSuccess(`${file.name} 文件上传成功.`);
    } else if (status === 'error') {
      this.notify.showError(`${file.name} 文件上传失败.`);
    }
  }

  resetUploadExercise() {
    this.exerciseForm.reset();
    // this.exampleForm.reset();
    this.index = 1;
    this.current =0;
    this.uploadExercise.exerciseName = '';
    this.uploadExercise.exerciseDescription = '';
    this.uploadExercise.exerciseInputExample = '';
    this.uploadExercise.exerciseOutputExample = '';
    this.uploadExercise.exerciseWarning = '';
    this.uploadExercise.exerciseErrorExample = '';
    this.uploadExercise.exerciseFileUrl = '';
    this.uploadExercise.exerciseFileName = '';
    this.uploadExercise.exerciseDifficultValue = '';
    this.uploadExercise.exerciseCode = '';
    this.uploadExercise.exerciseLabel = '';
    this.uploadExercise.exerciseScore = 5;
    this.isFree = true;
    this.labelValue=[];
  }


  // *****************************************************************************************************
// 题目动态查询
  selectExerciseLabel: string = "";
  selectExerciseName: string = "";

  selectExercise() {
      let url:string;
      if(this.selectExerciseLabel==null) {
        this.selectExerciseLabel = "";
      }
      url = this.constUrl.DYNAMICGETGETEXERCISEURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize
      + "&exerciseLabel=" + this.selectExerciseLabel + "&exerciseName=" + this.selectExerciseName;
      this.loading = true;
      this.http.get(url, this.constUrl.httpOptions).subscribe((data:any)=>{
        this.sysData = JSON.parse(JSON.stringify(data.content));
        this.totalSize = <number> data.totalElements;
        this.loading=false;
      })

  }

  // initValidate() {
  //   if("编程题"==this.exerciseTypeValue) {
  //     this.uploadExercise.exerciseSelectOne = "无";
  //     this.uploadExercise.exerciseSelectTwo = "无";
  //     this.uploadExercise.exerciseSelectThree = "无";
  //     this.uploadExercise.exerciseSelectFour = "无";
  //   }else if("选择题"==this.exerciseTypeValue) {
  //     this.uploadExercise.exerciseDescription = "无";
  //     this.uploadExercise.exerciseInputExample = "无";
  //     this.uploadExercise.exerciseOutputExample = "无";
  //     this.uploadExercise.exerciseWarning = "无";
  //   } else {
  //
  //     this.uploadExercise.exerciseDescription = "无";
  //     this.uploadExercise.exerciseInputExample = "无";
  //     this.uploadExercise.exerciseOutputExample = "无";
  //     this.uploadExercise.exerciseWarning = "无";
  //     this.uploadExercise.exerciseSelectOne = "无";
  //     this.uploadExercise.exerciseSelectTwo = "无";
  //     this.uploadExercise.exerciseSelectThree = "无";
  //     this.uploadExercise.exerciseSelectFour = "无";
  //   }
  //
  // }


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
    console.log(this.editor.txt.html())
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
    this.uploadExercise.exerciseDescription = this.editor.txt.text();
    if(this.uploadExercise.exerciseDescription.length > 990) {
      alert("请检查题目格式，不能有任何样式");
    }else {
      document.getElementById("wangEditor").style.display="none";
      this.uploadExerciseVisible=true;
      this.showMessage = this.editor.txt.html();
    }

  }

  // 获取编辑器文字内容
  getContentText() {
    this.showMessage = this.editor.txt.text();
  }


  test() {
    document.getElementById("wangEditor").style.display = "block";
  }


  closeEditor() {
    document.getElementById("wangEditor").style.display = "none";
    this.editor.txt.html("");
  }
}
