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
    selector: 'app-jobpost',
    templateUrl: './jobpost.component.html',
    styleUrls: ['./jobpost.component.scss'],
    providers: [PagerService]
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





public responseTag: string = 'listJobPost';
public jobPostLists: any = [];
public _listByPageUrl: string = 'jobpost/getbypages/';
getListByPage(pageSize) {
  setTimeout(() => {
    this._pg.getListByPage(1, true, pageSize, '');
      setTimeout(() => {
      }, 300);
  }, 0);
}
sendToList(ev) {
  this.jobPostLists = ev;
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
    debugger
    const isChecked = event.target.checked;
    this.jobPostForm.get('isActive')?.setValue(isChecked ? true : false);
    console.log(" this.jobPostForm", this.jobPostForm)
}
  
//SKILL
  get applicantSkill(): FormArray {
    return this.jobPostForm.get('applicantSkill') as FormArray;
  }
  
  addSkill() {
    const skillGroup = this.formBuilder.group({
      applicantSkillId: null,
      jobPostId: null,
      skill: [null, Validators.required],
    }); 
  
    this.applicantSkill.push(skillGroup);
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
    console.log("this.this.jobPostForm for update",this.jobPostForm)
    debugger
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
          this.reset();
        }
      }, error => {
        console.log(error);
      });
  }





  reset() {
debugger
    this.jobPostForm.setValue({
      jbPostId: null,
      jobTitle:null,
      company: null,
      department:null,
      post:null,
      startDate: null,
      endDate: null,
      education: null,
      experience: null,
      workPlace: null,
      employeeStatus: null,
      jobLocation: null,
      criteria: null,
      address:null,
      business: null,
      salaryRange: null,
      isActive: null,
      //applicantSkill: this.formBuilder.array([]), 
      applicantSkill: this.applicantSkill.clear(),
      applicantResponsibility: this.applicantResponsibility.clear(),
      applicantRequirement: this.applicantRequirement.clear(),
      applicantOtherRequirement: this.applicantOtherRequirement.clear(),
      applicantBenifit: this.applicantBenifit.clear(),
      

    })}

//EDIT UPDATE DATA
public jobSkill:any;
public _getbyIdUrl: string = 'jobpost/getbyid';
edit(modelEvnt) {
    debugger;
    modelEvnt.event.preventDefault();
    //var param = { strId: modelEvnt.model.quotationId, strId2: modelEvnt.model.categoryId };
    var param = { strId: modelEvnt.model.jobOid, strId2: modelEvnt.model.categoryId };
    var apiUrl = this._getbyIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
        .subscribe(response => {
            this.res = response;
            console.log("this.Total data ",this.res)
            var jobSkill = JSON.parse(this.res.resdata.jobSkill);
            var benefit = JSON.parse(this.res.resdata.jobBenefit);
            var requirement = JSON.parse(this.res.resdata.jobRequirement);
            var otherRequirement = JSON.parse(this.res.resdata.jobOtherRequirement);
            var responsibilityList = JSON.parse(this.res.resdata.jobResponsibility);
            this.updateSkill(jobSkill);
            this.updateBenefit(benefit)
            this.updateRequirement(requirement)
            this.updateOtherRequirement(otherRequirement)
            this.updateResponsiboility(responsibilityList)
            console.log("this.jobSkill ",jobSkill)
            if (this.res.resdata.jobPostMaster != '') {
              var jobPost = JSON.parse(this.res.resdata.jobPostMaster)[0];
            
              console.log("this.jobPost",jobPost)
              debugger;
              this.jobPostForm.setValue({
                jbPostId: jobPost.jbPostId,
                jobTitle: jobPost.jobTitle,
                company: jobPost.company,
                department:jobPost.department,
                post: jobPost.post,
                startDate: jobPost.startDate == null ? null : this.getNameToNumDate(jobPost.startDate),
                //startDate:jobPost.startDate,
                //endDate: jobPost.endDate,
                endDate: jobPost.endDate == null ? null : this.getNameToNumDate(jobPost.endDate),
                education: jobPost.education,
                experience: jobPost.experience,
                workPlace: jobPost.workPlace,
                employeeStatus: jobPost.employeeStatus,
                jobLocation: jobPost.jobLocation,
                criteria:jobPost.criteria,
                address: jobPost.address,
                business: jobPost.business,
                salaryRange: jobPost.salaryRange,
                isActive: jobPost.isActive === 0? false:true,
                applicantSkill: this.formBuilder.array([]), 
                applicantResponsibility: this.formBuilder.array([]),
                applicantRequirement: this.formBuilder.array([]),
                applicantOtherRequirement: this.formBuilder.array([]),
                applicantBenifit: this.formBuilder.array([]),

              });
              console.log("this.this.jobPostForm",this.jobPostForm)
          }
            this.reset();
           
        
        }, error => {
            console.log(error);
        });

      
}


// for update Skill
updateSkill(jobSkill: any[]) {
this.clearApplicantSkills();
debugger;
jobSkill.forEach(skill => {
   var skillGroup = this.formBuilder.group({
    applicantSkillId: skill.skillOid,
    jobPostId: skill.jbPostId,
    skill: skill.skill,
  });
  this.applicantSkill.push(skillGroup);
});
}
clearApplicantSkills() {
while (this.applicantSkill.length !== 0) {
  this.applicantSkill.removeAt(0);
}
}

//UPDATE BENEFIT
updateBenefit(benefit: any[]) {
this.clearApplicantBenefit();
debugger;
benefit.forEach(bnft => {
   var benefitGroup = this.formBuilder.group({
    applicantBenefitsId: bnft.benefitOid,
    jobPostId: bnft.jbPostId,
    benefits: bnft.benefits,
  });
  this.applicantBenifit.push(benefitGroup);
});
}
clearApplicantBenefit() {
while (this.applicantBenifit.length !== 0) {
  this.applicantBenifit.removeAt(0);
}
}

//UPDATE REQUIREMENT
updateRequirement(requirement: any[]) {
this.clearApplicantRequirement();
debugger;
requirement.forEach(req => {
   var reqGroup = this.formBuilder.group({
    applicantRequirementId: req.requirementOid,
    jobPostId: req.jbPostId,
    requirement: req.requirement,
  });
  this.applicantRequirement.push(reqGroup);
});
}
clearApplicantRequirement() {
while (this.applicantRequirement.length !== 0) {
  this.applicantRequirement.removeAt(0);
}
}

//UPDATE OTHER REQUIREMENT
updateOtherRequirement(otherReq: any[]) {
this.clearApplicantOtherRequirement();

otherReq.forEach(otherReq => {
   var skillGroup = this.formBuilder.group({
    applicantOtherRequirementId: otherReq.OtherRequirementOid,
    jobPostId: otherReq.jbPostId,
    requirement: otherReq.otherRequirement,
  });
  this.applicantOtherRequirement.push(skillGroup);
});
}
clearApplicantOtherRequirement() {
while (this.applicantOtherRequirement.length !== 0) {
  this.applicantOtherRequirement.removeAt(0);
}
}

//UPDATE RESPONSIBILITY
updateResponsiboility(responsibility: any[]) {
this.clearesponsiboility();
responsibility.forEach(res => {
   var responsibilityGroup = this.formBuilder.group({
    applicantResponId: res.responsibilityOid,
    jobPostId: res.jbPostId,
    responsibility: res.responsibility,
  });
  this.applicantResponsibility.push(responsibilityGroup);
});
}
clearesponsiboility() {
while (this.applicantResponsibility.length !== 0) {
  this.applicantResponsibility.removeAt(0);
}
}
 



 
}