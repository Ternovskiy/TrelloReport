import { IList } from "./IList";
import { IBoardField } from "./IBoardField";
import { IReportTime } from "./IReportTime";

export interface ICard{
    id;
    name;
    idBoard;
    shortUrl;
    dateLastActivity;
    idList;

    _isActivity:boolean;
    _boardFields:IBoardField[];
    _list:IList;
    _time:IReportTime;
}