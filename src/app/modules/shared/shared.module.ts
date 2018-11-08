import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "./loader/loader.component";
import { TrelloService } from "./services/trello.service";
import { CardComponent } from "./card/card.component";
import { UserService } from "./services/user.service";
import { AddTimePipe } from "./pipes/addTime.pipe";
import { CacheService } from "./services/cache.service";

@NgModule({
    imports:[CommonModule],
    declarations:[
        LoaderComponent, 
        CardComponent, 
        AddTimePipe,
    ],
    providers:[
        TrelloService,
        UserService,
        CacheService
    ],
    exports:[        
        LoaderComponent, 
        CardComponent,
        AddTimePipe,
    ]
})
export class SharedModule{}