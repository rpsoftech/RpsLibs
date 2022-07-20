export function PolyFillsLocalStorageAndSessoinStorage() {
  const AA = {
    data: {} as any,
    setItem: (key: string, value: string) => {
      AA.data[key] = value;
    },
    getItem: (key: string) => {
      return AA.data[key] || null;
    },
    clear: () => {
      AA2.data = {};
    },
  };
  const AA2 = {
    data: {} as any,
    setItem: (key: string, value: string) => {
      AA2.data[key] = value;
    },
    getItem: (key: string) => {
      return AA2.data[key] || null;
    },
    clear: () => {
      AA2.data = {};
    },
  };
  // eslint-disable-next-line no-global-assign
  global['localStorage'] = AA as any;
  global['sessionStorage'] = AA2 as any;
}