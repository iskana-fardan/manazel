import { Box, Stack, Typography, useTheme } from "@mui/material"


interface Step {
    id: number,
    title : string,
    description: string
}

const steps: Step[] = [
    {
        id: 1,
        title: "Pilih Bidang Ilmu",
        description: "Mulailah dengan memilih disiplin ilmu yang ingin dipelajari, seperti fikih, nahwu, tafsir, atau hadis."
    },
     {
        id: 2,
        title: "Ikuti Jalur Kitab Dars",
        description: "Pelajari kitab pelajaran secara bertahap,dimulai dari tingkat dasar bersama guru."
     },
     {
        id: 3,
        title: "Lengkapi dengan Kitab Muthala‘ah",
        description: "Gunakan kitab muthala‘ah sebagai bacaan tambahan untuk memperluas dan memperdalam pemahaman."
    },
    {
        id: 4,
        title: "Gunakan Sebagai Panduan, Bukan Target",
        description: "Peta ini membantu menjaga arah belajar,bukan untuk mengejar “penyelesaian” semata."
    }
]


const HowToUse = () => {
    const theme = useTheme();
  return (
    <Stack>
        <Typography variant="h6" fontWeight={600}>
            Cara Menggunakan Peta Ilmu Islam
        </Typography>

        <Stack spacing={2} sx={{mt: 2, mb: 8}}>
            {steps.map((step)=>(
                <Stack key={step.id} direction={"row"} spacing={2}>
                    <Box
                         sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: theme.palette.teal[100],
                            color: "text.primary",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 600,
                            flexShrink: 0,
                         }}
                    >
                        {step.id}
                    </Box>
                    <Stack>
                        <Typography fontWeight={600} sx={{color : "text.primary"}}>{step.title}</Typography>
                        <Typography sx={{color: "text.secondary"}}>{step.description}</Typography>
                    </Stack>
                </Stack>
            ))}
        </Stack>
    </Stack>
  )
}

export default HowToUse