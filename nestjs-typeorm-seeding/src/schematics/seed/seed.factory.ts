import {
  Rule,
  apply,
  url,
  move,
  mergeWith,
  SchematicContext,
  Tree,
  applyTemplates,
} from '@angular-devkit/schematics';

import {
  strings,
  normalize,
} from '@angular-devkit/core';

import { SeedSchemaOptions } from './seed.schema';
import path from 'path';
export function main(options: SeedSchemaOptions): Rule {

  return (tree: Tree, _context: SchematicContext) => {
    const timestamp = Date.now().toString();
    const parsedPath = path.parse(options.name);
    const name = parsedPath.name;
    const fullfilePathName = parsedPath.dir;
    const fullName = `${name}${timestamp}`;
    const pathname = `${timestamp}-${name}`;
  
    const templateSource = url('./files')
    const templateSourceParameterized = apply(templateSource, [
      applyTemplates({
        ...strings,
        fullName,
        pathname,
      }),
      move(normalize(fullfilePathName)),
    ]);
    return mergeWith(templateSourceParameterized)(tree, _context);
  }
}
