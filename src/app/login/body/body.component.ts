import { Component, OnInit } from '@angular/core';
import {LoginRequestService} from '../login-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  message: string;
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
  user = {
    userName: '',
    password: ''
  };
  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log("validateForm.valid : ", this.validateForm.valid)
    if (this.validateForm.valid) {
      this.loginService.init(this.user);
    }
  }
  constructor(private loginService: LoginRequestService, private fb: FormBuilder) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

}
