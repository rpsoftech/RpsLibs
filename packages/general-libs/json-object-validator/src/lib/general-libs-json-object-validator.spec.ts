import { generalLibsJsonObjectValidator } from './general-libs-json-object-validator';

describe('generalLibsJsonObjectValidator', () => {
  it('should work', () => {
    expect(generalLibsJsonObjectValidator()).toEqual(
      'general-libs-json-object-validator'
    );
  });
});
