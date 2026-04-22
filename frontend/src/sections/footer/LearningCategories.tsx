import Grid from "@mui/material/Grid"
import { Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useFields } from "../../hooks/useFields"

const LearningCategories = () => {
  const { data: fields = [] } = useFields()

  const middle = Math.ceil(fields.length / 2)
  const leftFields = fields.slice(0, middle)
  const rightFields = fields.slice(middle)

  return (
    //  ini item footer (3 kolom desktop)
    <Grid size={{ xs: 12, md: 4 }}>
      <Stack spacing={2}>
        <Typography fontWeight={600}>
          Bidang Ilmu
        </Typography>

        {/* Grid container */}
        <Grid container columnSpacing={4}>
          {/* KIRI */}
          <Grid size={6}>
            <Stack spacing={1}>
              {leftFields.map((field) => (
                <Typography
                  key={field.slug}
                  variant="body2"
                  component={Link}
                  to={`/roadmap/${field.slug}`}
                  sx={{ color: "text.secondary", textDecoration: "none" }}
                >
                  {field.name}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* KANAN */}
          <Grid size={6}>
            <Stack spacing={1}>
              {rightFields.map((field) => (
                <Typography
                  key={field.slug}
                  variant="body2"
                  component={Link}
                  to={`/roadmap/${field.slug}`}
                  sx={{ color: "text.secondary", textDecoration: "none" }}
                >
                  {field.name}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  )
}

export default LearningCategories
