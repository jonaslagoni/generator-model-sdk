import { TypeScriptGenerator, loadConfiguration } from '../../src';
import { fileArgs } from './configs/function_modelina.config';

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  }
};

export async function generate(): Promise<void> {
  console.log('Should load cjm exposed object: ');
  const objectGenerator = new TypeScriptGenerator({
    file: `${__dirname}/configs/object_modelina.config.js`
  });
  const objectModels = await objectGenerator.generate(jsonSchemaDraft7);
  for (const model of objectModels) {
    console.log(model.result);
  }

  console.log('Should load cjm exposed function: ');
  const functionGenerator = new TypeScriptGenerator({
    file: `${__dirname}/configs/function_modelina.config.js`,
    fileArgs: { myCustomArgs: 'something' }
  });
  const functionModels = await functionGenerator.generate(jsonSchemaDraft7);
  for (const model of functionModels) {
    console.log(model.result);
  }

  console.log('Should load esm exposed object: ');
  const esmObjectGenerator = new TypeScriptGenerator({
    file: `${__dirname}/configs/esm_object_modelina.config.js`
  });
  const esmObjectModels = await esmObjectGenerator.generate(jsonSchemaDraft7);
  for (const model of esmObjectModels) {
    console.log(model.result);
  }

  console.log('Should load esm exposed function: ');
  const esmFunctionGenerator = new TypeScriptGenerator({
    file: `${__dirname}/configs/esm_function_modelina.config.js`,
    fileArgs: 'test'
  });
  const esmFunctionModels = await esmFunctionGenerator.generate(
    jsonSchemaDraft7
  );
  for (const model of esmFunctionModels) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
