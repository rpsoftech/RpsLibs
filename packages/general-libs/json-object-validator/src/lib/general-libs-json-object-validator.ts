export interface JSONObjectKeyAndTypeValidator {
  key: string;
  required: boolean;
  default?: any;
  trim?: boolean;
  custom_validator?: (value: any) => boolean;
  lengths?: {
    min_len?: number;
    max_len?: number;
    len?: number;
  };
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'function'
    | 'object'
    | 'symbol'
    | 'symbol'
    | 'any'
    | 'bigint';
  regex?: RegExp;
  error?: any;
  Extra?: JSONObjectKeyAndTypeValidator[];
}

export function ValidateJSONObject(
  data: any,
  Validator: JSONObjectKeyAndTypeValidator[],
  strip_data = false
): boolean | any {
  const temp: any = {};
  Validator.forEach((a) => {
    if (
      a.required ||
      (typeof data[a.key] !== 'undefined' && data[a.key] !== null)
    ) {
      try {
        if (a.type === 'number' && isNaN(+data[a.key]) === true) {
          throw a.error || 'Type Mismatch';
        } else if (typeof data[a.key] !== a.type && a.type !== 'any') {
          throw a.error || 'Type Mismatch';
        }
        if (a.type === 'number') {
          data[a.key] = +data[a.key];
        }
      } catch (error) {
        if (typeof a.default !== 'undefined') {
          data[a.key] = a.default;
          return;
        } else {
          throw error;
        }
      }
      if (a.regex || a.lengths) {
        let dataCC = data[a.key];
        if (typeof dataCC !== 'string') {
          dataCC = String(dataCC);
        }
        if (a.lengths) {
          if (a.lengths.max_len && a.lengths.max_len < dataCC.length) {
            throw a.error || `${a.key} Min Length Does Not Meet`;
          }
          if (a.lengths.min_len && a.lengths.min_len > dataCC.length) {
            throw a.error || `${a.key} Min Length Does Not Meet`;
          }
          if (a.lengths.len && a.lengths.len !== dataCC.length) {
            throw a.error || `${a.key} Length Does Not Meet`;
          }
        }
        if (a.regex) {
          if (a.regex.test(dataCC) === false) {
            throw a.error || `${a.key} Regexp MisMAtch`;
          }
        }
      }
      if (a.custom_validator) {
        const dd = a.custom_validator(data[a.key]);
        if (!!dd === false) {
          throw a.error || 'Custom Validator Error';
        }
      }
      if (a.Extra && Array.isArray(a.Extra)) {
        temp[a.key] = ValidateJSONObject(data[a.key], a.Extra);
      } else {
        temp[a.key] = data[a.key];
      }
    }
  });
  return strip_data ? temp : true;
}
