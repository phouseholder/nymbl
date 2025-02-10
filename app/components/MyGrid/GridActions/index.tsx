import { Group, ActionIcon } from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";

interface IGridActions {
  onDelete: () => void;
  onEdit: () => void;
}

export default function GridActions({ onDelete, onEdit }: IGridActions) {
  return (
    <Group h={"100%"}>
      <ActionIcon variant="transparent" color="blue" onClick={onEdit}>
        <IconEdit />
      </ActionIcon>
      <ActionIcon variant="transparent" color="red" onClick={onDelete}>
        <IconTrash />
      </ActionIcon>
    </Group>
  );
}
