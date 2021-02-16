import * as fs from 'fs-extra';

export function writeJson(path: string, json: any) {
  fs.writeJsonSync(path, json, { spaces: 2 });
}
