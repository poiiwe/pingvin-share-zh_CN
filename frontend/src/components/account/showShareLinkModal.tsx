import { Stack, TextInput } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";

const showShareLinkModal = (
  modals: ModalsContextProps,
  shareId: string,
  appUrl: string
) => {
  const link = `${appUrl}/share/${shareId}`;
  return modals.openModal({
    title: "分享链接",
    children: (
      <Stack align="stretch">
        <TextInput variant="filled" value={link} />
      </Stack>
    ),
  });
};

export default showShareLinkModal;
