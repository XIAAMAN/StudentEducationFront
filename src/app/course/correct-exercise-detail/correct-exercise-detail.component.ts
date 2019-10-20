import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstUrlService} from '../../const/const-url.service';
import {ActivatedRoute} from '@angular/router';
import * as wangEditor from '../../../../node_modules/wangeditor/release/wangEditor.js';
import {NotificationService} from '../../utils/notification.service';

@Component({
  selector: 'app-correct-exercise-detail',
  templateUrl: './correct-exercise-detail.component.html',
  styleUrls: ['./correct-exercise-detail.component.css']
})
export class CorrectExerciseDetailComponent implements OnInit {

  exerciseId:string;
  classNumber:string;
  collectionName:string;
  public sign = 'wang_editor';

  private editor: any;

  // 展示api获取到的数据
  public showMessage = 'Waiting for display';

  // 默认显示
  public defaultMessage = '';
  sysExerciseData: any = [];
  sysDetailsData: any = {};
  userIndex:number = 0;
  userLength:number;
  constructor(private http: HttpClient, private notify: NotificationService, private constUrl: ConstUrlService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.exerciseId = params.get('exerciseId');
      this.classNumber = params.get('classNumber');
      this.collectionName = params.get('collectionName');
    });
    this.editor = new wangEditor('#editorMenu', '#editor');
    // console.log(this.editor);
    // 设置编辑器配置
    this.setEditorConfig();
    // 创建编辑器
    this.editor.create();
    this.loadData();
  }

  loadData() {
    this.http.get(this.constUrl.CORRECTEXERCISEDETAILURL + "?exerciseId=" + this.exerciseId +"&classNumber=" +this.classNumber + "&collectionName=" +this.collectionName,this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        this.sysExerciseData = data;
        this.userIndex = 0;
        this.userLength = this.sysExerciseData.length;
        this.sysDetailsData = this.sysExerciseData[0];
        this.editor.txt.html(this.sysDetailsData.exerciseCode);
        // console.log(this.sysDetailsData)
      })
  }

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
    // this.sysDetailsData.exerciseCode = this.editor.txt.html();
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

  backCollections() {
    history.back();
  }

  backExercise() {
    this.userIndex--;
    this.sysDetailsData = this.sysExerciseData[this.userIndex];
    this.editor.txt.html(this.sysDetailsData.exerciseCode);
  }

  nextExercise() {
    this.userIndex++;
    this.sysDetailsData = this.sysExerciseData[this.userIndex];
    this.editor.txt.html(this.sysDetailsData.exerciseCode);
  }

  submit() {
    this.sysDetailsData.times ++;
    this.http.post(this.constUrl.CORRECTEXERCISESUBMITURL, this.sysDetailsData, this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        if(data==200) {
          this.notify.showSuccess("提交成功");
        }
      })
  }
}
