import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Options } from 'select2';
import { fontModel } from './fontModel';
import { jsPDF } from 'jspdf';
import { Console } from 'console';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/api/user';
import { CommonService } from 'src/app/theme/components/commonservice/commonservice.component';
import { CommonPager } from 'src/app/theme/components/commonpager/commonpager';
import { ReportViewer } from '../reportviewer/reportviewer';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';
import { DataService } from 'src/app/api/api.dataservice.service';
import { PagerService } from 'src/app/api/api.pager.service';
import { Conversion } from 'src/app/api/api.conversion.service';

declare var $: any;

@Component({
    selector: 'app-apply',
    templateUrl: './apply.component.html',
    styleUrls: ['./apply.component.scss'],
    providers: [PagerService]
    //providers: [Conversion]
})

export class ApplyComponent implements OnInit {
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
  @ViewChild(ReportViewer) _rptViewer: ReportViewer;
  public settings: Settings;
  public options: Options;
  private userID = sessionStorage.getItem("userID");
  public loggedUserId: string = sessionStorage.getItem("userID");
  public cmnEntity: any = {};
  public isToggleMaster: boolean = true;
  public res: any;
  public resmessage: string;
  public jobPostForm: FormGroup;
  public pageSize: number = 10;
  public listJobPost: any;
  public itemListByPage: any = [];
  public  jobPostList:any;


  constructor(public appSettings:AppSettings, 
    private _pathValidation: pathValidation,
    private formBuilder: FormBuilder,
    public fb: FormBuilder, 
    //private _conversion: Conversion,
    public router:Router, 
    public _apiService : ApiService, 
    private toastr: ToastrService,
    private _dataservice:DataService, 
    @Inject(DOCUMENT) private document: any
    ){
      //this.options = this._pathValidation.ngSelect2Option();
     this.settings = this.appSettings.settings;
     this._pathValidation.validate(this.document.location);
     this.cmnEntity = this._pathValidation.rowEntities();
     

 
  }
  
  getNameToNumDate(strDate: string) {
    debugger;
    var nDate = new Date(strDate);
    var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
    return Nowdate;
    
}
  ngOnInit(){
    this.getList();
   // this.createForm();
    //this.getListByPage(this.pageSize);

  
  }
  cmnbtnAction(evmodel) {
    debugger
    this[evmodel.func](evmodel);
}

showHide() {
    debugger;
   // this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
}

setToggling(divName) {
  debugger;
  if (divName == 'Master') {
    this.isToggleMaster = this.isToggleMaster ? false : true;
  }


}











public _getbyListIdUrl: string = 'jobpost/getbylist';
getList() {
    var param = {strid:this.userID};
    var apiUrl = this._getbyListIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
        .subscribe(response => {
            this.res = response;
            this.jobPostList = JSON.parse(this.res.resdata.listJobPost);
            console.log("this.Total data LLLLLLLLLLLLLLLLLLLLLLLLLLL ", this.jobPostList)
        
         
          
            console.log("this.this.jobPostForm",this.jobPostForm)
        
        }, error => {
            console.log(error);
        });
}








  createForm() {
    this.jobPostForm = this.formBuilder.group({
      jbPostId: null,
      jobTitle: new FormControl(null, Validators.required),
      company: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      post: new FormControl(null, Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    
      education: new FormControl(null, Validators.required),
      experience: new FormControl(null, Validators.required),
      workPlace: new FormControl(null, Validators.required),
      employeeStatus: new FormControl(null, Validators.required),
      jobLocation: new FormControl(null, Validators.required),
      criteria: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      business: new FormControl(null, Validators.required),
      salaryRange: new FormControl(null, Validators.required),
      isActive: true,
      applicantSkill: this.formBuilder.array([]), 
      applicantResponsibility: this.formBuilder.array([]),
      applicantRequirement: this.formBuilder.array([]),
      applicantOtherRequirement: this.formBuilder.array([]),
      applicantBenifit: this.formBuilder.array([]),
      

    });
    
  }

  public _getbyIdUrl: string = 'jobpost/getbyid';
  showDetails(modelEvnt) {
      debugger;
      console.log("modelEvnt",modelEvnt)
      //modelEvnt.event.preventDefault();
      //var param = { strId: modelEvnt.model.quotationId, strId2: modelEvnt.model.categoryId };
      var param = { strId: modelEvnt.jobOid, strId2: modelEvnt.jobOid };
      var apiUrl = this._getbyIdUrl
      this._dataservice.getWithMultipleModel(apiUrl, param)
          .subscribe(response => {
              this.res = response;
              console.log("this.Total data ",this.res)
        
           

              console.log("this.this.jobPostForm",this.jobPostForm)
          
          }, error => {
              console.log(error);
          });
  }



  

 
























 


 



 
}