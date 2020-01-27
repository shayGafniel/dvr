import { AbbreviateNumberPipe } from './abbreviate-number.pipe';

describe('AbbreviateNumberPipe', () => {
  let pipe: AbbreviateNumberPipe;

  beforeEach(() => {
    pipe = new AbbreviateNumberPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
