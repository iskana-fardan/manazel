import { Stack, TextField, MenuItem } from "@mui/material";
import type { Field } from "../../../../types/api";
import type { BookFormValues } from "../../../../features/books/books.schema";
import {
  type Control,
  type UseFormRegister,
  type FieldErrors,
  Controller,
 
} from "react-hook-form";

interface Props {
  register: UseFormRegister<BookFormValues>;
  errors: FieldErrors<BookFormValues>;
  fields: Field[];
  control: Control<BookFormValues>;
}

export default function BookFormFields({
  register,
  errors,
  fields,
  control,
}: Props) {
  return (
    <>
      <TextField
        label="Title"
        {...register("title")}
        error={!!errors.title}
        helperText={errors.title?.message}
        fullWidth
      />

      <TextField
        label="Title Arabic"
        {...register("titleArabic")}
        error={!!errors.titleArabic}
        helperText={errors.titleArabic?.message}
        fullWidth
      />

      <TextField
        label="Author"
        {...register("author")}
        error={!!errors.author}
        helperText={errors.author?.message}
        fullWidth
      />

      <Stack direction="row" spacing={2}>
        
        {/* FIELD */}
        <Controller
          name="field"
          control={control}
          render={({ field }) => (
            <TextField select label="Field" sx={{ flex: 1 }} {...field}>
              {fields.map((f) => (
                <MenuItem key={f._id} value={f.name}>
                  {f.slug}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* LEVEL */}
        <Controller
          name="level"
          control={control}
          render={({ field }) => (
            <TextField select label="Level" sx={{ flex: 1 }} {...field}>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
          )}
        />

        {/* TYPE */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField select label="Type" sx={{ flex: 1 }} {...field}>
              <MenuItem value="dars">Dars</MenuItem>
              <MenuItem value="muthalaah">Muthalaah</MenuItem>
            </TextField>
          )}
        />
      </Stack>

      <TextField
        multiline
        label="Description"
        {...register("description")}
        fullWidth
      />

      <TextField
        multiline
        label="Recommended Usage"
        {...register("recommendedUsage")}
        fullWidth
      />
    </>
  );
}