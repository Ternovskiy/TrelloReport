import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";
import { HomeComponent } from "./home/home.component";

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    
    // { path: 'today', loadChildren:'./modules/reports/reports.module#ReportsModule'}

  ];

@NgModule({
    imports:[RouterModule.forRoot(appRoutes, {
        preloadingStrategy: PreloadAllModules
    })],
    exports:[RouterModule]
})
export class AppRoutingModule{}