import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToKebab',
  standalone: true,
})
export class CamelToKebabPipe implements PipeTransform {
  transform(value: string | undefined | null): unknown {
    if (!value) {
      return value;
    }

    return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
