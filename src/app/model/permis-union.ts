export class PermisUnion {

  parentPermisList: [{
  permisId: null,
  permisParentId: null,
  permisName: null,
  permisNameValue: null,
  permisType: null,
  permisIcon: null,
  permisUrl: null,
  permisDescription: null,
  childrenPermisList: [{
    permisId: null,
    permisParentId: null,
    permisName: null,
    permisNameValue: null,
    permisType: null,
    permisIcon: null,
    permisUrl: null,
    permisDescription: null
  }]
}];

  // 所有权限值
  permisAll: string[];

 getData(res:any) {
  this.parentPermisList = res;
  let i:number;
  let j:number;
  let temp: string[] = new Array();
  for (i=0; i<this.parentPermisList.length; i++) {
    temp.push(this.parentPermisList[i].permisNameValue);
      for (j=0; j<this.parentPermisList[i].childrenPermisList.length; j++) {
        temp.push(this.parentPermisList[i].childrenPermisList[j].permisNameValue);
      }
  }
  this.permisAll = temp;
  }


}
