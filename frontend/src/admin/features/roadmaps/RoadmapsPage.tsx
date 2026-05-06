import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useBooks } from "../../../features/books/use-books";
import { useFields } from "../../../features/fields/use-fields";
import {
  useAddBookToSection,
  useCreateRoadmap,
  useRemoveBookFromSection,
  useRoadmap,
} from "../../../features/roadmaps/use-roadmap";
import { LevelCard } from "./components/LevelCard";
import { SectionCard } from "./components/SectionCard";

const LEVELS = [
  { slug: "beginner", label: "Beginner" },
  { slug: "intermediate", label: "Intermediate" },
  { slug: "advanced", label: "Advanced" },
] as const;

const RoadmapsPage = () => {
  const [selectedField, setSelectedField] = useState("");

  const { data: fields = [] } = useFields();
  const { data: books = [] } = useBooks();
  const {
    data: roadmap,
    isLoading: roadmapLoading,
    isError: roadmapError,
  } = useRoadmap(selectedField);

  const addBook = useAddBookToSection(selectedField);
  const removeBook = useRemoveBookFromSection(selectedField);
  const createRoadmap = useCreateRoadmap(selectedField);

  const getBooksForLevel = (
    section: "dars" | "muthalaah",
    levelSlug: string
  ): string[] => {
    if (!roadmap) return [];
    const levels = section === "dars" ? roadmap.levels : roadmap.muthalaah;
    return levels.find((l) => l.slug === levelSlug)?.books ?? [];
  };

  const handleAddBook = (
    section: "dars" | "muthalaah",
    levelSlug: string,
    bookId: string
  ) => {
    addBook.mutate({ section, levelSlug, bookId });
  };

  const handleRemoveBook = (
    section: "dars" | "muthalaah",
    levelSlug: string,
    bookId: string
  ) => {
    removeBook.mutate({ section, levelSlug, bookId });
  };

  const mutating = addBook.isPending || removeBook.isPending;

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Roadmaps Management
          </Typography>
          <Typography color="text.secondary">
            Organize learning paths for each field.
          </Typography>
        </Box>

        <FormControl fullWidth>
          <InputLabel>Select Field</InputLabel>
          <Select
            value={selectedField}
            label="Select Field"
            onChange={(e) => setSelectedField(e.target.value)}
          >
            {fields.map((f) => (
              <MenuItem key={f._id} value={f.slug}>
                {f.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!selectedField ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Select a field to manage its roadmap.
          </Typography>
        ) : roadmapLoading ? (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
          </Stack>
        ) : roadmapError || !roadmap ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary" mb={2}>
              No roadmap found for this field.
            </Typography>
            <Button
              variant="contained"
              onClick={() => createRoadmap.mutate()}
              disabled={createRoadmap.isPending}
            >
              Create Roadmap
            </Button>
          </Box>
        ) : (
          <Stack spacing={3}>
            <SectionCard title="Dars">
              <Stack spacing={3} divider={<Divider />}>
                {LEVELS.map((level) => (
                  <LevelCard
                    key={level.slug}
                    label={level.label}
                    bookIds={getBooksForLevel("dars", level.slug)}
                    allBooks={books}
                    onAddBook={(bookId) =>
                      handleAddBook("dars", level.slug, bookId)
                    }
                    onRemoveBook={(bookId) =>
                      handleRemoveBook("dars", level.slug, bookId)
                    }
                    loading={mutating}
                  />
                ))}
              </Stack>
            </SectionCard>

            <SectionCard title="Muthalaah">
              <Stack spacing={3} divider={<Divider />}>
                {LEVELS.map((level) => (
                  <LevelCard
                    key={level.slug}
                    label={level.label}
                    bookIds={getBooksForLevel("muthalaah", level.slug)}
                    allBooks={books}
                    onAddBook={(bookId) =>
                      handleAddBook("muthalaah", level.slug, bookId)
                    }
                    onRemoveBook={(bookId) =>
                      handleRemoveBook("muthalaah", level.slug, bookId)
                    }
                    loading={mutating}
                  />
                ))}
              </Stack>
            </SectionCard>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default RoadmapsPage;
