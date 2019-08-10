import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotificationService} from '../../utils/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {format} from "date-fns";
import {ConstUrlService} from '../../const/const-url.service';

@Component({
  selector: 'app-manage-course',
  templateUrl: './manage-course.component.html',
  styleUrls: ['./manage-course.component.css']
})
export class ManageCourseComponent implements OnInit {
  // 表格
  private loading:boolean = true;
  private pageSize: number = 10;
  private totalSize: number;
  private currentPageIndex: number = 1;
  private sysData: any[];

  //用户拥有的所有权限
  private permisAll :string[] = JSON.parse(window.sessionStorage.getItem("permisAll"));
  private  courseAddDeleteCollectionPermis: string = "education:course:addDeleteCollection";      //增加题目集权限值
  private  courseAddPermis: string = "education:course:add";       //增加课程权限值
  private  courseDeletePermis: string = "education:course:delete";     //删除课程权限值
  private judgePermis: boolean = false;
  constructor(
    private http: HttpClient,
    private notify: NotificationService,
    private fb: FormBuilder,
    private constUrl: ConstUrlService
  ) { }

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
  private loadData() {
    let url: string;
    this.loading = true;
    url = this.constUrl.GETCOURSEURL + '?page=' + this.currentPageIndex + "&size=" + this.pageSize;
    this.http.get(url,this.constUrl.httpOptions).subscribe((data:any) => {
      this.sysData = JSON.parse(JSON.stringify(data.content));
      this.totalSize = <number> data.totalElements;
      this.loading = false;
    })
  }

  ngOnInit() {
    this.loadData();
    //获取所有题目集名称
    this.http.get(this.constUrl.GETCOLLECTIONNAMEURL, this.constUrl.httpOptions)
      .subscribe((data:any)=> {
        this.collectionOptionList = data;
      })
    this.addCourseForm = this.fb.group({
      courseName:  ['',[Validators.required]],
      courseClass: ['',[Validators.required]],
    });
    this.addCollectionForm = this.fb.group({
      collectionName:  ['']
    });
    this.loadClassNameList();  //加载班级列表

    // 判断用户是否有操作栏中任意一项的权限
    if(this.permisAll.indexOf(this.courseAddDeleteCollectionPermis)>=0 ||
      this.permisAll.indexOf(this.courseDeletePermis)>=0) {
      this.judgePermis = true;
    }
  }

  //*******************************************************************************//
  // 增加课程模态框
  private addCourseModalVisible: boolean = false;
  addCourseForm: FormGroup;
  private addCourseModalData = {
    courseName: '',
    courseClass: '',
    courseLanguage: '',
    courseCreateUserName: window.sessionStorage.getItem("userName"),
    courseUserRealName: '',
    courseCreateTime: '',
  };
  private listOfSelectedClass: string[] = [];
  private listOfClasses: string[] = [];

  //弹出增加课程模态框
  showAddCourseModal(): void {
    this.addCourseModalVisible = true;
  }

  //关闭增加课程模态框
  addCourseCancel(): void {
    this.addCourseModalVisible = false;
    this.addCourseForm.reset();
  }

  // 加载班级列表
  loadClassNameList() {
    this.http.get(this.constUrl.GETCLASSURL, this.constUrl.httpOptions).subscribe((data:any)=>{
      for(let tt of data) {
        this.listOfClasses.push(""+tt);
      }
    })
  }

  //提交增加课程
  handleAddCourseOk(): void {
    for(let tt of this.listOfSelectedClass) {
      this.addCourseModalData.courseClass += tt +" ";
    }
    let length = this.addCourseModalData.courseClass.length;
    this.addCourseModalData.courseClass = this.addCourseModalData.courseClass.substring(0, length-1);
    this.addCourseModalData.courseCreateTime = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    console.log(this.addCourseModalData.courseClass);
    this.http.post(this.constUrl.ADDCOURSEURL,this.addCourseModalData).subscribe((data:any) => {
      if(data === 400) {
        alert("该课程名称已存在，请更改");
      }else {
        this.addCourseModalVisible = false;
        this.notify.showSuccess("课程创建成功");
        this.addCourseForm.reset();
        this.loadData();
      }
    })
  }

  //***********************************************************************************************//
  //增删题目集
  addCollectionVisible:boolean = false;
  addCollectionForm: FormGroup;
  collectionListValue:string[] = [];
  collectionOptionList:string[] = [];
  courseId:string = "";

  // 关闭增删题目集弹出框
  cancelAddCollection() {
    this.addCollectionVisible = false
    // this.addCollectionForm.reset();
  }

  submitAddCollection() {
    let url: string;
    url = this.constUrl.ADDDELETECOLLECTIONURL + "?courseId=" +this.courseId +"&collectionNameList="+this.collectionListValue;
    this.http.get(url, this.constUrl.httpOptions).subscribe(data=>{
      this.notify.showSuccess("题目集修改成功");
    })
    this.addCollectionVisible = false;
  }

  addCollection(courseId:string) {
    let url: string;
    this.addCollectionVisible = true;
    this.courseId = courseId;
    url = this.constUrl.GETHAVEDCOLLECTIONURL + "?courseId=" +courseId;
    this.http.get(url,this.constUrl.httpOptions)
      .subscribe((data:any)=>{
        this.addCollectionVisible = true;
        this.collectionListValue = [];
        for(let tt of data) {
          this.collectionListValue.push(tt);
        }
      })
  }

  //********************************************************************************************//
  // 删除课程
  deleteCourse(courseId: string) {
    let url:string;
    url = this.constUrl.DELETECOURSEURL +"?courseId=" + courseId;
    this.http.get(url).subscribe((data:any) => {
      if(data === 200) {
        this.notify.showSuccess("已删除");
        this.loadData();
      }
    })
  }

}
