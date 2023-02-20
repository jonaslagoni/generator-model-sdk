/**
 * Simple function to load a modelina configuration from a file.
 */
export async function loadConfiguration(
  filePath: string,
  ...args: any[]
): Promise<Record<string, any>> {
  try {
    const loaded = await import(filePath);
    if (loaded === undefined) {
      throw new Error(`Configuration file was loaded as undefined`);
    }
    const importIsExposingObject = typeof loaded === 'object';
    const importIsDefaultObject =
      importIsExposingObject && typeof loaded.default === 'object';
    const importIsDefaultFunction =
      importIsExposingObject && typeof loaded.default === 'function';
    const importIsObject =
      importIsExposingObject &&
      !importIsDefaultFunction &&
      !importIsDefaultObject;
    const importIsFunction = typeof loaded === 'function';
    if (
      importIsExposingObject ||
      importIsFunction ||
      importIsDefaultFunction ||
      importIsDefaultObject
    ) {
      if (importIsObject) {
        return loaded;
      } else if (importIsDefaultObject) {
        return loaded.default;
      }
      let loadedObject;
      if (importIsDefaultFunction) {
        loadedObject = await loaded.default(...args);
      } else {
        loadedObject = await loaded(...args);
      }
      if (typeof loadedObject === 'object') {
        return loadedObject;
      }
      throw new Error(
        `The exposed function did not resolve to a configuration, make sure your function returns an object, it was ${typeof loadedObject}`
      );
    }
    throw new Error(
      `Configuration exposed incorrect type, make sure you export a function or object.`
    );
  } catch (e) {
    throw new Error(`Could not load the configuration file, ${e}`);
  }
}
