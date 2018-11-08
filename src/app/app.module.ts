import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ReportsModule } from './modules/reports/reports.module';
import { SharedModule } from './modules/shared/shared.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { AppRoutingModule } from './app-routing.module';
import { AutorizeModule } from './modules/autorize/authorize.module';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule, 
    SharedModule,
    AppRoutingModule,
    EmployeeModule,
    ReportsModule,
    AutorizeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
