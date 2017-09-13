import { Pipe, PipeTransform } from '@angular/core';
import { TriggerConnector } from "app/core/connectors/trigger.connector";

@Pipe({
  name: 'formatTriggerName'
})
export class FormatTriggerNamePipe implements PipeTransform {

  transform(value: TriggerConnector, args?: any): any {
    return `<em class="icon-link"></em> &nbsp;&nbsp;&nbsp;  ${value.ActionNames.join(" | ")}`;
  }

}
