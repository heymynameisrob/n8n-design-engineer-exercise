import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Switch } from "@/components/primitives/Switch";
import { Input } from "@/components/primitives/Input";
import { Select, SelectOption } from "@/components/primitives/Select";
import { Textarea } from "@/components/primitives/Textarea";
import { useNodesContext } from "@/components/provider/provider-node";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/primitives/Form";
import { cn } from "@/lib/utils";

import { NodeFieldsMap, type Field, type NodeType } from "@/lib/types";

type NodeFormProps = {
  nodeId: number;
};

function createFormSchema(fields: Field[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {
    title: z.string().min(1, "Title is required"),
  };

  fields.forEach((field) => {
    if (field.type === "text" || field.type === "textarea") {
      schemaShape[field.id] = z.string();
    } else if (field.type === "select") {
      schemaShape[field.id] = z.string();
    } else if (field.type === "boolean") {
      schemaShape[field.id] = z.boolean();
    }
  });

  return z.object(schemaShape);
}

function nodeFieldsToFormValues(
  nodeFields: Record<string, Field>[] | undefined,
  nodeTitle: string,
) {
  const formValues: Record<string, string | boolean> = {
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

function formValuesToNodeFields(
  formValues: Record<string, string | boolean>,
  fieldDefinitions: Field[],
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

  const node = React.useMemo(
    () => nodes.find((n) => n.id === nodeId),
    [nodes, nodeId],
  );

  const fieldDefinitions = React.useMemo(
    () => (node ? NodeFieldsMap[node.type as NodeType] : []),
    [node],
  );

  const formSchema = React.useMemo(
    () => createFormSchema(fieldDefinitions),
    [fieldDefinitions],
  );

  const defaultValues = React.useMemo(
    () =>
      node ? nodeFieldsToFormValues(node.fields, node.title) : { title: "" },
    [node],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const nodesRef = React.useRef(nodes);
  React.useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  React.useEffect(() => {
    if (!node) return;

    const subscription = form.watch((formValues) => {
      const { title, ...fieldValues } = formValues as Record<
        string,
        string | boolean
      >;

      const updatedFields = formValuesToNodeFields(
        fieldValues,
        fieldDefinitions,
      );

      const updatedNodes = nodesRef.current.map((n) =>
        n.id === nodeId
          ? { ...n, title: (title as string) || n.title, fields: updatedFields }
          : n,
      );

      setNodes(updatedNodes);
    });

    return () => subscription.unsubscribe();
  }, [form, nodeId, setNodes, fieldDefinitions, node]);

  if (!node) return null;

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value as string}
                  placeholder="Enter node title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fieldDefinitions.map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id as keyof z.infer<typeof formSchema>}
            render={({ field: formField }) => (
              <FormItem
                className={cn(
                  field.type === "boolean" &&
                    "flex flex-row items-center justify-between",
                )}
              >
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === "select" ? (
                    <Select {...formField} value={formField.value as string}>
                      {field.options.map((option) => (
                        <SelectOption key={option} value={option}>
                          {option}
                        </SelectOption>
                      ))}
                    </Select>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      {...formField}
                      value={formField.value as string}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "boolean" ? (
                    <Switch
                      size="sm"
                      checked={formField.value as boolean}
                      onCheckedChange={formField.onChange}
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
