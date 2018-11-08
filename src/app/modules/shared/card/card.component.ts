import { Component, Input } from "@angular/core";
import { ICard } from "../Interfaces/ICard";

@Component({
    selector: "app-card",
    templateUrl: "card.component.html",
    styleUrls: ["card.component.css"]
})
export class CardComponent {

    constructor() {
    }

    @Input("Card")
    set CardItem(card: ICard) {
        this.Name = card.name;
        this.Url = card.shortUrl;
        if (card._time) {
            this.Time = card._time.time;
            this.isGreen = card._time.isGreen;
            this.ListName = card._time.listName;
            this.Plan = card._time.plan;
            if (card._time.hasPlan) {
                this.PlanClass.push("badge-light");
            } else {
                this.PlanClass.push("badge-danger");
            }

            this.Dif = Number(card._time.timeDif);
            if ( this.Dif &&  this.Dif < 0) {
                this.DifClass.push("badge-danger");
            } else {
                this.DifClass.push("badge-light");
            }
        }
    }

    @Input("ShowState")
    ShowState: boolean = true;

    Name: string;
    Url: string;
    Plan: string;
    PlanClass: string[] = [];
    Time: string;
    ListName: string;
    isGreen: boolean;
    Dif;
    DifClass: string[] = [];
}