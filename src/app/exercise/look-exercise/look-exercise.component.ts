import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../utils/notification.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {ConstUrlService} from '../../const/const-url.service';
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
  private  exerciseDetailPermis: string = "exercises:management:detail";     //题目查看详情权限值
  private  exerciseModifyPermis: string = "exercises:management:modify";     //修改题目权限值
  private  exerciseAddPermis: string = "exercises:management:add";     //增加题目权限值
  private  exerciseDeletePermis: string = "exercises:management:delete";     //删除题目权限值
  private judgePermis: boolean = false; //表示用户是否拥有查看详情、修改、删除题目之一的权限
  constructor(private http: HttpClient, private notify: NotificationService,
              private fb:FormBuilder, private constUrl: ConstUrlService) {

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

  ngOnInit() {
    //题目修改验证框
    this.validateForm = this.fb.group({
      exerciseName: ['', [Validators.required]],
      exerciseLabel: ['', [Validators.required]],
      exerciseWarning: ['', [Validators.required]],
      exerciseInputExample: ['', [Validators.required]],
      exerciseOutputExample: ['', [Validators.required]],
      exerciseDescription: ['', [Validators.required]]
    });
    //上传题目验证框
    this.exerciseForm = this.fb.group({
      exerciseName: ['', [Validators.required]],
      exerciseLabel: ['', [Validators.required]],
      // exerciseDifficult: ['', [Validators.required]],
      exerciseDescription: ['', [Validators.required]],
      exerciseCode: ['', [Validators.required]]
    });
    //上传题目样例验证
    this.exampleForm = this.fb.group({
      exerciseInputExample: ['', [Validators.required]],
      exerciseOutputExample: ['', [Validators.required]],
      exerciseWarning: ['', [Validators.required]]
    });
    // 判断用户是否有操作栏中任意一项的权限
    if(this.permisAll.indexOf(this.exerciseDetailPermis)>=0 ||
      this.permisAll.indexOf(this.exerciseModifyPermis)>=0 ||
      this.permisAll.indexOf(this.exerciseDeletePermis)>=0) {
      this.judgePermis = true;
    }
    this.loadData();
    this.loadLabelList();
  }

  //**********************************************************************************************//
  // 抽屉
  private visible:boolean = false;
  private data: any ={};

  //打开抽屉
  lookExerciseDetail(data: any): void {
    this.data = data;
    this.visible = true;
  }

  //关闭抽屉
  close(): void {
    this.visible = false;
  }

  // 删除题目
  deleteExercise(exerciseId: string) {
    let url:string;
    url = this.constUrl.DELETEEXERCISEURL + '?exerciseId=' + exerciseId;
    this.http.get(url, this.constUrl.httpOptions).subscribe((data:any) => {
      if(data===200) {
        this.notify.showSuccess("已删除");
        this.loadData();
      }
    })
  }

  //*********************************************************************************************//
  // 修改模态框
  private modalVisible: boolean = false;
  private modifyExerciseName: string ="";
  private modifyExerciseInput: string ="";
  private modifyExerciseOutput: string ="";
  private modifyExerciseWarning: string ="";
  private modifyExerciseDescription: string ="";
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
  private listOfSelectedValue:string[] = [];
  private modalData: any = {};
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
    this.listOfSelectedValue = [];
    for(let tt of (""+this.modalData.exerciseLabel).split(' ')){
      this.listOfSelectedValue.push(tt);
    }
    console.log(this.listOfSelectedValue)
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
      for(let tt of this.labelValue) {
        this.uploadExercise.exerciseLabel += tt +" ";
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
    this.resetUploadExercise();
  }

  validateExercise() {
    if(this.exerciseForm.valid) {
      let url:string;
      url = this.constUrl.JUDGEEXERCISENAMEURL + "?exerciseName="+this.uploadExercise.exerciseName;
      this.http.get(url, this.constUrl.httpOptions)
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
    if(this.exampleForm.valid ) {
      this.next();
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
      console.log(this.uploadExercise.exerciseFileUrl)
      observer.next(isZip && isLt10M);
      observer.complete();
    });
  };


  handleChange({ file, fileList }: { [key: string]: any }): void {
    this.uploadExercise.exerciseFileName = "";
    this.uploadExercise.exerciseFileUrl = "";
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
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
    this.uploadExercise.exerciseDifficultValue = '';
    this.uploadExercise.exerciseCode = '';
    this.uploadExercise.exerciseLabel = '';
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
}
