import { Component, OnInit } from '@angular/core';

import { TodayReportModel } from '../todayReport.model';
import { IReportToday } from 'src/app/modules/shared/Interfaces/IReportToday';


@Component({
  //selector: 'app-on-today',
  templateUrl: './on-today.component.html',
  styleUrls: ['./on-today.component.css']
})
export class OnTodayComponent implements OnInit {

  IsLoad:boolean = false;

  reportItems:IReportToday[] = [];
  constructor(private todayReportModel: TodayReportModel) { }

  ngOnInit() {
    this.IsLoad=true;
    this.todayReportModel.LisenerLoad$.subscribe((reportItem)=>{
      this.reportItems.push(reportItem);
    });
    
    
    this.todayReportModel.GetReport().then((data) => {
      //this.reportItems=data;
      this.IsLoad=false;
    });
  }


}
