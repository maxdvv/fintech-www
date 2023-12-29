import { Pipe, PipeTransform } from '@angular/core';
import { differenceInDays } from 'date-fns';

@Pipe({
  name: 'daysBetweenTwoDate',
  standalone: true
})
export class DaysBetweenTwoDatePipe implements PipeTransform {
  transform(startDate: Date, endDate = new Date()): number {
    const currentDate = new Date();
    return differenceInDays(new Date(endDate), new Date(startDate));
  }
}
