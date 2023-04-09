import { Button } from "@mantine/core";
import { useState } from "react";
import { CreateListModal } from "./CreateListModal";

export const CreateListButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create new list</Button>
      {open && <CreateListModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
};
