import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class IconsService {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  public registerSet(): void {
    this.iconRegistry.addSvgIconSetInNamespace(
      'app',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/images/icons.svg'),
    );
  }
}
