import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"

interface StatCardProps {
  label: string
  value: string | number
  isLoading?: boolean
}

export default function StatCard({ label, value, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Box sx={{ mt: 1 }}>
          {isLoading ? (
            <Skeleton variant="text" width={60} height={36} />
          ) : (
            <Typography variant="h5">
              {value}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
