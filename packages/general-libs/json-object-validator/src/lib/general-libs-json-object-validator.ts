/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JSONObjectKeyAndTypeValidator {
  key: string;
  required: boolean;
  default?: variabletypes | (() => variabletypes);
  trim?: boolean;
  custom_validator?: (value: variabletypes) => boolean;
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
    | 'any'
    | 'bigint';
  regex?: RegExp;
  error?: any;
  Extra?: JSONObjectKeyAndTypeValidator[];
}

type variabletypes = string | number | boolean | null | bigint | object;
export function ValidateJSONObject(
  data: any,
  Validator: JSONObjectKeyAndTypeValidator[],
  strip_data = false
): boolean | any {
  const temp: any = {};
  Validator.forEach((a) => {
    a.error
    if (
      a.required ||
      (typeof data[a.key] !== 'undefined' && data[a.key] !== null)
    ) {
      try {
        if (typeof data[a.key] === 'undefined') {
          throw a.error ? `${a.error} In Value Undefined` : `Please Enter Valid Value For Key ${a.key}`;
        }
        if (a.type === 'number' && isNaN(+data[a.key]) === true) {
          throw a.error || 'Type Mismatch';
        } else if (typeof data[a.key] !== a.type && a.type !== 'any') {
          throw a.error || 'Type Mismatch';
        }
        if (a.type === 'number') {
          data[a.key] = +data[a.key];
        }
      } catch (error) {
        if (typeof a.default === 'function') {
          data[a.key] = a.default();
        } else if (typeof a.default !== 'undefined') {
          data[a.key] = a.default;
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
        temp[a.key] = ValidateJSONObject(data[a.key], a.Extra, strip_data);
      } else {
        temp[a.key] = data[a.key];
      }
    }
  });
  return strip_data ? temp : true;
}
