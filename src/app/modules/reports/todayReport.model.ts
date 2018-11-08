import { Injectable } from "@angular/core";
import { TrelloService } from '../shared/services/trello.service';
import { IMember } from "../shared/Interfaces/IMember";
import { ICard } from "../shared/Interfaces/ICard";
import { IReportToday } from "../shared/Interfaces/IReportToday";
import { BaseReport } from "./baseReport.model";
import { Subject } from "../../../../node_modules/rxjs";


@Injectable()
export class TodayReportModel extends BaseReport {

  /**
   *
   */
  constructor(trelloService: TrelloService) {
        super(trelloService);
   }

  /**Список работников */
  private async GetMembers() {
    let mem = await this.trelloService.GetOrganizationAsync();
    let users: IMember[] = [];
    const promisses = [];
    for (let idMember = 0; idMember < mem[0].memberships.length; idMember++) {
      promisses.push(
        this.trelloService.GetMemberByIdAsync(mem[0].memberships[idMember].idMember)
          .then(user => users.push(user))
      )

    }
    await Promise.all(promisses);
    users = users.sort((a, b) => {
      if (a.fullName.toString() < b.fullName.toString()) { return -1; };
      if (a.fullName.toString() > b.fullName.toString()) { return 1; };
      return 0;
    });
    return users;
  }

  public async GetReport(): Promise<IReportToday[]> {
    let users: IMember[] = await this.GetMembers();

    var result = users.map(async (user): Promise<IReportToday> => {
      let reportItem: IReportToday = <IReportToday>{};
      reportItem.User = user;
      let cards: ICard[] = await this.trelloService.GetCardMemberAsync(user.id);

      reportItem.CardToday = [];
      reportItem.CardNow = [];
      for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        let list = await this.trelloService.GetCardListAsync(card);
        if (list.name.indexOf('сегодня') >= 0) {
          await this._setReport(card);
          reportItem.CardToday.push(card);
        }else
        if (list.name.indexOf('сейчас') >= 0) {
          await this._setReport(card);
          reportItem.CardNow.push(card);
        }        
      }
      
      this.LisenerLoad$.next(reportItem);      
      return reportItem;
    });

    return Promise.all(result);

  }

  public LisenerLoad$:Subject<IReportToday>=new Subject<IReportToday>()

}
