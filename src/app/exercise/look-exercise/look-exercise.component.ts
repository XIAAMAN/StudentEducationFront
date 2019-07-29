import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../utils/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';
@Component({
  selector: 'app-look-exercise',
  templateUrl: './look-exercise.component.html',
  styleUrls: ['./look-exercise.component.css']
})
export class LookExerciseComponent implements OnInit {
  // 表格
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
  constructor(private http: HttpClient, private notify: NotificationService,
              private fb:FormBuilder, private msg: NzMessageService) {

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
    url = 'apidata/sys_exercise/get?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  ngOnInit() {
    //题目修改验证框
    this.validateForm = this.fb.group({
      exerciseName: ['', [Validators.required]],
      exerciseLabel: ['', [Validators.required]],
      exerciseWarning: ['', [Validators.required]],
      exerciseErrorExample: ['', [Validators.required]],
      exerciseDescription: ['', [Validators.required]]
    });
    //上传题目验证框
    this.exerciseForm = this.fb.group({
      exerciseName: ['', [Validators.required]],
      exerciseLabel: ['', [Validators.required]],
      exerciseDifficult: ['', [Validators.required]],
      exerciseDescription: ['', [Validators.required]],
      exerciseCode: ['', [Validators.required]]
    });
    //上传题目样例验证
    this.exampleForm = this.fb.group({
      exerciseInputExample: ['', [Validators.required]],
      exerciseOutputExample: ['', [Validators.required]],
      exerciseErrorExample: ['', [Validators.required]],
      exerciseWarning: ['', [Validators.required]]
    });
    // 判断用户是否有操作栏中任意一项的权限
    if(this.permisAll.indexOf(this.exercise_detail_permis)>=0 ||
      this.permisAll.indexOf(this.exercise_modify_permis)>=0 ||
      this.permisAll.indexOf(this.exercise_delete_permis)>=0) {
      this.judgePermis = true;
    }
    this.loadData();
    this.loadLabelList();
  }

  //**********************************************************************************************//
  // 抽屉
  private visible:boolean = false;
  private data: any ={};
  private inputExample: string[];
  private outputExample: string[];

  //打开抽屉
  open(data: any): void {
    this.data = data;
    this.inputExample = (''+this.data.exerciseInputExample).split(' ');
    this.outputExample = (''+this.data.exerciseOutputExample).split(' ');
    this.visible = true;
  }

  //关闭抽屉
  close(): void {
    this.visible = false;
  }

  // 删除题目
  deleteExercise(exerciseId: string) {
    let url:string;
    url = 'apidata/sys_exercise/delete?exerciseId=' + exerciseId;
    this.http.get(url).subscribe((data:any) => {
      if(data===200) {
        this.notify.showSuccess("已删除");
        this.loadData();
      }
    })
  }

  //*********************************************************************************************//
  // 修改模态框
  private modalVisible: boolean = false;
  private labelList:[
    {
      exerciseLabelId:string,
      exerciseLabelName:string,
      exerciseLabelValue:string,
      exerciseLabelLanguage:string,
      exerciseLabelDescription:string,
    }
  ];
  validateForm: FormGroup;
  private listOfOption = [];
  private listOfSelectedValue = [];
  private modalData: any = {};
  handleCancel() {
    this.modalVisible = false;
    this.loadData();
  }

  // 提交修改
  handleOk(): void {
    this.modalData.exerciseLabel = "";
      for(let tt of this.listOfSelectedValue) {
        this.modalData.exerciseLabel += tt +" ";
      }
      let length = this.modalData.exerciseLabel.length;
      this.modalData.exerciseLabel = this.modalData.exerciseLabel.substring(0, length-1);
      this.http.post('apidata/sys_exercise/modify',this.modalData).subscribe((data:any)=>{
        if(data===200) {
          this.modalVisible = false;
          this.notify.showInfo("修改成功");
          this.loadData();
        }
      })
  }

  showModal(data:any) {
    this.modalData = data;
    this.listOfSelectedValue = [];
    for(let tt of (""+data.exerciseLabel).split(' ')){
      this.listOfSelectedValue.push(tt);
    }
    this.modalVisible = true;
  }

  loadLabelList() {
    let url:string= "apidata/exercise_label/get";

    this.http.get(url).subscribe((data:any)=>{
      this.labelList = JSON.parse(JSON.stringify(data));
      for(let tt of this.labelList) {
        this.listOfOption.push(""+tt.exerciseLabelName);
      }
    })
  }

  // *****************************************************************************************************
// 上传题目
  exerciseForm: FormGroup;
  exampleForm: FormGroup;
  uploadExerciseVisible: boolean = false;
  exampleInputValue : string[];
  exampleOutputValue : string[];
  labelValue:string[] = [];
  uploadExercise = {
    exerciseName: '',
    exerciseDescription: '',
    exerciseUploadUserName: '',
    exerciseDifficultValue: 3.0,
    exerciseInputExample: '',
    exerciseOutputExample: '',
    exerciseErrorExample: '',
    exerciseLabel: '',
    exerciseWarning: '',
    exerciseCode: '',
    exerciseFileName: '',
    exerciseFileUrl: '',

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
    if(this.uploadExercise.exerciseFileUrl.length>0) {
      this.uploadExerciseVisible = false;
      this.uploadExercise.exerciseUploadUserName = window.sessionStorage.getItem("userName");
      for(let tt of this.labelValue) {
        this.uploadExercise.exerciseLabel += tt +" ";
      }
      let length = this.uploadExercise.exerciseLabel.length;
      this.uploadExercise.exerciseLabel = this.uploadExercise.exerciseLabel.substring(0,length-1);
      this.http.post('apidata/sys_exercise/add',this.uploadExercise).subscribe(data=>{
        if(data===200) {
          this.msg.success("题目上传成功");
          this.exerciseForm.reset();
          this.exampleForm.reset();
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
          this.uploadExercise.exerciseCode = '';
          this.uploadExercise.exerciseLabel = '';
          this.labelValue=[];
          this.loadData();
        }
      });
    } else {
      alert("请先上传文件");
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
    this.uploadExerciseVisible=true;
    // document.getElementById("uploadExercise").style.display = "block"
  }

  closeModal() {
    this.uploadExerciseVisible = false;
  }

  validateExercise() {
    if(this.exerciseForm.valid) {
      this.next();
    } else {
      for (const i in this.exerciseForm.controls) {
        this.exerciseForm.controls[i].markAsDirty();
        this.exerciseForm.controls[i].updateValueAndValidity();
      }
    }
  }

  // 验证题目说明表单模块
  validateExample() {
    this.exampleInputValue = this.uploadExercise.exerciseInputExample.split(' ');
    this.exampleOutputValue = this.uploadExercise.exerciseOutputExample.split(' ');
    if(this.exampleForm.valid ) {
      if(this.exampleInputValue.length === this.exampleOutputValue.length) {
        this.next();
      } else {
        alert("请确保输入样例和输出样例的个数一致，用空格分隔");
      }

    } else {
      for (const i in this.exampleForm.controls) {
        this.exampleForm.controls[i].markAsDirty();
        this.exampleForm.controls[i].updateValueAndValidity();
      }
    }
  }

  beforeUpload = (file: File) => {
    let length = file.name.length -4;



    return new Observable((observer: Observer<boolean>) => {
      const isZip = file.type === 'application/x-zip-compressed';
      if (!isZip) {
        this.msg.error('只能够上传zip压缩包!');
        observer.complete();
        return;
      }

      if (length > 50) {
        this.msg.error('文件名称过长');
        observer.complete();
        return;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.msg.error('文件大小不能超过10M');
        observer.complete();
        return;
      }
      this.uploadExercise.exerciseFileName = file.name;
      console.log(this.uploadExercise.exerciseFileUrl)
      observer.next(isZip && isLt10M);
      observer.complete();
    });
  };


  handleChange({ file, fileList }: { [key: string]: any }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done' && file.response!=null) {
      this.uploadExercise.exerciseFileName = file.name;
      this.uploadExercise.exerciseFileUrl = "D:\\compileFiles\\"+file.response+file.name;
      console.log(this.uploadExercise.exerciseFileName)
      console.log(this.uploadExercise.exerciseFileUrl)
      this.msg.success(`${file.name} 文件上传成功.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} 文件上传失败.`);
    }
  }
}
