import { Box, Card, CardContent, Skeleton, Typography, alpha } from "@mui/material";
import type { ElementType } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  isLoading?: boolean;
  icon?: ElementType;
  color?: string;
}

export default function StatCard({
  label,
  value,
  isLoading,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardContent
        sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}
      >
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={1.5}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
              sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
            >
              {label}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {isLoading ? (
                <Skeleton variant="text" width={64} height={44} />
              ) : (
                <Typography variant="h4" fontWeight={700} lineHeight={1}>
                  {value}
                </Typography>
              )}
            </Box>
          </Box>

          {Icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (t) =>
                  alpha(color ?? t.palette.primary.main, 0.12),
              }}
            >
              <Icon
                sx={{
                  fontSize: 22,
                  color: color ?? "primary.main",
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
