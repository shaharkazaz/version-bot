import * as fs from 'fs-extra';
import * as path from 'path';
import { addParamValue } from './helpers/transpileString';

let _package;

export function setPackage(packagePath: string) {
  const fullPath = path.resolve(process.cwd(), packagePath || '', 'package.json');
  _package = fs.readJsonSync(fullPath);
  addParamValue({
    packageName: _package.name
  });
}

export function getPackage() {
  return _package;
}
