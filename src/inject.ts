export function Inject(key: any) {
  return function (target: any, method: string, index: number) {
    let metadata = Reflect.getMetadata("design:paramtypes", target, method);
    metadata[index] = key;
    Reflect.defineMetadata("design:paramtypes", metadata, target, method);
  }
}