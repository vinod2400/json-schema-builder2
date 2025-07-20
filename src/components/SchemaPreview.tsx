import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Check } from 'lucide-react';
import { JSONSchema } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';

interface SchemaPreviewProps {
  schema: JSONSchema;
}

export function SchemaPreview({ schema }: SchemaPreviewProps) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const formattedSchema = JSON.stringify(schema, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedSchema);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "JSON schema has been copied to your clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadSchema = () => {
    const blob = new Blob([formattedSchema], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Schema downloaded",
      description: "JSON schema has been downloaded as schema.json"
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>JSON Schema Preview</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSchema}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-[600px] border">
            <code className="language-json">{formattedSchema}</code>
          </pre>
          
          {Object.keys(schema.properties).length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-lg">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">No fields added yet</p>
                <p className="text-xs mt-1">Add fields in the builder to see the schema preview</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Schema Stats:</strong> {Object.keys(schema.properties).length} top-level properties
          </p>
        </div>
      </CardContent>
    </Card>
  );
}