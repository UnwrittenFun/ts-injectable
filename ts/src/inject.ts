export function Inject(key: any): ParameterDecorator {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    let metadata = Reflect.getMetadata("design:paramtypes", target, propertyKey);
    metadata[parameterIndex] = key;
    Reflect.defineMetadata("design:paramtypes", metadata, target, propertyKey);
  };
}