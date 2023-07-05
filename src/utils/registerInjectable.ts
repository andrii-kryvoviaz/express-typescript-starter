import { Container } from 'typedi';

export type Instantiable = { new (...args: any[]): any };

export function registerInjectable(modules: Instantiable[]) {
  modules.forEach((module: Instantiable) => {
    Container.set({ id: module.name, type: module });
  });
}
