import { vscodeExtSqlTableToJson } from './vscode-ext-sql-table-to-json';

describe('vscodeExtSqlTableToJson', () => {
  it('should work', () => {
    expect(vscodeExtSqlTableToJson()).toEqual('vscode-ext-sql-table-to-json');
  });
});
