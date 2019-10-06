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
  LOGINOUTURL = this.BASEURL + "/sys_user/logOut";    //退出登录
  //修改个人资料
  GETUSERINFOURL = this.BASEURL + "/sys_user/getUserInfo";    //获取个人资料
  MODIFYUSERINFOURL = this.BASEURL + "/sys_user/modifyUserInfo";  //修改个人资料

//修改密码
  MODIFYPWDURL = this.BASEURL + "/sys_user/modifyPwd";  //修改密码

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
  UPDATECOLLECTIONURL = this.BASEURL + "/sys_collection/update";  //修改题目集
  ADDDELETEEXERCISEURL = this.BASEURL + "/sys_collection/addExercise";  //增删题目
  GETHAVEDXERCISENAMEURL = this.BASEURL + "/sys_collection/getProgramExerciseName";  //获得题目集已有题目
  JUDGECOLLECTIONURL = this.BASEURL + "/sys_collection/judgeCollection";  //获得题目集已有题目

  //题目审核
  GETCHECKEXERCISEURL = this.BASEURL + "/sys_exercise/check";     //查询待审核的题目
  PASSEXERCISEURL = this.BASEURL + "/sys_exercise/pass";     //通过审核题目
  REFUSEEXERCISEURL = this.BASEURL + "/sys_exercise/refuse";     //拒绝审核题目

  //题目练习
  PRACTICEEXERCISEURL = this.BASEURL + "/sys_exercise/practice";  //获得学生可以练习的题目

  //题目详情
  DETAILEXERCISEURL = this.BASEURL + "/sys_exercise/practiceDetails";   //题目详细页面
  GETEXERCISETYPEURL = this.BASEURL + "/sys_exercise/getExerciseType";   //得到题目类型
  GETCOLLECTIONEXERCISEURL = this.BASEURL + "/sys_collection/getExerciseList"; //查询题目集中所有题目

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

  //代码编译
  TESTCOMPILEURL = this.BASEURL + "/compile/test";  //在线编译
  SUBMITCOMPILEURL = this.BASEURL + "/compile/submit";  //提交
  PRACTICECOMPILEURL = this.BASEURL + "/compile/practice";  //题目练习提交
  GETBLANKNUMBERURL = this.BASEURL + "/sys_exercise/getBlankNumbers";  //获得填空题有多少个空
  GETEXERCISEPRACTICECOMPILEURL = this.BASEURL + "/compile/getExercisePractice";  //查询用户曾经提交的题目练习代码

  //查看成绩
  STUDENTLOOKSCOREURL = this.BASEURL + "/score/studentLook";     //学生查看成绩
  TEACHERLOOKSCOREURL = this.BASEURL + "/score/teacherLook";     //教师查看成绩
  STUDENTDETAILSCOREURL = this.BASEURL + "/score/studentDetail";     //教师查看学生成绩详情
  TEACHERGETCLASSURL = this.BASEURL + "/score/getClass";     //获得教师管理班级
  TEACHERGETCOURSEURL = this.BASEURL + "/score/getCourse";     //获得教师所授课程
  TEACHERGETCOLLECTIONURL = this.BASEURL + "/score/getCollection";     //获得教师所授课程

  //首页
  GETSAMETEACHERUSERURL = this.BASEURL + "/sys_user/getSameTeacherUser"; //获得相同教师的班级学生
  GETBLANKUSERURL = this.BASEURL + "/user_relationship/blankModel"; //获得一个空数组
  SAVERELATIONSHIPURL = this.BASEURL + "/user_relationship/save"; //提交
  JUDGEDATEURL = this.BASEURL + "/user_relationship/judgeDate"; //判断是否能够提交

  //查看题目得分详情
  STUDENTSCOREDETAILURL = this.BASEURL + "/score/scoreDetail";     //学生查看成绩
  TEACHERSCOREDETAILURL = this.BASEURL + "/score/teacherScoreDetail";     //学生查看成绩
  constructor() { }
}
