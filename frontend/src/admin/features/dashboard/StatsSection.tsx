import { Grid } from "@mui/material";
import StatCard from "../../components/StatCard";
import { useBooks } from "../../../hooks/useBooks";
import { useFields } from "../../../hooks/useFields";
import { useContributors } from "../../../hooks/useContributors";
import { useAllRoadmaps } from "../../../hooks/useRoadmaps";

export default function StatsSection() {
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: fields, isLoading: fieldsLoading } = useFields();
  const { data: contributors, isLoading: contributorsLoading } = useContributors();
  const { data: roadmaps, isLoading: roadmapsLoading } = useAllRoadmaps();

  const stats = [
    { label: "Total Fields", value: fields?.length ?? 0, isLoading: fieldsLoading },
    { label: "Total Books", value: books?.length ?? 0, isLoading: booksLoading },
    { label: "Total Roadmaps", value: roadmaps?.length ?? 0, isLoading: roadmapsLoading },
    { label: "Total Contributors", value: contributors?.length ?? 0, isLoading: contributorsLoading },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label={stat.label} value={stat.value} isLoading={stat.isLoading} />
        </Grid>
      ))}
    </Grid>
  );
}
