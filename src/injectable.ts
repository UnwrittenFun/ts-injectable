import {Injector} from "./injector";

export function Injectable(target: Object, key: string, descriptor: any) {
  let originalMethod = descriptor.value;
  descriptor.value = function (...injectables: any[]) {
    let types = Reflect.getMetadata("design:paramtypes", target, key);
    return originalMethod.apply(target, Injector.compile(types, injectables));
  };
  return descriptor;
}