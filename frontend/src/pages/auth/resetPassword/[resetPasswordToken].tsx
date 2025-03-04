import {
  Button,
  Container,
  createStyles,
  Group,
  Paper,
  PasswordInput,
  Text,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useRouter } from "next/router";
import * as yup from "yup";
import authService from "../../../services/auth.service";
import toast from "../../../utils/toast.util";

const useStyles = createStyles((theme) => ({
  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
    },
  },
}));

const ResetPassword = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      password: "",
    },
    validate: yupResolver(
      yup.object().shape({
        password: yup.string().min(8).required(),
      })
    ),
  });

  const resetPasswordToken = router.query.resetPasswordToken as string;

  return (
    <Container size={460} my={30}>
      <Title order={2} weight={900} align="center">
        重置密码
      </Title>
      <Text color="dimmed" size="sm" align="center">
        输入您的新密码
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form
          onSubmit={form.onSubmit((values) => {
            authService
              .resetPassword(resetPasswordToken, values.password)
              .then(() => {
                toast.success("您的密码已成功重置.");

                router.push("/auth/signIn");
              })
              .catch(toast.axiosError);
          })}
        >
          <PasswordInput
            label="新密码"
            placeholder="••••••••••"
            {...form.getInputProps("password")}
          />
          <Group position="right" mt="lg">
            <Button type="submit" className={classes.control}>
              重置密码
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
