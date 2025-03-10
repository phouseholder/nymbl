import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./MyModal.module.css";

interface IMyModal {
  children: React.ReactNode;
  centered?: boolean;
  close: () => void;
  fullscreen?: boolean;
  opened: boolean;
  size?: string;
  title?: string;
}

export default function MyModal({
  children,
  centered,
  close,
  fullscreen,
  opened,
  size,
  title,
}: IMyModal) {
  const isTablet = useMediaQuery("(max-width: 48em)");

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        fullScreen={isTablet || fullscreen}
        data-centered={centered}
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
        size={size}
        classNames={{
          content: classes.modal,
          header: classes.header,
          title: classes.title,
        }}
      >
        {children}
      </Modal>
    </>
  );
}
