import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitHub, Instagram, Language } from "@mui/icons-material";

import {
  contributorSchema,
  type ContributorFormValues,
} from "./contributor.schema";
import type { Contributor } from "./contributors.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ContributorFormValues) => void;
  initialData?: Contributor | null;
  loading?: boolean;
}

const defaultValues: ContributorFormValues = {
  name: "",
  role: "",
  description: "",
  avatar: "",
  socials: {
    github: "",
    instagram: "",
    website: "",
  },
};

export default function ContributorDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributorFormValues>({
    resolver: zodResolver(contributorSchema),
    defaultValues,
  });

  // ✅ Handle edit / create mode
  useEffect(() => {
    if (initialData) {
      reset({
        ...defaultValues,
        ...initialData,
        socials: {
          ...defaultValues.socials,
          ...initialData.socials,
        },
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Contributor" : "Add New Contributor"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {/* Name */}
            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            {/* Role */}
            <TextField
              label="Role"
              fullWidth
              {...register("role")}
              error={!!errors.role}
              helperText={errors.role?.message}
            />

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            {/* Avatar */}
            <TextField
              label="Avatar URL"
              fullWidth
              multiline
              rows={2}
              {...register("avatar")}
              error={!!errors.avatar}
              helperText={errors.avatar?.message || "Paste image URL"}
            />

            {/* Social Links */}
            <Typography variant="subtitle2" color="text.secondary">
              Social Links (optional)
            </Typography>

            <Stack spacing={1}>
              {/* GitHub */}
              <TextField
                    label="GitHub"
                    fullWidth
                    placeholder="https://github.com/username"
                    {...register("socials.github")}
                    error={!!errors.socials?.github}
                    helperText={errors.socials?.github?.message}
                    slotProps={{
                        input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <GitHub fontSize="small" />
                            </InputAdornment>
                        ),
                        },
                    }}
                />

                <TextField
                    label="Instagram"
                    fullWidth
                    placeholder="https://instagram.com/username"
                    {...register("socials.instagram")}
                    error={!!errors.socials?.instagram}
                    helperText={errors.socials?.instagram?.message}
                    slotProps={{
                        input: {
                        startAdornment: (
                            <InputAdornment position="start">
                            <Instagram fontSize="small" />
                            </InputAdornment>
                        ),
                        },
                    }}
                />

                <TextField
                    label="Website"
                    fullWidth
                    placeholder="https://example.com"
                    {...register("socials.website")}
                    error={!!errors.socials?.website}
                    helperText={errors.socials?.website?.message}
                    slotProps={{
                        input: {
                        startAdornment: (
                            <InputAdornment position="start">
                            <Language fontSize="small" />
                            </InputAdornment>
                        ),
                        },
                    }}
                />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={20} />
            ) : initialData ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}