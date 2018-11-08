import { TrelloService } from "../shared/services/trello.service";
import { ICard } from "../shared/Interfaces/ICard";
import { IReportTime } from "../shared/Interfaces/IReportTime";
import { IBoardField } from "../shared/Interfaces/IBoardField";
import { CacheService } from "../shared/services/cache.service";

export class BaseReport {
    constructor(protected trelloService:TrelloService) {
        
    }

    protected async _setReport(card:ICard):Promise<ICard>{
        await this._getTime(card);
        await this.SetPlan(card);
        
        if(card._time.plan && !isNaN(card._time.plan)){
            card._time.timeDif=(card._time.plan-card._time.time).toFixed(1);
        }else{
            // card._time.timeDif="-";
        }
        return card;
    }



    private async _getTime(card: ICard) {
        if (!!card._time) {
            return card._time;
        }
        var cache=this.trelloService.cacheSevice.GetCache("time"+card.id);
        if(cache){
            card._time=cache;return card._time;
        }
        var o: IReportTime = <any>{
            //idCard: card.id,
            sum: 0,
            //cardName: '',
            time: 0
        };

        let cardId = card.id;
        var data = await this.trelloService.GetActionCardAsync(cardId);
        data = data.reverse(); //время по возрастанию
        //получить текущий лист
        let list = await this.trelloService.GetCardListAsync(card);
        if (!list.name) return undefined;
        o.listName = list.name;
        let cardInWork = list.name.indexOf('сейчас') !== -1;
        o.inWork = cardInWork;

        if (data.length > 0) {

            //Проверяем если карточка создалась в колнке Делается сейчас, то вычисляем время до переноса ее из этой колонки
            var createTime = null;
            if (!!data[0].data.listBefore)
                if (data[0].data.listBefore.name.indexOf('сейчас') !== -1) {
                    createTime = this.getDateCreate(data[0].data.card.id);
                }

            for (let i = 0; i < data.length; i++) {
                if ((data[i].data.listAfter && data[i].data.listAfter.name.indexOf('сейчас') !== -1) || !!createTime) { //ищем начало карточки

                    let dateStart = createTime || Date.parse(data[i].date); //дата начала
                    createTime = null;
                    let dateEnd = null;

                    //ищем время выхода карточки из делается сейчас
                    for (let j = i; j < data.length; j++) {
                        if (data[j].data.listBefore && data[j].data.listBefore.name.indexOf('сейчас') !== -1) {
                            dateEnd = Date.parse(data[j].date);
                            i = j;
                            break;
                        }
                    }
                    //если выхода карточки нет, берем текущую дату
                    dateEnd = dateEnd || Date.now();

                    // Количество дней
                    var totalDays = new Date(dateEnd - dateStart).getDate() - 1;
                    //убераем ночное время и берем разницу
                    var sum = dateEnd - dateStart - totalDays * 15 * 3600 * 1000;
                    o.cardName = data[i].data.card.name;
                    o.sum += sum;
                    o.time = this.timeConversion(o.sum);
                }
            }

        } else {
            if (cardInWork) {
                let dateStart = this.getDateCreate(card.id);
                let dateEnd = Date.now();
                // Количество дней
                var totalDays = new Date(dateEnd - dateStart).getDate() - 1;
                //убераем ночное время и берем разницу
                var sum = dateEnd - dateStart - totalDays * 15 * 3600 * 1000;
                o.cardName = card.name;
                o.sum += sum;
                o.time = this.timeConversion(o.sum);
            }
        }

        this.trelloService.cacheSevice.SetCache("time"+card.id, o, 5);

        if (!!o.cardName) {
            card._time = o;
            //await this.SetPlan(card);
            //card._time.isGreen = this.getGreen(card._time.plan, card._time.time);
            return card._time;
        }
        card._time = o;
        return undefined;
    }


    // Получение даты создания (карточки, списка, доски)
    private getDateCreate(val) {
        var d = val.toString();
        return 1000 * parseInt(d.substring(0, 8), 16);
    }
    private getGreen(plan, fact) {
        if (!!plan && !!fact && !!parseFloat(plan)) {
            var percent = (plan - fact) / plan;
            if (percent > 0.30 || percent < -0.15) return false;
            return true;
        }
        return undefined;
    }

    public async  SetPlan(card:ICard) {
        //получение плана
        if (!!card._time.plan) {
            return card._time.plan;
        }
        let plan:{hasPlan:boolean, plan:string} = <any>{};
        plan.hasPlan = false;
        var dataBoardFields:IBoardField[] = await this.trelloService.GetBoardFieldsAsync(card);
        var fieldPlan = dataBoardFields.find ? dataBoardFields.find(function (d) {
            return d.name && d.name.startsWith("План")
        }) : undefined;
        //если есть поля начинающиеся с План
        if (fieldPlan) {

            var dataFields = await this.trelloService.GetCardFieldsAsync(card);

            var cardPlanField = dataFields.find(function (d) {
                return fieldPlan.id == d.idCustomField;
            });
            if (cardPlanField) {
                let pl = this.planToTime(cardPlanField.value.text);
                if (!!pl) {
                    plan.plan = pl;
                    plan.hasPlan = true;
                } else plan.plan = cardPlanField.value.text;
            } else
            plan.plan = null;    
            //plan.plan = '-';//Поле план не заполено
        } else {
            plan.plan = null;
            //plan.plan = '-';//Нет поля план
        }
        card._time.plan = plan.plan;
        card._time.hasPlan=plan.hasPlan;
        return plan.plan;
    }

    // Преобраззование мс во время
    private timeConversion(millisec) {
        var seconds = (millisec / 1000).toFixed(1);
        var minutes = (millisec / (1000 * 60)).toFixed(1);
        var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
        return hours;
        // var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
        // if (seconds < 60) {
        //     return seconds + " сек";
        // } else if (minutes < 60) {
        //     return minutes + " мин";
        // } else if (hours < 24) {
        //     return hours + " ч";
        // } else {
        //     return days + " Дн"
        // }
    }

    private planToTime(plan) {
        let n = parseFloat(plan.replace(',', '.'));
        if (!n) return undefined;
        plan = plan.toLowerCase();
        if (plan.indexOf('д') > 0) n = n * 8;
        if (plan.indexOf('м') > 0) n = n / 60;
        if (plan.indexOf('d') > 0) n = n * 8;
        if (plan.indexOf('m') > 0) n = n / 60;
        return n.toFixed(1);
    }

}