import * as _ from "lodash";

export class Injector {
  private static injectables: {} = {};

  public static provide(type: any, instance?: any) {
    if (instance == null) {
      this.injectables[type.constructor] = type;
    } else {
      this.injectables[type] = instance;
    }
  }

  public static get<T>(type: any, extras: {} = {}): T {
    return extras[type] || this.injectables[type];
  }

  public static compile(types: any[], injectables: {} | any[] = {}): any[] {
    let local = injectables;
    let extras = [];
    if (injectables instanceof Array) {
      local = {};
      for (let i = 0, len = injectables.length; i < len; i++) {
        let injectable = injectables[i];
        if (!_.isObject(injectable) || _.isPlainObject(injectable)) {
          extras.push(injectable);
        } else {
          local[injectable.constructor] = injectable;
        }
      }
    }

    let instances = [];
    for (let i = 0, len = types.length; i < len; i++) {
      if (types[i] === Object) continue;
      let injectable = this.get(types[i], local);
      instances.push(injectable);
    }
    instances = instances.concat(extras);
    return instances;
  }

  public static fromArray<T>(injectables: any[], type: any): T {
    for (let i = 0, len = injectables.length; i < len; i++) {
      if (injectables[i].constructor == type) {
        return injectables[i];
      }
    }
    return null;
  }
}
