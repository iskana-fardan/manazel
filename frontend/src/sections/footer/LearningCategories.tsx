import Grid from "@mui/material/Grid"
import { Stack, Typography } from "@mui/material"

const categories = [
  "Fikih",
  "Ushul Fikih",
  "Nahwu",
  "Sharaf",
  "Balaghah",
  "Aqidah",
  "Hadis & Musthalah",
  "Tafsir",
]

const middle = Math.ceil(categories.length / 2)
const leftCategories = categories.slice(0, middle)
const rightCategories = categories.slice(middle)

const LearningCategories = () => {
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
              {leftCategories.map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* KANAN */}
          <Grid size={6}>
            <Stack spacing={1}>
              {rightCategories.map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  {item}
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
