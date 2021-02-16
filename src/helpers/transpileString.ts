type Params = {
  version?: string;
  compareChangesLink?: string;
  packageName?: string;
};

let paramMap: Params = {};

export function addParamValue(newParams: Partial<Params>) {
  paramMap = {
    ...paramMap,
    ...newParams
  };
}

export function transpileString(str: string): string {
  return Object.entries(paramMap).reduce((transpiled, [param, value]) => {
    return transpiled.replace(new RegExp(`{{${param}}}`, 'g'), value);
  }, str);
}
