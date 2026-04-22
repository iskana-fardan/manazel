import { Grid } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import MapIcon from "@mui/icons-material/Map";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PeopleIcon from "@mui/icons-material/People";
import StatCard from "../../components/StatCard";
import { useBooks } from "../../../hooks/useBooks";
import { useFields } from "../../../hooks/useFields";
import { useContributors } from "../../../hooks/useContributors";
import { useAllRoadmaps } from "../../../hooks/useRoadmaps";

const STATS_CONFIG = [
  { label: "Total Fields",       icon: CategoryIcon,    color: "#0f766e" },
  { label: "Total Books",        icon: AutoStoriesIcon, color: "#3b82f6" },
  { label: "Total Roadmaps",     icon: MapIcon,         color: "#a855f7" },
  { label: "Total Contributors", icon: PeopleIcon,      color: "#f59e0b" },
] as const;

export default function StatsSection() {
  const { data: books,        isLoading: booksLoading }        = useBooks();
  const { data: fields,       isLoading: fieldsLoading }       = useFields();
  const { data: contributors, isLoading: contributorsLoading } = useContributors();
  const { data: roadmaps,     isLoading: roadmapsLoading }     = useAllRoadmaps();

  const stats = [
    { ...STATS_CONFIG[0], value: fields?.length       ?? 0, isLoading: fieldsLoading },
    { ...STATS_CONFIG[1], value: books?.length        ?? 0, isLoading: booksLoading },
    { ...STATS_CONFIG[2], value: roadmaps?.length     ?? 0, isLoading: roadmapsLoading },
    { ...STATS_CONFIG[3], value: contributors?.length ?? 0, isLoading: contributorsLoading },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label={stat.label}
            value={stat.value}
            isLoading={stat.isLoading}
            icon={stat.icon}
            color={stat.color}
          />
        </Grid>
      ))}
    </Grid>
  );
}
