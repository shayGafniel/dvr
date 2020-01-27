import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoadIndicatorService } from '../../services/load-indicator/load-indicator.service';
import { LoadIndicatorComponent } from './load-indicator.component';

describe('LoadIndicatorComponent', () => {
  let component: LoadIndicatorComponent;
  let fixture: ComponentFixture<LoadIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatProgressBarModule, MatSnackBarModule],
      declarations: [LoadIndicatorComponent],
      providers: [LoadIndicatorService],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
