export interface JSONObjectKeyAndTypeValidator {
  key: string;
  required: boolean;
  default?: any;
  trim?: boolean;
  custom_validator?: (value: any) => boolean;
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
  Validator: JSONObjectKeyAndTypeValidator[]
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
      if (a.regex) {
        let dataCC = data[a.key];
        if (typeof dataCC !== 'string') {
          dataCC = String(dataCC);
        }
        if (a.regex.test(dataCC) === false) {
          throw a.error || `${a.key} Regexp MisMAtch`;
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
  return temp;
}
