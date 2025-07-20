import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { SchemaField } from '@/types/schema';
import { generateUniqueId } from '@/utils/schemaGenerator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FieldEditorProps {
  fieldPath: string;
  level?: number;
  onRemove?: () => void;
}

export function FieldEditor({ fieldPath, level = 0, onRemove }: FieldEditorProps) {
  const { control, register, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPath}.children`,
  });

  const fieldType = watch(`${fieldPath}.type`);
  const fieldKey = watch(`${fieldPath}.key`);
  const [isExpanded, setIsExpanded] = React.useState(true);

  const addNestedField = () => {
    const newField: SchemaField = {
      id: generateUniqueId(),
      key: '',
      type: 'string',
      children: []
    };
    append(newField);
  };

  const handleTypeChange = (newType: string) => {
    setValue(`${fieldPath}.type`, newType);
    if (newType === 'nested' && !fields.length) {
      addNestedField();
    }
  };

  const indentClass = level > 0 ? `ml-${Math.min(level * 4, 16)}` : '';

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${indentClass}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {fieldType === 'nested' && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          )}
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              {...register(`${fieldPath}.key`)}
              placeholder="Field key"
              className="font-medium"
            />
            
            <Select value={fieldType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="nested">Nested Object</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {fieldType === 'nested' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNestedField}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              )}
              
              {onRemove && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRemove}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {fieldType === 'nested' && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <FieldEditor
                    key={field.id}
                    fieldPath={`${fieldPath}.children.${index}`}
                    level={level + 1}
                    onRemove={() => remove(index)}
                  />
                ))}
                
                {fields.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No nested fields yet</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addNestedField}
                      className="mt-2"
                    >
                      Add first field
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
}