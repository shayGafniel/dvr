import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InlineSVGService } from 'ng-inline-svg/lib/inline-svg.service';

import { NavigationComponent } from './navigation.component';
import { SharedModule } from '~/shared/shared.module';
import { StoreService } from '~/auth/store/store.service';
import { GateApiService } from '~/common/services/gate/gate-api.service';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [
        InlineSVGService,
        StoreService,
        GateApiService,
      ],
      declarations: [NavigationComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
