import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {differenceInCalendarDays, format} from 'date-fns';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../utils/notification.service';
import {ConstUrlService} from '../../const/const-url.service';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-manage-collection',
  templateUrl: './manage-collection.component.html',
  styleUrls: ['./manage-collection.component.css']
})
export class ManageCollectionComponent implements OnInit {

   loading:boolean=true;
   totalSize: number;
   currentPageIndex: number=1;
   pageSize: number = 10;
   sysData: any[];
   courseId:string=null;
  //用户拥有的所有权限
   permisAll :string[] = JSON.parse(window.sessionStorage.getItem("permisAll"));
   collectionAddPermis: string = "exercises:collection:add";     //创建题目集权限
   collectionDeletePermis: string = "exercises:collection:delete";     //删除题目集权限
   collectionAddDeleteExercisePermis: string = "exercises:collection:addDeleteExercise";     //增删题目权限
   judgePermis: boolean = false; //表示用户是否拥有删除题目集、增删题目之一的权限
  currentTime = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  constructor(private http: HttpClient, private notify: NotificationService,
              private fb:FormBuilder,  private route: ActivatedRoute,
              private constUrl: ConstUrlService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId');
    });
    console.log(this.courseId)
    this.loadData();
    //获取所有题目名称
    this.http.get(this.constUrl.GETEXERCISENAMEURL+"?exerciseType=1", this.constUrl.httpOptions)
      .subscribe((data:any)=> {
        this.exerciseOptionList = data;
      })
    //上传题目验证框
    this.addCollectionForm = this.fb.group({
      collectionName: ['', [Validators.required]],
      collectionStartTime: ['', [Validators.required]],
      collectionEndTime: ['', [Validators.required]],
      collectionRate: ['', [Validators.required]]
    });
    // 添加题目
    this.addExerciseForm = this.fb.group({
      exerciseName: [''],
      exerciseType: ['']
    });

    // 判断用户是否有操作栏中任意一项的权限
    if(this.permisAll.indexOf(this.collectionDeletePermis)>=0 ||
      this.permisAll.indexOf(this.collectionAddDeleteExercisePermis)>=0) {
      this.judgePermis = true;
    }
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

  loadData() {
    let url: string;
    this.loading=true;
    url = this.constUrl.GETCOLLECTIONURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize+ "&courseId=" + this.courseId;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading=false;
    })
  }

  //删除
  deleteCollection(collectionId: string) {
    this.http.get(this.constUrl.JUDGECOLLECTIONURL + "?collectionId=" + collectionId, this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        if(data === 200) {
          this.http.get(this.constUrl.DELETECOLLECTIONURL + "?collectionId="+collectionId, this.constUrl.httpOptions)
            .subscribe(data=>{
              this.notify.showSuccess("题目集删除成功");
              this.loadData();
            })
        }else {
          alert("该题目集已被添加到课程中，不可删除");
        }
      })

  }

  // ****************************************************************************************************

  addModalVisible: boolean = false;
  addCollectionForm: FormGroup;
  addCollectionData = {
    collectionName: '',
    collectionStartTime: null,
    collectionEndTime: null,
    collectionRate: 10,
    collectionCreateUserName: window.sessionStorage.getItem("userName")
  }
  today = new Date();
  endOpen = false;
  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');
  cancelAddCollection() {
    this.addModalVisible = false;
    this.addCollectionForm.reset();
  }

  submitAddCollection() {
    if(this.addCollectionForm.valid) {
      this.addCollectionData.collectionStartTime = format(this.addCollectionData.collectionStartTime, 'YYYY-MM-DD HH:mm:ss');
      this.addCollectionData.collectionEndTime = format(this.addCollectionData.collectionEndTime, 'YYYY-MM-DD HH:mm:ss');
      this.http.post(this.constUrl.ADDCOLLECTIONURL, this.addCollectionData,this.constUrl.httpOptions)
        .subscribe(data=>{
          if(data===400) {
            alert("该实验名称已存在，请更改");
          }else {
            this.addModalVisible = false;
            this.notify.showSuccess("题目集创建成功");
            this.addCollectionForm.reset();
            this.loadData();
          }
        })
    } else {
      for (const i in this.addCollectionForm.controls) {
        this.addCollectionForm.controls[i].markAsDirty();
        this.addCollectionForm.controls[i].updateValueAndValidity();
      }
    }

  }

  addCollection() {
    this.addCollectionData.collectionRate = 10;
    this.addModalVisible = true;
  }


  disabledStartDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.addCollectionData.collectionStartTime) {
      return false;
    }
    return endValue.getTime() < this.addCollectionData.collectionStartTime.getTime();
  };

  onStartChange(date: Date): void {
    this.addCollectionData.collectionStartTime = date;
  }

  onEndChange(date: Date): void {
    this.addCollectionData.collectionEndTime = date;
  }
  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }


  // **********************************************************************************************
  // 增加题目
  collectionExercise = {
    collectionId: '',
    exerciseListValue: [],
    exerciseType: 1,
  };
  exerciseTypeValue:string = "";
  listOfType: string[] = ["编程题","单选题","判断题","填空题","多选题", "主观题"];
  addExerciseVisible:boolean = false;
  addExerciseForm: FormGroup;
  // exerciseListValue:string[] = [];
  exerciseOptionList:string[] = [];
  cancelAddExercise() {
    this.addExerciseVisible = false
    // this.addExerciseForm.reset();
  }

  submitAddExercise() {
    this.http.post(this.constUrl.ADDDELETEEXERCISEURL, this.collectionExercise,
      this.constUrl.httpOptions).subscribe(data=>{
        this.addExerciseVisible = false;
        this.notify.showSuccess("题目个数修改成功");
    })
  }

  addExercise(data:any) {
    if(this.currentTime > data.collectionStartTime) {
      alert("实验已经开始或结束，不能进行更改！");
    }else {
      this.exerciseTypeValue = this.listOfType[0];
      this.collectionExercise.collectionId = data.collectionId;
      this.http.get(this.constUrl.GETHAVEDXERCISENAMEURL + '?collectionId='+ data.collectionId+"&exerciseType=1",this.constUrl.httpOptions)
        .subscribe((data:any)=>{
          this.addExerciseVisible = true;
          this.collectionExercise.exerciseListValue = [];
          for(let tt of data) {
            this.collectionExercise.exerciseListValue.push(tt);
          }
        })
    }
  }

  exerciseTypeChange($event: any) {
    if(this.exerciseTypeValue=="编程题") {
      this.collectionExercise.exerciseType = 1;
    } else if(this.exerciseTypeValue=="单选题") {
      this.collectionExercise.exerciseType = 2;
    } else if(this.exerciseTypeValue=="判断题") {
      this.collectionExercise.exerciseType = 3;
    } else if(this.exerciseTypeValue=="填空题") {
      this.collectionExercise.exerciseType = 4;
    } else if(this.exerciseTypeValue=="多选题") {
      this.collectionExercise.exerciseType = 5;
    } else {
      this.collectionExercise.exerciseType = 6;
    }
    this.http.get(this.constUrl.GETHAVEDXERCISENAMEURL + '?collectionId='+ this.collectionExercise.collectionId+"&exerciseType=" + this.collectionExercise.exerciseType,this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        this.collectionExercise.exerciseListValue = [];
        for(let tt of data) {
          this.collectionExercise.exerciseListValue.push(tt);
        }
      })

    this.http.get(this.constUrl.GETEXERCISENAMEURL+"?exerciseType="+this.collectionExercise.exerciseType, this.constUrl.httpOptions)
      .subscribe((data:any)=> {
        this.exerciseOptionList = [];
        this.exerciseOptionList = data;
      })
  }
}
