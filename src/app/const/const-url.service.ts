import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConstUrlService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  BASEURL = "apidata";
  LOGINURL = this.BASEURL + "/login";    //登录

  //我的课程
  GETCOURSEURL = this.BASEURL + "/sys_course/get";   //查询课程
  ADDCOURSEURL = this.BASEURL + "/sys_course/add";   //增加课程
  ADDDELETECOLLECTIONURL = this.BASEURL + "/sys_course/addCollection";  // 增删题目集
  DELETECOURSEURL = this.BASEURL + "/sys_course/delete";    //删除课程
  GETHAVEDCOLLECTIONURL = this.BASEURL + "/sys_course/getCollectionName";  //查询课程已有题目集
  GETCLASSURL = this.BASEURL + "/sys_course/getClassName";  //获得班级列表
  GETCOLLECTIONNAMEURL = this.BASEURL + "/sys_collection/getCollectionName";  //获得所有题目集名称

  //查看题库
  GETEXERCISEURL = this.BASEURL + "/sys_exercise/get";    //查询题库
  DELETEEXERCISEURL = this.BASEURL + "/sys_exercise/delete";  //删除题目
  MODIFYEXERCISEURL = this.BASEURL + "/sys_exercise/modify";  //修改题目
  GETEXERCISLABELEURL = this.BASEURL + "/exercise_label/get"; //获得所有题目标签
  ADDEXERCISEURL = this.BASEURL + "/sys_exercise/add";  //增加题目
  JUDGEEXERCISENAMEURL = this.BASEURL + "/sys_exercise/judgeExerciseName";  //判断题目名称是否已经存在
  DYNAMICGETGETEXERCISEURL = this.BASEURL + "/sys_exercise/dynamicGet";   //动态查询题目

  //题目集
  GETEXERCISENAMEURL = this.BASEURL + "/sys_exercise/getName";     //获得所有题目名称
  GETCOLLECTIONURL = this.BASEURL + "/sys_collection/get"; //查询题目集
  DELETECOLLECTIONURL = this.BASEURL + "/sys_collection/delete";   //删除题目集
  ADDCOLLECTIONURL = this.BASEURL + "/sys_collection/add";  //增加题目集
  ADDDELETEEXERCISEURL = this.BASEURL + "/sys_collection/addExercise";  //增删题目
  GETHAVEDXERCISENAMEURL = this.BASEURL + "/sys_collection/getExerciseName";  //获得题目集已有题目

  //题目审核
  GETCHECKEXERCISEURL = this.BASEURL + "/sys_exercise/check";     //查询待审核的题目
  PASSEXERCISEURL = this.BASEURL + "/sys_exercise/pass";     //通过审核题目
  REFUSEEXERCISEURL = this.BASEURL + "/sys_exercise/refuse";     //拒绝审核题目

  //题目练习
  PRACTICEEXERCISEURL = this.BASEURL + "/sys_exercise/practice";  //获得学生可以练习的题目

  //题目详情
  DETAILEXERCISEURL = this.BASEURL + "/sys_exercise/practiceDetails"   //题目详细页面

  //查看用户
  GETUSERURL = this.BASEURL + "/sys_user/get";
  RESETPASSWORDUSERURL = this.BASEURL + "/sys_user/resetPassword";
  DELETEUSERURL = this.BASEURL + "/sys_user/delete";
  ADDUSERURL = this.BASEURL + "/sys_user/add";
  FILESTUDENTEXCELURL = this.BASEURL + "/file/studentExcel";
  GETROLEURL = this.BASEURL + "/role/get";
  JUDGEUSERNAMEUSERURL = this.BASEURL + "/sys_user/judgeUserName";
  JUDGEUSERNUMBERUSERURL = this.BASEURL + "/sys_user/judgeUserNumber";

  //配置权限
  GETROLELISTURL = this.BASEURL + "/permis/getRole";   //查询比自己角色值小的角色
  GETPERMISURL = this.BASEURL + "/permis/getPermis"    //获取权限
  GETROLEPERMISURL = this.BASEURL + "/permis/rolePermis"    //获取角色已有权限
  MODIFYPERMISURL = this.BASEURL + "/permis/modify"    //修改角色权限

  //查看日志
  GETLOGURL = this.BASEURL + "/log/get";  //查询日志
  constructor() { }
}