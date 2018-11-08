import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";
import { ReportCompletedComponent } from "./report-completed/report-completed.component";
import { OnTodayComponent } from "./on-today/on-today.component";
import { TodayReportModel } from "./todayReport.model";
import { EmployeeModule } from "../employee/employee.module";
import { UserReport } from "./userReport.model";
import { ReportComplitedViewComponent } from "./report-completed/report-complited-view.component";

const reportRoutes:Routes=[
    { path: 'today', component: OnTodayComponent },
    { path: 'activity', component:ReportCompletedComponent, 
    children:[{path:':id', component:ReportComplitedViewComponent}]}
];

@NgModule({
    imports:[
        CommonModule,
        // BrowserModule,
        EmployeeModule,
        SharedModule, 
        RouterModule.forChild(reportRoutes)],
    declarations:[
        ReportCompletedComponent,
        OnTodayComponent,
        ReportComplitedViewComponent
    ],
    providers:[
        TodayReportModel,
        UserReport
    ],
    exports:[
        RouterModule,
        ReportCompletedComponent,
        OnTodayComponent]
})
export class ReportsModule{}