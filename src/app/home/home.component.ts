import { Component, OnInit } from '@angular/core';
import { UserService } from '../modules/shared/services/user.service';
import { Router } from '@angular/router';
import { UserReport } from '../modules/reports/userReport.model';
import { ICard } from '../modules/shared/Interfaces/ICard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private userService:UserService,
    private router:Router,
    private userReport:UserReport
  ) { }

  ngOnInit() {
    if(!this.userService.IsAuthorize){
      this.router.navigate(["/auth"])
    }else{
      this.IsLoad=true;
      this.userReport.GetActivity(this.userService.CurentUserId)
      .then((report=>{
        this.ActivityCards=report.ActiviryCards;
        this.ActivitySumm=report.ActicitySumm;

        this.NowCards=report.NowCards;
        this.NowSumm=report.NowSumm;
        
        this.TodayCards=report.TodayCards;
        this.TodaySumm=report.TodaySumm;

        this.IsLoad=false;
      }))
    }
  }

  IsLoad:boolean=false;

  ActivityCards:ICard[]=[];
  ActivitySumm="";

  NowCards:ICard[]=[];
  NowSumm="";

  TodayCards:ICard[]=[];
  TodaySumm="";


}
