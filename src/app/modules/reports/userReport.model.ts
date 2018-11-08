import { Injectable } from "../../../../node_modules/@angular/core";
import { BaseReport } from "./baseReport.model";
import { TrelloService } from "../shared/services/trello.service";
import { ICard } from "../shared/Interfaces/ICard";
import { IRepotUser } from "../shared/Interfaces/IReportUser";

@Injectable()
export class UserReport extends BaseReport {
    constructor(trelloService: TrelloService) {
        super(trelloService);
    }

    public async GetActivity(userId: string): Promise<IRepotUser> {
        let result: IRepotUser = <any>{};
        let cards = await this.trelloService.GetCardMemberAsync(userId);
        result.ActiviryCards = await this._getActivity(cards);
        result.ActicitySumm = result.ActiviryCards.map(m => parseFloat(m._time.time) || 0).reduce((a, b) => a + b, 0).toFixed(1);
        //debugger;
        
        result.NowCards = [];
        result.TodayCards = [];
        for (let index = 0; index < cards.length; index++) {
            const card = cards[index];
            let list = await this.trelloService.GetCardListAsync(card);
            if (list.name.indexOf('сегодня') >= 0) {
                await this._setReport(card);
                result.TodayCards.push(card);
            } else
            if (list.name.indexOf('сейчас') >= 0) {
                await this._setReport(card);
                result.NowCards.push(card);
            }
        }
        result.NowSumm = result.NowCards.map(m => parseFloat(m._time.timeDif) || 0).reduce((a, b) => a + b, 0).toFixed(1);
        result.TodaySumm = result.TodayCards.map(m => parseFloat(m._time.timeDif) || 0).reduce((a, b) => a + b, 0).toFixed(1);
        

        return result;
    }


    async _getActivity(cards: ICard[]): Promise<ICard[]> {

        let curDateTic = (<any>new Date(Date.now()) - <any>new Date(60 * 1000 * 60 * 24 * 1));
        let result = [];
        let promisies = [];
        for (let i = 0; i < cards.length; i++) {
            let diffDate = Date.parse(cards[i].dateLastActivity) > curDateTic;

            if (!!cards[i].id && diffDate) {
                let card = cards[i]
                promisies.push(
                    this._setReport(card).then(r => result.push(r))
                );
            }
        }
        await Promise.all(promisies);
        return result;
    }

}