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
  public requirementForm: FormGroup;
  public pageSize: number = 10;
  public listJobPost: any;
  public itemListByPage: any = [];
  public jobPostList:any;
  public skillList:any;
  public benifitList:any;
  public requirementList:any;
  public otherRequirementList:any;
  public responsibilityList:any;
  public masterList:any;
  public masterDiv:boolean=true;
  public detailDiv:boolean=false;
  public applyForm:boolean=false
  bloodGroupList:string[]=['A+','B+','O+',"AB+",'A-','B-','O-',"AB-"];
  qualificationType: string[] = ['JSC', 'SSC', 'HSC', 'BSC', 'MSC', 'PhD']; 
  WorkOrderStatus: Array<{ value: string, label: string }> = [
    { value: '1', label: 'Work Order InComing' },
    { value: '0', label: 'Work Order  OutGoing' },
  ];
  genderList:string[]=['Male','Female','Other'];
  maritialStatusList:string[]=['Married','Unmarried'];
  religionList: string[] = ['Islam', 'Hindu', 'Christianity', 'Buddhism', 'Other'];
  image: FileList | null = null;
  signature: FileList | null = null;
  cv: FileList | null = null;
  selectedFiles:FileList | null = null;
  binaryString:any



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
    this.createForm();
    this.addInitialAcademicQualifications();
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


createForm() {
  this.requirementForm = this.formBuilder.group({
    applicantId: null,
    jobTitle: new FormControl(null, Validators.required),
    company: new FormControl(null, Validators.required),
    department: new FormControl(null, Validators.required),
    appliedPost: new FormControl(null, Validators.required),
    mobileNumber: new FormControl(null, Validators.required),
    //campaign: new FormControl(null, Validators.required),
    name: new FormControl(null, Validators.required),
    fatherName: new FormControl(null, Validators.required),
    motherName: new FormControl(null, Validators.required),
    nid: new FormControl(null, Validators.required),
    dateOfBirth: new FormControl(null, Validators.required),
    birthPlace: new FormControl(null, Validators.required),
    relegion: new FormControl(null, Validators.required),
    bloodGroup: new FormControl(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    maritialStatus: new FormControl(null, Validators.required),
    spouseName: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
  
    isActive: new FormControl(null, Validators.required),
    preAddDivision: new FormControl(null, Validators.required),
    preAddDistrict: new FormControl(null, Validators.required),
    preAddThana: new FormControl(null, Validators.required),
    preAddPostOffice: new FormControl(null, Validators.required),
    preAddVillage: new FormControl(null, Validators.required),
    parAddDivision: new FormControl(null, Validators.required),
    parAddDistrict: new FormControl(null, Validators.required),
    parAddThana: new FormControl(null, Validators.required),
    parAddPostOffice: new FormControl(null, Validators.required),
    parAddVillage: new FormControl(null, Validators.required),
    expectedSelery: new FormControl(null, Validators.required),
    appliedBy: new FormControl(null, Validators.required),
   
   
    companyDeptPost: new FormControl(null, Validators.required),
    companyDeptPostOpnDate: new FormControl(null, Validators.required),
    companyDeptPostActvStatus: new FormControl(null, Validators.required),
    imagePath: new FormControl(null, Validators.required),
    signaturePath: new FormControl(null, Validators.required),
    cvPath: new FormControl(null, Validators.required),
    academicQualifications: this.formBuilder.array([]),
    workExperiences: this.formBuilder.array([]), 

    
  });
  
}

async onSubmit(): Promise<void> {
  try {
    await this.uploadImages();
    await this.uploadSignature();
    await this.uploadCV();
    this.onSubmitFileForm();
  } catch (error) {
    console.error("File upload sequence failed.", error);
  }
}


onFileChange(event: any): void {
  this.image = event.target.files;  
}

OnSignatureChange(event: any): void {
  this.signature = event.target.files;  
}

OnCvChange(event: any): void {
  this.cv = event.target.files;  
}

// Upload image with async/await
async uploadImages(): Promise<void> {
  return new Promise((resolve, reject) => {
    this._dataservice.uploadFile(this.image).subscribe(
      response => {
        this.requirementForm.controls.imagePath.setValue(response.data[0]);
        resolve(); 
      },
      error => {
        console.error(error);
        alert('Image upload failed. Please try again.');
        reject(error); 
      }
    );
  });
}

// Upload signature with async/await
async uploadSignature(): Promise<void> {
  return new Promise((resolve, reject) => {
    this._dataservice.uploadFile(this.signature).subscribe(
      response => {
        this.requirementForm.controls.signaturePath.setValue(response.data[0]);
        resolve(); 
      },
      error => {
        console.error(error);
        alert('Signature upload failed. Please try again.');
        reject(error); 
      }
    );
  });
}

// Upload CV with async/await
async uploadCV(): Promise<void> {
  return new Promise((resolve, reject) => {
    this._dataservice.uploadFile(this.cv).subscribe(
      response => {
        this.requirementForm.controls.cvPath.setValue(response.data[0]);
        resolve(); 
      },
      error => {
        console.error(error);
        alert('CV upload failed. Please try again.');
        reject(error); 
      }
    );
  });
}

public _saveUrl: string = 'reqform/saveupdate11';
onSubmitFileForm(): void {
  let formValues = { ...this.requirementForm.value };
  delete formValues.academicQualifications;
  delete formValues.workExperiences;
  console.log("formValues",formValues)
  const reqform = formValues;
  const acaQlf = this.academicQualifications.value;
  const wrkExp = this.workExperiences.value;
  
  const param = { 
    loggedUserId: this.userID,
    strId: this.requirementForm.controls.applicantId.value, 
    strId2: this.userID 
  };
  
  const ModelsArray = [param, [reqform], acaQlf, wrkExp];
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


get academicQualifications(): FormArray {
  return this.requirementForm.get('academicQualifications') as FormArray;
}

// Add initial academic qualifications
addInitialAcademicQualifications() {
  for (let i = 0; i < 3; i++) {
    this.addAcademicQualification();
  }
}

// Add a new academic qualification FormGroup to the FormArray
addAcademicQualification() {
  const qualificationGroup = this.formBuilder.group({
    acQlfId: null,
    applicantId: null,
    degree: ['', Validators.required],
    board: ['', Validators.required],
    institution: ['', Validators.required],
    major: ['', Validators.required],
    result: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    passingyear: ['', [Validators.required, Validators.pattern("^[0-9]{4}$")]]
  });

  this.academicQualifications.push(qualificationGroup);
}

// Remove an academic qualification from the FormArray
removeAcademicQualification(index: number) {
  if (this.academicQualifications.length > 3) { // Ensure at least 3 qualifications remain
    this.academicQualifications.removeAt(index);
  }
}


get workExperiences(): FormArray {
  return this.requirementForm.get('workExperiences') as FormArray;
}

// Add new work experience form group
addExperience() {
  const experienceGroup = this.formBuilder.group({
    expId: null,
    applicantId: null,
    post: [null, Validators.required],
    organization: [null, Validators.required],
    jobLocation: [null, Validators.required],
    salary: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
    reportingTo: [null, Validators.required],
    defaultProduct: [null, Validators.required],
  });

  this.workExperiences.push(experienceGroup);
}

// Remove work experience by index
removeExperience(index: number) {
  this.workExperiences.removeAt(index);
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
        
         
          
            console.log("this.this.jobPostForm",this.requirementForm)
        
        }, error => {
            console.log(error);
        });
}









public masterListDetails:any;
  public _getbyIdUrl: string = 'jobpost/getbyid';
  showDetails(modelEvnt) {
      debugger;
      console.log("modelEvnt",modelEvnt)
      var param = { strId: modelEvnt.jobOid, strId2: modelEvnt.jobOid };
      var apiUrl = this._getbyIdUrl
      this._dataservice.getWithMultipleModel(apiUrl, param)
          .subscribe(response => {
            this.masterDiv=false;
              this.res = response;
              this.detailDiv=true;
              this.masterList=JSON.parse(this.res.resdata.jobPostMaster)
              this.masterListDetails=this.masterList[0];
              console.log("this.Total test test -------------------",(this.masterListDetails))
              this.skillList=JSON.parse(this.res.resdata.jobSkill)
              this.benifitList=JSON.parse(this.res.resdata.jobBenefit)
              this.requirementList=JSON.parse(this.res.resdata.jobRequirement)
              this.otherRequirementList=JSON.parse(this.res.resdata.jobOtherRequirement)
              this.responsibilityList=JSON.parse(this.res.resdata.jobResponsibility)
              console.log("this.Total data -------------------",(this.masterList))
              console.log("this.Total skillList ",(this.skillList))
              console.log("this.Total benifitList ",(this.benifitList))
              console.log("this.Total requirementList ",(this.requirementList))
              console.log("this.Total otherRequirementList ",(this.otherRequirementList))
              console.log("this.Total responsibilityList ",(this.responsibilityList))

        
           

              console.log("this.this.jobPostForm",this.requirementForm)
          
          }, error => {
              console.log(error);
          });
  }



  
showHtml(){

}
 

ApplyForm(){
  debugger
  this.masterDiv=false;
  this.detailDiv=false;
  this.applyForm=true;
  console.log(" this.applyForm", this.applyForm)
}

//for share data 
onApplyNow(mstrId:string) {
  this._dataservice.setMasterListId(mstrId);
}















  





















 


 



 
}