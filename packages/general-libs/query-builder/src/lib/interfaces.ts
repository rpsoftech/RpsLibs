export type AllVariableTypes = string | boolean | number | object | bigint;
export type QuerySupportedVariables = string | boolean | number;

export interface QueryinputObject {
  [key: string]: QuerySupportedVariables;
}
