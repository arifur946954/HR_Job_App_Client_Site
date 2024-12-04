import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { UpdatePasswordComponent } from './project_component/update-password/update-password.component';
import { HomeComponent } from './project_component/home/home.component';
import { DashboardComponent } from './project_component/dashboard/dashboard.component';








import { ClientTypeComponent } from './project_component/businessSetup/clientType/clienttype.component';
import { ClientComponent } from './project_component/businessSetup/client/client.component';
import { WorkOrderComponent } from './project_component/businessSetup/workorder/workorder.component';
import { JobPostComponent } from './project_component/jobpost/jobpost.component';
import { ApplyComponent } from './project_component/apply/apply.component';
import { ApplicantFormsComponent } from './project_component/applicantforms/applicantforms.component';







import { AuthGuard } from '../app/guard/auth.guard';
import { RoleGuard } from '../app/guard/role.guard';
import { RoleComponent } from './project_component/security/role/role.component';
import { MenuComponent } from './project_component/security/menu/menu.component';
//import { RoleMenuComponent } from './project_component/security/role-menu/role-menu.component';
import { UserRoleComponent } from './project_component/security/user-role/user-role.component';
import { UserSetupComponent } from './project_component/security/userSetup/userSetup.component';
//import { ApplicantFormsComponent } from './project_component/applicant/applicant/applicantforms.component';
//import { HomesComponent } from './pages/homes/homes.component';

 
export const routes: Routes = [
    // { path: 'updatePassword', component: UpdatePasswordComponent },
    // { path: 'home', component: HomeComponent  },
    // { path: 'dashboard', component: DashboardComponent},
    // { path: 'security/role', component: RoleComponent },
    // { path: 'security/menu', component: MenuComponent},
    // { path: 'security/userSetup', component: UserSetupComponent},
    // { path: 'security/userRoleAssign', component: UserRoleComponent},

    { 
        path: '',  
        component: PagesComponent, children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: '', redirectTo: '/register', pathMatch: 'full' },
            { path: '', redirectTo: '/requirement', pathMatch: 'full' },
    
            

            { path: 'icons', loadChildren: () => import('./pages/icons/icons.module').then(m => m.IconsModule), data: { breadcrumb: 'Material Icons' } },
            { path: 'updatePassword', component: UpdatePasswordComponent, canActivate: [AuthGuard] },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
            { path: 'security/role', component: RoleComponent, canActivate: [AuthGuard] },
            { path: 'security/menu', component: MenuComponent, canActivate: [AuthGuard]},
            { path: 'security/userSetup', component: UserSetupComponent, canActivate: [AuthGuard]},
            { path: 'security/userRoleAssign', component: UserRoleComponent, canActivate: [AuthGuard]},
           // { path: 'businessSetup/workorder', component: WorkOrderComponent, canActivate: [AuthGuard]},
           // { path: 'applicant/applicantforms',component: ApplicantFormsComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/applicant/applicantforms']} },//, RoleGuard






        
           { path: 'businessSetup/clienttype', component: ClientTypeComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/businessSetup/clienttype']} },//, RoleGuard
           { path: 'businessSetup/client', component: ClientComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/businessSetup/client']} },//, RoleGuard
           { path: 'businessSetup/workorder', component: WorkOrderComponent, canActivate: [AuthGuard], data: {roles: ['/businessSetup/workorders']} },
           { path: 'jobPost', component: JobPostComponent, canActivate: [AuthGuard], data: {roles: ['/jobPost']} },
           { path: 'apply', component: ApplyComponent, canActivate: [AuthGuard], data: {roles: ['/apply']} },
           { path: 'applicantforms', component: ApplicantFormsComponent, canActivate: [AuthGuard], data: {roles: ['/applicantforms']} }
           //{ path: 'businessSetup/workorder', component: WorkOrderComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/businessSetup/workorder']} },//, RoleGuard
          
          
           
         
        ]
    },
    { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
    { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
    { path: 'requirement', loadChildren: () => import('./pages/applicantform/applicantform.module').then(m => m.ApplicantFormModule) },
   
   
   
    { path: '**', component: NotFoundComponent }
];
 

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
            useHash: true
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }