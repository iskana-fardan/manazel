import { Stack, Typography } from '@mui/material'

const Contribution = () => {
  return (
    <Stack spacing={2} sx={{mb: 8}}>
        <Typography variant='h6' fontWeight={600} color='text.primary'>
            Kontribusi
        </Typography>
        <Typography color='text.secondary'>
            Peta Ilmu Islam merupakan inisiatif terbuka
            yang dapat dikembangkan bersama oleh penuntut ilmu, pengajar,
            dan siapa pun yang peduli terhadap keberlangsungan tradisi keilmuan Islam.
        </Typography>
        <Typography color='text.secondary'>
            Jika Anda memiliki saran perbaikan, tambahan kitab,
            atau koreksi informasi, silakan menghubungi kami melalui kanal yang tersedia.
        </Typography>
        <Typography color='text.secondary'>
            Semoga Allah memberkahi setiap langkah dalam menuntut ilmu
dan         menjadikannya ilmu yang bermanfaat.
        </Typography>
    </Stack>
  )
}

export default Contribution