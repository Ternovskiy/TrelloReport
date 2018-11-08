import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from '../../employee/employee.model';
import { UserReport } from '../userReport.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'rep-view',
    templateUrl: 'report-complited-view.component.html'
})
export class ReportComplitedViewComponent  {
    ActivityTitle = "";
    ActivitySumm = "";
    ActivityCards = [];
    TodayTitle = "";
    TodaySumm = "";
    TodayCards = [];
    IsLoad: boolean = false;

    id: string;

    constructor(
        private employeeModel: EmployeeModel,
        private userReport: UserReport,
        private activateRoute: ActivatedRoute
    ) {

        activateRoute.params.subscribe(params => {
            this.id = params['id'];
            this.UpDate();
        });
        employeeModel.SelectedId = this.id;
    }

    UpDate() {
        this.IsLoad = true;
        this.userReport.GetActivity(this.id).then((result) => {

            this.ActivityCards = result.ActiviryCards;
            this.TodayCards = result.TodayCards;
            if (this.ActivityCards.length > 0) {
                this.ActivitySumm = result.ActicitySumm;
                this.ActivityTitle = 'Завершено';
            } else {
                this.ActivitySumm = '';
                this.ActivityTitle = '';
            }
            if (this.TodayCards.length > 0) {
                this.TodaySumm = result.TodaySumm;
                this.TodayTitle = 'На сегодня';
            } else {
                this.TodaySumm = '';
                this.TodayTitle = '';
            }

            this.IsLoad = false;
        })
    }

}