// Replace `../../../src` with `@asyncapi/modelina`, as thats the module you have installed. This is just needed for the example.
import {
  TS_COMMON_PRESET,
  TypeScriptOptions,
  IndentationTypes
} from '../../../src';

const test = {
  enumType: 'union',
  modelType: 'interface',
  indentation: {
    size: 10,
    type: IndentationTypes.SPACES
  },
  mapType: 'record',
  renderTypes: false,
  moduleSystem: 'CJS',
  constraints: {
    modelName: (context) => {
      return `Custom${context.modelName}`;
    },
    propertyKey: (context) => {
      return `custom_prop_${context.objectPropertyModel.propertyName}`;
    }
  },
  typeMapping: {
    Any: (context) => {
      // Always map AnyModel to number
      return 'number';
    }
  },
  presets: [
    {
      preset: TS_COMMON_PRESET,
      options: {
        example: true
      }
    }
  ]
};
export default test;
