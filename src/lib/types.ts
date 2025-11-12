import { z } from "zod";

/**
 * Types (using Zod)
 * Using Zod could be overkill but having extra validation is good
 * Also runtime validation helps in this case where the data shape is non-trival
 */

export const NodeTypeSchema = z.enum(["http", "code", "webhook"]);
export type NodeType = z.infer<typeof NodeTypeSchema>;

const BaseFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal("text"),
  value: z.string(),
  placeholder: z.string().optional(),
});

const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal("select"),
  value: z.string(),
  options: z.array(z.string()),
});

const TextareaFieldSchema = BaseFieldSchema.extend({
  type: z.literal("textarea"),
  value: z.string(),
  placeholder: z.string().optional(),
});

export const FieldSchema = z.discriminatedUnion("type", [
  TextFieldSchema,
  SelectFieldSchema,
  TextareaFieldSchema,
]);

export type Field = z.infer<typeof FieldSchema>;

export const NodeSchema = z.object({
  id: z.number(),
  type: NodeTypeSchema,
  title: z.string(),
  isActive: z.boolean(),
  fields: z.array(z.record(z.string(), z.any())),
  metadata: z.array(z.any()),
});

export type Node = z.infer<typeof NodeSchema>;

/** NODE DETAIL TYPES */
export const NodeFieldsHttp = [
  {
    id: "http_input_1",
    label: "Method",
    type: "select" as const,
    options: ["GET", "POST", "DELETE", "HEAD", "OPTIONS", "PUT", "PATCH"],
    value: "GET",
  },
  {
    id: "http_input_2",
    label: "URL",
    type: "text" as const,
    value: "",
    placeholder: "https://example.com",
  },
] satisfies Field[];

export const NodeFieldsCode = [
  {
    id: "code_input_1",
    label: "Code",
    type: "textarea" as const,
    value: "",
    placeholder: "// Write your code here",
  },
] satisfies Field[];

export const NodeFieldsWebhook = [
  {
    id: "webhook_input_1",
    label: "Webhook URL",
    type: "text" as const,
    value: "",
    placeholder: "https://your-webhook.com/endpoint",
  },
] satisfies Field[];

export const NodeFieldsMap = {
  http: NodeFieldsHttp,
  code: NodeFieldsCode,
  webhook: NodeFieldsWebhook,
} as const satisfies Record<NodeType, Field[]>;
