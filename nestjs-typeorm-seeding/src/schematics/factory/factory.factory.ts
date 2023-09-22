import {
  Rule,
  apply,
  url,
  applyTemplates,
  move,
  mergeWith,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';

import {
  strings,
  normalize,

} from '@angular-devkit/core';

import { FactorySchemaOptions } from './factory.schema';
import path from 'path';
export function main(options: FactorySchemaOptions): Rule {

  return(tree: Tree, _context: SchematicContext) => {
    const parsedPath = path.parse(options.name);
    const name = parsedPath.name;
    const fullfilePathName = parsedPath.dir;
    const fullName = name;
    const pathname = name;
  
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
