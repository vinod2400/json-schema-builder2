export interface SchemaField {
  id: string;
  key: string;
  type: 'string' | 'number' | 'nested';
  children?: SchemaField[];
}

export interface FormData {
  fields: SchemaField[];
}

export interface JSONSchema {
  type: 'object';
  properties: Record<string, any>;
}