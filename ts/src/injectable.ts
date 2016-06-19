import {Injector} from "./injector";

export function Injectable() {
  return function (target: any, key?: any, descriptor?: any): any {
    return key == null ? target : undefined;
  };
}