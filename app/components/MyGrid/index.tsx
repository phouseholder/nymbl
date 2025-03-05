import {
  type ColDef,
  ModuleRegistry,
  ClientSideRowModelModule,
  QuickFilterModule,
  PaginationModule,
  colorSchemeDark,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { type IModelField } from "~/models";
import {
  Group,
  Button,
  TextInput,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { MyModal, MyForm } from "~/components";
import GridActions from "./GridActions";
import { type Database } from "~/postgrest/database";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  QuickFilterModule,
  PaginationModule,
]);

interface IMyGrid {
  fields: IModelField[];
  formAction?: string;
  rowData: any[];
}

export default function MyGrid({ fields, formAction, rowData }: IMyGrid) {
  const [search, setSearch] = useState("");
  const [selectedID, setSelectedID] = useState("");
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const [delOpened, { open: delOpen, close: delClose }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] =
    useDisclosure(false);
  const [defaultValues, setDefaultValues] =
    useState<Partial<Database["Tables"][keyof Database["Tables"]]["Row"]>>();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const handleDelete = (id: string) => {
    delOpen();
    setSelectedID(id);
  };

  const handleEdit = (data: any) => {
    editOpen();
    setSelectedID(data.id);
    setDefaultValues(data);
  };

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const actions = {
    field: "id",
    headerName: "Actions",
    cellRenderer: (params: any) => {
      return (
        <GridActions
          onDelete={() => handleDelete(params.data.id)}
          onEdit={() => handleEdit(params.data)}
        />
      );
    },
    maxWidth: 105,
    resizable: false,
  };

  let colDefs: ColDef[] = fields
    .filter((field) => !["id"].includes(field.name))
    .map((field) => {
      return {
        field: field.name,
      };
    });

  colDefs = [actions, ...colDefs];

  return (
    <>
      <Group mb="sm" justify="space-between">
        <Group>
          <Button 
            size="sm" 
            onClick={addOpen} 
            variant="light" 
            color="green"
            leftSection={<IconPlus size={16} />}
          >
            Create
          </Button>
        </Group>
        <TextInput
          placeholder="Search"
          id="search"
          size="xs"
          w="30%"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
      </Group>
      <div style={{ height: 513 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{ flex: 1 }}
          quickFilterText={search}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50, 100]}
          theme={
            computedColorScheme === "dark"
              ? themeQuartz.withPart(colorSchemeDark)
              : undefined
          }
        />
      </div>
      <MyModal title="Delete Title" opened={delOpened} close={delClose}>
        <MyForm
          method="DELETE"
          onSubmit={delClose}
          onCancel={delClose}
          color="red"
          submitText="Delete"
          action={formAction}
        >
          <input type="text" name="id" value={selectedID} readOnly hidden />
          <Text mt="md" p="md" mb="md" size="lg" fw={700}>
            This action cannot be undone. Are you sure you want to proceed?
          </Text>
        </MyForm>
      </MyModal>
      <MyModal title="Create Title" opened={addOpened} close={addClose}>
        <MyForm
          fields={fields}
          method="POST"
          onSubmit={addClose}
          onCancel={addClose}
          color="green"
          submitText="Create"
          action={formAction}
        />
      </MyModal>
      <MyModal title="Edit Title" opened={editOpened} close={editClose}>
        <MyForm
          fields={fields}
          method="PATCH"
          onSubmit={editClose}
          onCancel={editClose}
          color="blue"
          defaultValues={defaultValues}
          action={formAction}
        >
          <input type="text" name="id" value={selectedID} readOnly hidden />
        </MyForm>
      </MyModal>
    </>
  );
}
