import * as _ from "lodash";

export class Injector {
  public static INSTANCE = new Injector();

  private injectables: InjectableMap = new Map<any, any>();

  public static provide(type:any, instance?: any): void {
    return this.INSTANCE.provide(type, instance);
  }

  public static construct<T>(clazz: any, injectables?: InjectableList): T {
    return this.INSTANCE.construct<T>(clazz, injectables);
  }

  public static constructAndProvide(clazz: any, injectables?: InjectableList): void {
    return this.INSTANCE.constructAndProvide(clazz, injectables);
  }

  public static get<T>(type: TypeOf<T>, extras: InjectableMap): T {
    return this.INSTANCE.get<T>(type, extras);
  }

  public static compile(types: any[], injectables: InjectableList): any[] {
    return this.INSTANCE.compile(types, injectables);
  }

  /**
   * Make a class/value accessible globally using the Injector.
   */
  public provide(type: any, instance?: any): void {
    if (!instance) {
      instance = type;
      type = instance.constructor;
    }

    this.injectables.set(type, instance);
  }

  /**
   * Construct a class using global injectables.
   */
  public construct<T>(clazz: any, injectables?: InjectableList): T {
    const types = Reflect.getMetadata("design:paramtypes", clazz);
    return new clazz(...this.compile(types, injectables));
  }

  public constructAndProvide(clazz: any, injectables?: InjectableList): void {
    this.provide(clazz, this.construct(clazz, injectables));
  }

  /**
   * Get an injectable by type
   */
  public get<T>(type: TypeOf<T>, extras: InjectableMap): T {
    return extras.get(type) || this.injectables.get(type);
  }

  /**
   * Returns an array of values from the injector based on the types given.
   */
  public compile(types: any[], injectables: InjectableList): any[] {
    let locals: InjectableMap;
    let extras = [];
    if (_.isArray(injectables)) {
      locals = new Map<any, any>();
      injectables.forEach(injectable => {
        if (!_.isObject(injectable) || _.isPlainObject(injectable)) {
          extras.push(injectable);
        } else {
          locals.set(injectable.constructor,  injectable);
        }
      })
    } else {
      locals = injectables as InjectableMap;
    }

    let instances = [];
    for (let i = 0, len = types.length; i < len; i++) {
      if (types[i] === Object) continue;
      let injectable = this.get(types[i], locals);
      instances.push(injectable);
    }
    instances = instances.concat(extras);
    return instances;
  }

  public fromArray<T>(injectables: any[], type: any): T {
    for (let i = 0, len = injectables.length; i < len; i++) {
      if (injectables[i].constructor == type) {
        return injectables[i];
      }
    }
    return null;
  }
}

export type InjectableMap = Map<any, any>;
export type InjectableList = InjectableMap | any[];

export interface TypeOf<T> {
  new (...args: any[]): T;
}