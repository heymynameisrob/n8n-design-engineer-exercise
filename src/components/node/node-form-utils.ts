import { z } from "zod";
import type { Field } from "@/lib/types";

export function createFormSchema(fields: Field[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {
    title: z.string().min(1, "Title is required"),
  };

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    if (field.type === "text") {
      fieldSchema = z.string();

      // Apply required validation
      if (field.required) {
        fieldSchema = fieldSchema.min(
          field.minLength ?? 1,
          `${field.label} is required`,
        );
      }

      // Apply URL validation
      if (field.validationType === "url") {
        fieldSchema = fieldSchema.url("Please enter a valid URL");
      }

      // Apply email validation
      if (field.validationType === "email") {
        fieldSchema = fieldSchema.email("Please enter a valid email");
      }

      schemaShape[field.id] = fieldSchema;
    } else if (field.type === "textarea") {
      fieldSchema = z.string();

      // Apply required validation
      if (field.required) {
        fieldSchema = fieldSchema.min(
          field.minLength ?? 1,
          `${field.label} is required`,
        );
      }

      // Apply custom validation (e.g., whitespace check for code)
      if (field.customValidation) {
        fieldSchema = fieldSchema.refine(
          (value) => value.trim().length > 0,
          {
            message: field.customValidation.message,
          },
        );
      }

      schemaShape[field.id] = fieldSchema;
    } else if (field.type === "select") {
      schemaShape[field.id] = z.string();
    } else if (field.type === "boolean") {
      schemaShape[field.id] = z.boolean();
    }
  });

  return z.object(schemaShape);
}

export function nodeFieldsToFormValues(
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

export function formValuesToNodeFields(
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
