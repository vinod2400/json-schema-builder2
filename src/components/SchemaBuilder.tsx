import React from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { FormData, SchemaField } from '@/types/schema';
import { FieldEditor } from './FieldEditor';
import { generateUniqueId } from '@/utils/schemaGenerator';

interface SchemaBuilderProps {
  onSchemaChange: (fields: SchemaField[]) => void;
}

export function SchemaBuilder({ onSchemaChange }: SchemaBuilderProps) {
  const methods = useForm<FormData>({
    defaultValues: {
      fields: []
    }
  });

  const { control, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields'
  });

  const watchedFields = watch('fields');

  React.useEffect(() => {
    onSchemaChange(watchedFields);
  }, [watchedFields, onSchemaChange]);

  const addField = () => {
    const newField: SchemaField = {
      id: generateUniqueId(),
      key: '',
      type: 'string',
      children: []
    };
    append(newField);
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Schema Fields
                <span className="text-sm font-normal text-muted-foreground">
                  ({fields.length} field{fields.length !== 1 ? 's' : ''})
                </span>
              </CardTitle>
              <Button onClick={addField} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Plus className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No fields yet</h3>
                <p className="text-sm mb-4">Start building your JSON schema by adding your first field</p>
                <Button onClick={addField} variant="outline">
                  Add First Field
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FieldEditor
                    key={field.id}
                    fieldPath={`fields.${index}`}
                    onRemove={() => remove(index)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}