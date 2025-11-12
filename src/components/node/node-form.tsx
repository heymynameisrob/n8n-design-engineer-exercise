import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useNodesContext } from "@/components/provider/provider-node";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/primitives/Form";
import { Input } from "@/components/primitives/Input";
import { Select, SelectOption } from "@/components/primitives/Select";
import { NodeFieldsMap, type Field, type NodeType } from "@/lib/types";

interface NodeFormProps {
  nodeId: number;
}

/**
 * Creates a dynamic Zod schema based on the field definitions
 */
function createFormSchema(fields: Field[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {
    // Always include title field for all node types
    title: z.string().min(1, "Title is required"),
  };

  fields.forEach((field) => {
    if (field.type === "text" || field.type === "textarea") {
      schemaShape[field.id] = z.string();
    } else if (field.type === "select") {
      schemaShape[field.id] = z.string();
    }
  });

  return z.object(schemaShape);
}

/**
 * Converts node fields array to form values object
 * Node stores: [{ "http_input_1": { id: "http_input_1", value: "GET", ... } }]
 * Form needs: { "http_input_1": "GET", "title": "Node Title" }
 */
function nodeFieldsToFormValues(nodeFields: Record<string, Field>[] | undefined, nodeTitle: string) {
  const formValues: Record<string, string> = {
    title: nodeTitle,
  };

  if (!nodeFields || !Array.isArray(nodeFields)) {
    return formValues;
  }

  nodeFields.forEach((fieldObj) => {
    const fieldId = Object.keys(fieldObj)[0];
    const field = fieldObj[fieldId];
    if (field && typeof field === "object" && "value" in field) {
      formValues[fieldId] = field.value;
    }
  });

  return formValues;
}

/**
 * Converts form values back to node fields format
 * Form provides: { "http_input_1": "GET" }
 * Node needs: [{ "http_input_1": { id: "http_input_1", value: "GET", ... } }]
 */
function formValuesToNodeFields(
  formValues: Record<string, string>,
  fieldDefinitions: Field[]
) {
  return fieldDefinitions.map((fieldDef) => {
    return {
      [fieldDef.id]: {
        ...fieldDef,
        value: formValues[fieldDef.id] ?? fieldDef.value,
      },
    };
  });
}

export function NodeForm({ nodeId }: NodeFormProps) {
  const { nodes, setNodes } = useNodesContext();

  // Find the node by ID
  const node = React.useMemo(
    () => nodes.find((n) => n.id === nodeId),
    [nodes, nodeId]
  );

  // Get field definitions based on node type
  const fieldDefinitions = React.useMemo(
    () => node ? NodeFieldsMap[node.type as NodeType] : [],
    [node]
  );

  // Create the Zod schema dynamically
  const formSchema = React.useMemo(
    () => createFormSchema(fieldDefinitions),
    [fieldDefinitions]
  );

  type FormValues = z.infer<typeof formSchema>;

  // Initialize form with node's current field values
  const defaultValues = React.useMemo(
    () => node ? nodeFieldsToFormValues(node.fields, node.title) : { title: "" },
    [node]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Watch for form changes and update the node
  React.useEffect(() => {
    if (!node) return;

    const subscription = form.watch((formValues) => {
      // Update the node in context whenever form changes
      const { title, ...fieldValues } = formValues as Record<string, string>;

      const updatedFields = formValuesToNodeFields(
        fieldValues,
        fieldDefinitions
      );

      const updatedNodes = nodes.map((n) =>
        n.id === nodeId
          ? { ...n, title: title || n.title, fields: updatedFields }
          : n
      );

      setNodes(updatedNodes);
    });

    return () => subscription.unsubscribe();
  }, [form, nodeId, nodes, setNodes, fieldDefinitions, node]);

  if (!node) {
    return <div className="text-sm text-muted-foreground">Node not found</div>;
  }

  return (
    <Form {...form}>
      <form className="space-y-4">
        {/* Title field - always shown for all node types */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} value={field.value as string} placeholder="Enter node title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic fields based on node type */}
        {fieldDefinitions.map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id as keyof FormValues}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === "select" ? (
                    <Select
                      {...formField}
                      value={formField.value as string}
                    >
                      {field.options.map((option) => (
                        <SelectOption key={option} value={option}>
                          {option}
                        </SelectOption>
                      ))}
                    </Select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      {...formField}
                      value={formField.value as string}
                      placeholder={field.placeholder}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  ) : (
                    <Input
                      {...formField}
                      value={formField.value as string}
                      placeholder={field.placeholder}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}
