import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContributors } from "../../../hooks/useContributors";

export default function RecentContributorsTable() {
  const { data: contributors = [], isLoading } = useContributors();

  const recent = [...contributors]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader title="Recent Contributors" titleTypographyProps={{ variant: "h6" }} />
      <CardContent sx={{ pt: 0 }}>
        {isLoading ? (
          <Skeleton variant="rectangular" height={200} />
        ) : recent.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No contributors yet.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((contributor) => (
                <TableRow key={contributor._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        src={contributor.avatar ?? ""}
                        sx={{ width: 28, height: 28, fontSize: 12 }}
                      >
                        {contributor.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">{contributor.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{contributor.role}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 280,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {contributor.description ?? "—"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
