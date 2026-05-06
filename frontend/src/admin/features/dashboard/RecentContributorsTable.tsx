import {
  alpha,
  Avatar,
  Box,
  Button,
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
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";
import { useContributors } from "../../../features/contributors/use-contributors";

const HEAD_CELLS = ["Name", "Role", "Description"];

export default function RecentContributorsTable() {
  const { data: contributors = [], isLoading } = useContributors();

  const recent = [...contributors]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 5);

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            Recent Contributors
          </Typography>
        }
        action={
          <Button component={Link} to="/admin/contributors" size="small">
            View all
          </Button>
        }
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ pt: 1.5, px: 0, "&:last-child": { pb: 0 } }}>
        {isLoading ? (
          <Box sx={{ px: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={46} sx={{ mb: 0.5 }} />
            ))}
          </Box>
        ) : recent.length === 0 ? (
          <Box
            sx={{
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PeopleIcon sx={{ fontSize: 40, color: "text.disabled" }} />
            <Typography variant="body2" color="text.disabled">
              No contributors yet.
            </Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                  },
                }}
              >
                {HEAD_CELLS.map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {recent.map((contributor) => (
                <TableRow
                  key={contributor._id}
                  sx={{
                    "&:hover": {
                      bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
                    },
                    "&:last-child td": { border: 0 },
                    "& td": { py: 1.2 },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={contributor.avatar ?? ""}
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 12,
                          fontWeight: 700,
                          bgcolor: "primary.main",
                        }}
                      >
                        {contributor.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {contributor.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {contributor.role}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
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
