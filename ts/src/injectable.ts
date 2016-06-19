import {Injector} from "./injector";

export function Injectable(): ClassDecorator {
  return function (target: any): any {
    return target;
  };
}