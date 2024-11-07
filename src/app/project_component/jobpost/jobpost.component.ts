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

declare var $: any;

@Component({
    selector: 'app-jobpost',
    templateUrl: './jobpost.component.html',
    styleUrls: ['./jobpost.component.scss'],
    //providers: [Conversion]
})

export class JobPostComponent implements OnInit {
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


  constructor(public appSettings:AppSettings, 
    private _pathValidation: pathValidation,
    private formBuilder: FormBuilder,
    public fb: FormBuilder, 
    public router:Router, 
    public _apiService : ApiService, 
    private toastr: ToastrService,
    private _dataservice:DataService, 
    @Inject(DOCUMENT) private document: any
    ){
      //this.options = this._pathValidation.ngSelect2Option();
     this.settings = this.appSettings.settings;
     this.cmnEntity = this._pathValidation.rowEntities();
     

 
  }
  

  ngOnInit(){
    this.createForm();
  
  }
  cmnbtnAction(evmodel) {
    debugger
    this[evmodel.func](evmodel);
}

showHide() {
    debugger;
    this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
}

setToggling(divName) {
  debugger;
  if (divName == 'Master') {
    this.isToggleMaster = this.isToggleMaster ? false : true;
  }


}




public jobPostList: any = [];
public jobPostLists: any = [];
public _listByPageUrl: string = 'jobpost/getbypages';
getListByPage(pageSize) {

  this.getListByPages(1, true, pageSize, '');

}
getListByPages(pageIndex: number, isPaging: boolean, pageSize, searchVal: string) {
       
  this.settings.loadingSpinnerOnAction = true;
  this.pageSize=parseInt(pageSize);
  var param = {
      pageNumber: pageIndex
      , pageSize: this.pageSize
      , isPaging: isPaging
      , searchVal: searchVal
      , loggedUserId: this.loggedUserId
      
  };
  this._dataservice.getWithMultipleModel_Sync(this._listByPageUrl, param)

      .then(
          response => {
            this.res = response;
            console.log("   this.response", this.res)
              this.itemListByPage = JSON.parse(this.res.resdata.listJobPost);
              this.jobPostList=this.itemListByPage;
          
              console.log("   this.response", this.jobPostList)
              if (this.jobPostList.length > 0) {
                this.jobPostList.forEach((item, index) => {
                    item.isActive = item.isActive == '1' ? true : false;
                });
    
                this.jobPostLists = this.jobPostList;
           
            }
        
          }, error => {
              console.log(error);
          }
      );
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

  onCheckboxChange(event: any) {
    const isChecked = event.target.checked;
    this.jobPostForm.get('isActive')?.setValue(isChecked ? true : false);
}
  
//SKILL
  get applicantSkill(): FormArray {
    return this.jobPostForm.get('applicantSkill') as FormArray;
  }
  //
  addSkill() {
    const experienceGroup = this.formBuilder.group({
      applicantSkillId: null,
      jobPostId: null,
      skill: [null, Validators.required],
    }); 
  
    this.applicantSkill.push(experienceGroup);
    console.log("this.applicantSkill.",this.applicantSkill)
  }
  
  
  removeSkill(index: number) {
    this.applicantSkill.removeAt(index);
  }



//RESPONSIBILITY
  get applicantResponsibility(): FormArray {
    return this.jobPostForm.get('applicantResponsibility') as FormArray;
  }
  
  addResponsibility() {
    const ResponsibilityGroup = this.formBuilder.group({
      applicantResponId: null,
      jobPostId: null,
      responsibility: [null, Validators.required],
    });
  
    this.applicantResponsibility.push(ResponsibilityGroup);
  }
  
  removeResponsibility(index: number) {
    this.applicantResponsibility.removeAt(index);
  }


//REQUIREMRNT
  get applicantRequirement(): FormArray {
    return this.jobPostForm.get('applicantRequirement') as FormArray;
  }
  
  addRequirement() {
    const RequirementGroup = this.formBuilder.group({
      applicantRequirementId: null,
      jobPostId: null,
      requirement: [null, Validators.required],
    });
  
    this.applicantRequirement.push(RequirementGroup);
  }
  
  removeRequirement(index: number) {
    this.applicantRequirement.removeAt(index);
  }



//OTHER REQUIREMENT
  get applicantOtherRequirement(): FormArray {
    return this.jobPostForm.get('applicantOtherRequirement') as FormArray;
  }
  
  addOtherRequirement() {
    const OtherRequirementGroup = this.formBuilder.group({
      applicantOtherRequirementId: null,
      jobPostId: null,
      requirement: [null, Validators.required],
    });
  
    this.applicantOtherRequirement.push(OtherRequirementGroup);
  }
  
  removeOtherRequirement(index: number) {
    this.applicantOtherRequirement.removeAt(index);
  }



//BENIFIT
  get applicantBenifit(): FormArray {
    return this.jobPostForm.get('applicantBenifit') as FormArray;
  }
  
  // Add new work experience form group
  addBenifit() {
    const BenifitGroup = this.formBuilder.group({
      applicantBenefitsId: null,
      jobPostId: null,
      benefits: [null, Validators.required],
    });
  
    this.applicantBenifit.push(BenifitGroup);
  }
  
  // Remove work experience by index
  removeBenifit(index: number) {
    this.applicantBenifit.removeAt(index);
  }







  public _saveUrl: string = 'jobpost/saveupdate';
  onSubmit(): void {
    let formValues = { ...this.jobPostForm.value };
    delete formValues.applicantSkill;
    delete formValues.applicantResponsibility;
    delete formValues.applicantRequirement;
    delete formValues.applicantOtherRequirement;
    delete formValues.applicantBenifit;
    
    const jobPostform = formValues;
    const appSkill = this.applicantSkill.value;

    const appResponsibility = this.applicantResponsibility.value;
    const appRequirement = this.applicantRequirement.value;
    console.log("appRequirement",appRequirement)
    const appOtherRequirement = this.applicantOtherRequirement.value;
    const appBenifit = this.applicantBenifit.value;
  
 
    
    const param = { 
      loggedUserId: this.loggedUserId, 
      strId: this.jobPostForm.controls.jbPostId.value, 
      strId2: this.userID 
    };
    
    const ModelsArray = [param, [jobPostform], appSkill, appResponsibility,appRequirement,appOtherRequirement,appBenifit];
    console.log("ModelsArray",ModelsArray)
    this._dataservice.postMultipleModel(this._saveUrl, ModelsArray)
      .subscribe(response => {
        this.res = response;
        this.resmessage = this.res.resdata.message;
        if (this.res.resdata.resstate) {
          this._msg.success(this.resmessage);
          //this.reset();
        }
      }, error => {
        console.log(error);
      });
  }





  reset() {

    this.jobPostForm.setValue({
        quotationId: null,




    })}






 
}