import { Stack, Typography } from '@mui/material'

const Mission = () => {
  return (
    <Stack spacing={2} sx={{mb:8}}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
            Misi Kami
        </Typography>

        <Typography color="text.secondary">
            Peta Ilmu Islam hadir untuk membantu penuntut ilmu
            menavigasi luasnya khazanah keilmuan Islam yang diwariskan para ulama.
        </Typography>

        <Typography color="text.secondary">
            Kami memahami bahwa memulai perjalanan menuntut ilmu sering kali membingungkan:
            banyak kitab, beragam pendapat, dan tidak sedikit kebingungan harus mulai dari mana.
        </Typography>

        <Typography color="text.secondary">
            Melalui peta belajar yang terstruktur dan bertahap,
            kami berupaya memudahkan penuntut ilmu dalam menempuh jalur belajar
            yang lebih jelas, sistematis, dan selaras dengan metodologi keilmuan Islam.
        </Typography>

        <Typography color="text.secondary">
           Peta ini tidak dimaksudkan untuk menggantikan peran guru,
            melainkan sebagai panduan arah dalam menempuh perjalanan ilmiah.
        </Typography>
    </Stack>
  )
}

export default Mission