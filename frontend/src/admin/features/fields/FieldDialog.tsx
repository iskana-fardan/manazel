import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import type { Field } from "./fields.types";

interface FieldDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Field>) => void;
  initialData?: Field | null;
}

const emptyForm: Partial<Field> = {
  name: "",
  nameArabic: "",
  slug: "",
  description: "",
  icon: "",
  order: 0,
};

export default function FieldDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: FieldDialogProps) {

  const [form, setForm] = useState<Partial<Field>>(
    initialData ?? emptyForm
  );

  const handleChange = <K extends keyof Field>(
    key: K,
    value: Field[K]
  ) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Field" : "Add New Field"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            value={form.name ?? ""}
            onChange={e => handleChange("name", e.target.value)}
            fullWidth
          />
          <TextField
            label="Arabic Name"
            value={form.nameArabic ?? ""}
            onChange={e => handleChange("nameArabic", e.target.value)}
            fullWidth
          />
          <TextField
            label="Slug"
            value={form.slug ?? ""}
            onChange={e => handleChange("slug", e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description ?? ""}
            onChange={e => handleChange("description", e.target.value)}
            multiline
            rows={3}
          />
          <TextField
            label="Icon"
            value={form.icon ?? ""}
            onChange={e => handleChange("icon", e.target.value)}
            fullWidth
          />
          <TextField
            label="Order"
            type="number"
            value={form.order ?? 0}
            onChange={e => handleChange("order", Number(e.target.value))}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
