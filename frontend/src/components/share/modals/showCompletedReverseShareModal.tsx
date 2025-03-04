import { ActionIcon, Button, Stack, TextInput } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { TbCopy } from "react-icons/tb";
import toast from "../../../utils/toast.util";

const showCompletedReverseShareModal = (
  modals: ModalsContextProps,
  link: string,
  getReverseShares: () => void
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: "外部分享链接",
    children: <Body link={link} getReverseShares={getReverseShares} />,
  });
};

const Body = ({
  link,
  getReverseShares,
}: {
  link: string;
  getReverseShares: () => void;
}) => {
  const clipboard = useClipboard({ timeout: 500 });
  const modals = useModals();

  return (
    <Stack align="stretch">
      <TextInput
        readOnly
        variant="filled"
        value={link}
        rightSection={
          window.isSecureContext && (
            <ActionIcon
              onClick={() => {
                clipboard.copy(link);
                toast.success("您的链接已复制到剪贴板.");
              }}
            >
              <TbCopy />
            </ActionIcon>
          )
        }
      />

      <Button
        onClick={() => {
          modals.closeAll();
          getReverseShares();
        }}
      >
        完成
      </Button>
    </Stack>
  );
};

export default showCompletedReverseShareModal;
