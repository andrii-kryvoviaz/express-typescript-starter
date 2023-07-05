import fs from 'fs';

import { Instantiable } from './registerInjectable.js';

export async function includeDirectory(
  path: string,
  callback?: (classEntity: Instantiable) => void
): Promise<Instantiable[]> {
  const dir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  path = `${process.cwd()}/${dir}/${path}`;

  const files = fs.readdirSync(path);

  const resolvedModules = await Promise.all(
    files.map(async (file) => {
      // generate className based on file name e.g user.controller.ts => UserController
      const className = generateClassName(file);
      const module = await import(`${path}/` + file.replace('.ts', '.js'));
      const classEntity = module[className] || module.default;

      if (callback) {
        callback(classEntity);
      }

      return classEntity;
    })
  );

  return resolvedModules;
}

function generateClassName(fileName: string): string {
  const className = fileName
    .split('.')
    .slice(0, -1)
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join('');

  return className;
}
