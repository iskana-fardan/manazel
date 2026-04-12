import { Stack, TextField, MenuItem, IconButton, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
import type { BookFormValues } from "../book.schema";

interface Props {
  control: Control<BookFormValues>;
  register: UseFormRegister<BookFormValues>;
}

export default function ResourceFields({ control, register }: Props) {
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "resources",
  });

  return (
    <Box mt={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <b>Resources</b>
        <Button
          size="small"
          onClick={() =>
            append({
              label: "",
              type: "pdf",
              url: "",
            })
          }
        >
          Add Resource
        </Button>
      </Stack>

      <Stack spacing={2} mt={2}>
        {fields.map((item, index) => (
          <Stack direction="row" spacing={2} key={item.id}>
            <TextField
              label="Label"
              {...register(`resources.${index}.label`)}
              fullWidth
            />

            <Controller
              control={control}
              name={`resources.${index}.type`}
              render={({ field }) => (
                <TextField select label="Type" fullWidth {...field}>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                </TextField>
              )}
            />

            <TextField
              label="URL"
              {...register(`resources.${index}.url`)}
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