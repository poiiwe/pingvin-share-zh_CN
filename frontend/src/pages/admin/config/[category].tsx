import {
  AppShell,
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminConfigInput from "../../../components/admin/configuration/AdminConfigInput";
import ConfigurationHeader from "../../../components/admin/configuration/ConfigurationHeader";
import ConfigurationNavBar from "../../../components/admin/configuration/ConfigurationNavBar";
import LogoConfigInput from "../../../components/admin/configuration/LogoConfigInput";
import TestEmailButton from "../../../components/admin/configuration/TestEmailButton";
import CenterLoader from "../../../components/core/CenterLoader";
import Meta from "../../../components/Meta";
import useConfig from "../../../hooks/config.hook";
import configService from "../../../services/config.service";
import { AdminConfig, UpdateConfig } from "../../../types/config.type";
import {
  capitalizeFirstLetter,
  configVariableToFriendlyName,
} from "../../../utils/string.util";
import toast from "../../../utils/toast.util";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const router = useRouter();

  const [isMobileNavBarOpened, setIsMobileNavBarOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 560px)");
  const config = useConfig();

  const categoryId = (router.query.category as string | undefined) ?? "general";

  const [configVariables, setConfigVariables] = useState<AdminConfig[]>();
  const [updatedConfigVariables, setUpdatedConfigVariables] = useState<
    UpdateConfig[]
  >([]);

  const [logo, setLogo] = useState<File | null>(null);

  const saveConfigVariables = async () => {
    if (logo) {
      configService
        .changeLogo(logo)
        .then(() => {
          setLogo(null);
          toast.success(
            "Logo更新成功。在网站上更新可能需要几分钟时间."
          );
        })
        .catch(toast.axiosError);
    }

    if (updatedConfigVariables.length > 0) {
      await configService
        .updateMany(updatedConfigVariables)
        .then(() => {
          setUpdatedConfigVariables([]);
          toast.success("配置更新成功");
        })
        .catch(toast.axiosError);
      config.refresh();
    }
  };

  const updateConfigVariable = (configVariable: UpdateConfig) => {
    const index = updatedConfigVariables.findIndex(
      (item) => item.key === configVariable.key
    );
    if (index > -1) {
      updatedConfigVariables[index] = configVariable;
    } else {
      setUpdatedConfigVariables([...updatedConfigVariables, configVariable]);
    }
  };

  useEffect(() => {
    configService.getByCategory(categoryId).then((configVariables) => {
      setConfigVariables(configVariables);
    });
  }, [categoryId]);

  return (
    <>
      <Meta title="配置" />
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbar={
          <ConfigurationNavBar
            categoryId={categoryId}
            isMobileNavBarOpened={isMobileNavBarOpened}
            setIsMobileNavBarOpened={setIsMobileNavBarOpened}
          />
        }
        header={
          <ConfigurationHeader
            isMobileNavBarOpened={isMobileNavBarOpened}
            setIsMobileNavBarOpened={setIsMobileNavBarOpened}
          />
        }
      >
        <Container size="lg">
          {!configVariables ? (
            <CenterLoader />
          ) : (
            <>
              <Stack>
                <Title mb="md" order={3}>
                  {capitalizeFirstLetter(categoryId)}
                </Title>
                {configVariables.map((configVariable) => (
                  <Group key={configVariable.key} position="apart">
                    <Stack
                      style={{ maxWidth: isMobile ? "100%" : "40%" }}
                      spacing={0}
                    >
                      <Title order={6}>
                        {configVariableToFriendlyName(configVariable.name)}
                      </Title>
                      <Text color="dimmed" size="sm" mb="xs">
                        {configVariable.description}
                      </Text>
                    </Stack>
                    <Stack></Stack>
                    <Box style={{ width: isMobile ? "100%" : "50%" }}>
                      <AdminConfigInput
                        key={configVariable.key}
                        configVariable={configVariable}
                        updateConfigVariable={updateConfigVariable}
                      />
                    </Box>
                  </Group>
                ))}
                {categoryId == "general" && (
                  <LogoConfigInput logo={logo} setLogo={setLogo} />
                )}
              </Stack>
              <Group mt="lg" position="right">
                {categoryId == "smtp" && (
                  <TestEmailButton
                    configVariablesChanged={updatedConfigVariables.length != 0}
                    saveConfigVariables={saveConfigVariables}
                  />
                )}
                <Button onClick={saveConfigVariables}>保存</Button>
              </Group>
            </>
          )}
        </Container>
      </AppShell>
    </>
  );
}
