import { Pipe, PipeTransform } from '@angular/core';
import { ConfigurationAPIService } from '../../services/configuration/configuration-api.service';

@Pipe({ name: 'provinceCode', pure: false })
export class ProvinceCodePipe implements PipeTransform {
  constructor(private _confService: ConfigurationAPIService) {}

  public transform(value: string) {
    if (value === '*') {
      return 'All';
    } else {
      return value;
    }
  }
}
