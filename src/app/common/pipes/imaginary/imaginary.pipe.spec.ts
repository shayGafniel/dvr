import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { ImaginaryService } from '../../services/imaginary/imaginary.service';
import { ImaginaryPipe } from './imaginary.pipe';

describe('Imaginary Pipe', () => {
  let pipe: ImaginaryPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImaginaryPipe, ImaginaryService],
    }).compileComponents();
    pipe = TestBed.get(ImaginaryPipe);
  }));

  // s3 is without format support for now

  it('should transform an imaginaryId to an api relative path', () => {
    expect(pipe.transform('someId')).toEqual('/api/imaginary/v1.0/asset/someId');
  });

  it('should ignore an undefined imaginaryId', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('should transform a local file imaginaryId to a local relative path in the form /', () => {
    expect(pipe.transform('/someId')).toEqual('/someId');
  });

  it('should transform a local file imaginaryId to a local relative path in the form ./', () => {
    expect(pipe.transform('./someId')).toEqual('./someId');
  });

  it('should transform a local file imaginaryId to a local relative path in the form ../', () => {
    expect(pipe.transform('../someId')).toEqual('../someId');
  });
});
