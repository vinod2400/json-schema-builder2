import { SchemaField, JSONSchema } from '@/types/schema';

export function generateJSONSchema(fields: SchemaField[]): JSONSchema {
  const properties: Record<string, any> = {};

  fields.forEach((field) => {
    if (!field.key.trim()) return;

    switch (field.type) {
      case 'string':
        properties[field.key] = {
          type: 'string',
          description: `String field: ${field.key}`
        };
        break;
      case 'number':
        properties[field.key] = {
          type: 'number',
          description: `Number field: ${field.key}`
        };
        break;
      case 'nested':
        if (field.children && field.children.length > 0) {
          const nestedSchema = generateJSONSchema(field.children);
          properties[field.key] = {
            type: 'object',
            properties: nestedSchema.properties,
            description: `Nested object: ${field.key}`
          };
        } else {
          properties[field.key] = {
            type: 'object',
            properties: {},
            description: `Empty nested object: ${field.key}`
          };
        }
        break;
    }
  });

  return {
    type: 'object',
    properties
  };
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}