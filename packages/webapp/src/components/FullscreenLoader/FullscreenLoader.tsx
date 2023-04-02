import { Center, Loader } from "@mantine/core";

export const FullscreenLoader = () => (
  <Center sx={{ width: "100vw", height: "100vh" }}>
    <Loader size="xl" />
  </Center>
);
