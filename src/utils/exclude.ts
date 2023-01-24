/**
 * This helper function removes keys from a model in a type safe way
 * 
 * 
 * @param model prisma model
 * @param keys accepts an array of keys to exclude from the model
 * @returns object without the keys
 */




export function exclude<model, Key extends keyof model>(
  model: model,
  keys: Key[]
): Omit<model, Key> {
  for (const key of keys) {
    delete model[key];
  }
  return model;
}