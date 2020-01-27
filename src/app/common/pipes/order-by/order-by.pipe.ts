import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from '../../utils/utils';

@Pipe({ name: 'orderByPipe' })
export class OrderByPipe implements PipeTransform {
  public transform(inputArray: Array<any>, args: Array<string>): Array<any> {
    const config: boolean = args[0] === '-' ? false : true;

    return orderBy(inputArray, config, args.slice(args[0] === '-' || args[0] === '+' ? 1 : 0));
  }
}
