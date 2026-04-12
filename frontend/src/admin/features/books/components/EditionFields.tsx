import { Stack, TextField, IconButton, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
import type { BookFormValues } from "../book.schema";

interface Props {
  control: Control<BookFormValues>;
  register: UseFormRegister<BookFormValues>;
}

export default function EditionFields({ control, register }: Props) {
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "recommendedEditions",
  });

  return (
    <Box mt={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <b>Recommended Editions</b>

        <Button
          size="small"
          onClick={() =>
            append({
              label: "",
              publisher: "",
              note: "",
            })
          }
        >
          Add Edition
        </Button>
      </Stack>

      <Stack spacing={2} mt={2}>
        {fields.map((item, index) => (
          <Stack direction="row" spacing={2} key={item.id}>
            <TextField
              label="Edition Label"
              {...register(`recommendedEditions.${index}.label`)}
              fullWidth
            />

            <TextField
              label="Publisher"
              {...register(`recommendedEditions.${index}.publisher`)}
              fullWidth
            />

            <TextField
              label="Note"
              {...register(`recommendedEditions.${index}.note`)}
              fullWidth
            />

            <IconButton onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}