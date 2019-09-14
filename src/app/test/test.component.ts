import { Component, OnInit } from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  // 2. 定义CodeMirror组件所需要的变量

  code: any = ''; // 双向绑定，获取输入的sql语句

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
}
