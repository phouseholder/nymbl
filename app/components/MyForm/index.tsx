import { type IModelField } from "~/models";
import {
  NumberInput,
  TextInput,
  Select,
  Button,
  Grid,
  PasswordInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import database from "~/postgrest/database";
import { type Database } from "~/postgrest/database";
import React, { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { IconX, IconCheck } from "@tabler/icons-react";
import classes from "./MyForm.module.css";

export interface IListData {
  label: string;
  value: string;
}

interface IMyForm {
  action?: string;
  cancelText?: string;
  color?: string;
  children?: React.ReactNode;
  defaultValues?: Partial<Database["Tables"][keyof Database["Tables"]]["Row"]>;
  submitText?: string;
  fields?: IModelField[];
  method: "POST" | "PATCH" | "DELETE" | undefined;
  onSubmit: () => void;
  onCancel: () => void;
}

async function getListData<T extends keyof Database["Tables"]>(
  modelFields: IModelField[],
  table: T
) {
  const data = await database.findAll(table, undefined, modelFields);
  const valueField =
    modelFields.find((field) => field.name === "id")?.name || "id";
  const labelField =
    modelFields.find((field) => field.list_title)?.name || "title";

  const listData = data.map((item: any) => ({
    label: item[labelField] || "",
    value: item[valueField],
  }));

  return listData;
}

function ListField({ field, defaults, inputProps }: { field: IModelField; defaults: any; inputProps: any }) {
  const [listData, setListData] = useState<IListData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getListData(field.list_fields!, field.list_type!);
        setListData(data);
      } catch (error) {
        console.error('Error loading list data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [field.list_type, field.list_fields]);

  return (
    <Grid.Col key={field.name}>
      <Select
        name={field.name}
        label={field.label}
        data={listData}
        defaultValue={defaults ? defaults[field.name] : undefined}
        clearable
        searchable
        disabled={isLoading}
        {...inputProps}
      />
    </Grid.Col>
  );
}

function renderFields(
  fields: IModelField[] | undefined,
  defaults?: any | undefined
) {
  if (fields === undefined) {
    return;
  }

  const inputProps = {
    classNames: {
      label: classes.label,
      input: classes.input,
    },
  };

  return fields
    .filter((field) => field.name !== "id")
    .map((field) => {
      switch (field.type) {
        case "string":
          return (
            <Grid.Col key={field.name}>
              <TextInput
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                defaultValue={defaults ? defaults[field.name] : undefined}
                {...inputProps}
              />
            </Grid.Col>
          );
        case "number":
          return (
            <Grid.Col key={field.name}>
              <NumberInput
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                defaultValue={defaults ? defaults[field.name] : undefined}
                {...inputProps}
              />
            </Grid.Col>
          );
        case "password":
          return (
            <Grid.Col key={field.name}>
              <PasswordInput
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                defaultValue={defaults ? defaults[field.name] : undefined}
                {...inputProps}
              />
            </Grid.Col>
          );
        case "date":
          return (
            <Grid.Col key={field.name}>
              <DateInput
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                defaultValue={
                  defaults
                    ? new Date(
                        new Date(defaults[field.name]).getTime() +
                          new Date(defaults[field.name]).getTimezoneOffset() * 60000
                      )
                    : undefined
                }
                {...inputProps}
              />
            </Grid.Col>
          );
        case "list":
          return (
            <ListField 
              key={field.name}
              field={field}
              defaults={defaults}
              inputProps={inputProps}
            />
          );
      }
    });
}

export default function MyForm({
  action,
  cancelText = "Cancel",
  color,
  children,
  defaultValues,
  submitText = "Submit",
  fields,
  method,
  onSubmit,
  onCancel,
}: IMyForm) {
  const fetcher = useFetcher({ key: "form" });

  return (
    <fetcher.Form method={method} action={action} className={classes.form}>
      <div className={classes.formContent}>
        <Grid grow>
          {renderFields(fields, defaultValues)}
          {children}
        </Grid>
      </div>
      <div className={classes.actions}>
        <Button
          size="sm"
          variant="light"
          onClick={onCancel}
          color="red"
          leftSection={<IconX size={16} />}
        >
          {cancelText}
        </Button>
        <Button
          size="sm"
          type="submit"
          variant="light"
          onClick={onSubmit}
          color={color}
          leftSection={<IconCheck size={16} />}
        >
          {submitText}
        </Button>
      </div>
    </fetcher.Form>
  );
}
