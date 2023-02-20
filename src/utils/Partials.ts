/* eslint-disable security/detect-object-injection, @typescript-eslint/ban-types */
import { loadConfiguration } from './ConfigurationFileLoader';

/**
 * Deep partial type that does NOT partial function arguments.
 */
export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Return true or false based on whether the input object is a regular object or a class
 *
 * Taken from: https://stackoverflow.com/a/43197340/6803886
 * @param obj
 */
function isClass(obj: any): boolean {
  const isCtorClass =
    obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
  if (obj.prototype === undefined) {
    return isCtorClass;
  }
  const isPrototypeCtorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === 'class';
  return isCtorClass || isPrototypeCtorClass;
}

/**
 * Merge a non optional value with custom optional values to form a full value that has all properties sat.
 */
export function mergePartialAndDefault<T extends Record<string, any>>(
  defaultNonOptional: T,
  customOptional?: DeepPartial<T>
): T {
  if (customOptional === undefined) {
    return defaultNonOptional;
  }
  // create a new object
  const target = { ...defaultNonOptional } as Record<string, any>;
  const applyConfiguration = (conf: any) => {
    for (const [propName, prop] of Object.entries(conf)) {
      const isObjectOrClass =
        typeof prop === 'object' && target[propName] !== undefined;
      const isRegularObject = !isClass(prop);
      if (isObjectOrClass && isRegularObject) {
        target[propName] = mergePartialAndDefault(target[propName], prop);
      } else if (prop) {
        target[propName] = prop;
      }
    }
  };

  // First apply the file configuration, if present
  if (customOptional.file) {
    const fileArgs = customOptional.fileArgs
      ? customOptional.fileArgs
      : undefined;
    const loadedConf = loadConfiguration(customOptional.file, fileArgs);
    applyConfiguration(loadedConf);
  }

  // Then apply the custom configurations
  applyConfiguration(customOptional);

  return target as T;
}
