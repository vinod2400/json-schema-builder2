import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { SchemaPreview } from '@/components/SchemaPreview';
import { Toaster } from '@/components/ui/toaster';
import { SchemaField } from '@/types/schema';
import { generateJSONSchema } from '@/utils/schemaGenerator';
import { Settings, Eye, Code2 } from 'lucide-react';

function App() {
  const [fields, setFields] = React.useState<SchemaField[]>([]);
  const schema = React.useMemo(() => generateJSONSchema(fields), [fields]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl text-white">
              <Code2 className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">JSON Schema Builder</h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Create complex JSON schemas with ease. Add fields, define types, and build nested structures 
            with real-time preview and validation.
          </p>
        </div>

        {/* Main Content */}
        <Card className="max-w-7xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <Tabs defaultValue="builder" className="w-full">
            <div className="border-b bg-slate-50/50">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-transparent p-2">
                <TabsTrigger 
                  value="builder" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Settings className="h-4 w-4" />
                  Schema Builder
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Eye className="h-4 w-4" />
                  JSON Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="builder" className="mt-0">
                <SchemaBuilder onSchemaChange={setFields} />
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <SchemaPreview schema={schema} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>Build production-ready JSON schemas with nested objects and recursive structures</p>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;