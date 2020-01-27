import { ImaginaryService } from './imaginary.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { ConfigurationAPIService } from '../configuration/configuration-api.service';
import { CookiesService } from '../cookies/cookies.service';
import { LoggerService } from '../logger/logger.service';
import { SecurityService } from '../security/security.service';

describe('ImaginaryService', () => {
  let apiService: ImaginaryService;
  let configAPIService: ConfigurationAPIService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConfigurationAPIService,
        CookiesService,
        LoggerService,
        ImaginaryService,
        SecurityService,
      ],
    });
  }));

  beforeEach(() => {
    apiService = TestBed.get(ImaginaryService);
    configAPIService = TestBed.get(ConfigurationAPIService);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('ImaginaryService', () => {
    describe('translateUrl with page', () => {
      it('should work with simple image id', () => {
        const url = apiService.translateUrl(true, '123');

        // expect the response
        expect(url).not.toMatch(/\/page\/123/);
        expect(url).toMatch(/\/123?.*$/);
      });

      it('should work with paged image id', () => {
        const url = apiService.translateUrl(true, '123', 456);

        // expect the response
        expect(url).toMatch(/\/123\/page\/456/);
      });
    });

    describe('translateUrl without page', () => {
      it('should work with simple image id', () => {
        const url = apiService.translateUrl(false, '123');

        // expect the response
        expect(url).not.toMatch(/\/page\/123/);
        expect(url).toMatch(/\/123?.*$/);
      });

      it('should work with paged image id', () => {
        const url = apiService.translateUrl(false, '123', 456);

        // expect the response
        expect(url).not.toMatch(/\/page\/123/);
        expect(url).toMatch(/\/123?.*$/);
      });
    });
  });
});
