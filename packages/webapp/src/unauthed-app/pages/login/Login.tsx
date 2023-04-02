import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "~/feature";

export const Login = () => {
  const { login, loading, errors } = useAuth();

  const form = useForm<Credentials>({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: Credentials) => {
    login(values);
  };

  return (
    <Center w="100%" h="100%">
      <Paper w="40%" p="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@yourmail.com"
              required
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps("password")}
            />
            <Text color="red">
              {errors.login && errors.login.details.message}
            </Text>
            <Button fullWidth type="submit" loading={loading.login}>
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};
