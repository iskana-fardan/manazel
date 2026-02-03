import { Card, CardContent, Typography, Box } from "@mui/material"

interface StatCardProps {
  label: string
  value: string | number
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Typography variant="h5">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
