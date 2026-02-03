import { Box, Card, CardContent, Stack, Typography, useTheme } from "@mui/material"
import { PiRadioButtonBold } from "react-icons/pi";


interface Note {
    id: number,
    title: string,
    description: string
}


const notes : Note[] = [
    {
        id: 1,
        title: "Utamakan guru:",
        description: "Ilmu Islam ditransmisikan melalui hubungan guru dan murid. Peta ini adalah panduan, bukan pengganti talaqqi."
    },
    {
        id: 2,
        title: "Bersabar dalam menuntut ilmu:",
        description: "Menguasai ilmu membutuhkan waktu, ketekunan, dan kedalaman,bukan kecepatan."
    },
    {
        id: 3,
        title: "Perbedaan kurikulum adalah hal wajar:",
        description: "Setiap daerah dan lembaga bisa memiliki urutan kitab yang berbeda.Gunakan peta ini sesuai konteks dan bimbingan guru setempat."
    }
]

const ImportantNotes = () => {
    const theme = useTheme();
  return (
     <Stack>
        <Typography variant="h6" fontWeight={600}>
                Catatan Penting
        </Typography>
        <Card sx={{ mt: 2, mb: 8 }} variant="outlined">
            <CardContent
                sx={{
                    px: 6,
                    py: 4, // SATU sumber padding (padding default card content di reset)
                }}
            >
                <Stack spacing={1}>
                {notes.map((note) => (
                    <Stack key={note.id} direction="row" spacing={1}>
                    <Box sx={{ color: theme.palette.teal[100], mt: "2px" }}>
                        <PiRadioButtonBold />
                    </Box>

                    <Typography fontSize={12}>
                        <Typography component="span" fontWeight={600}>
                        {note.title}{" "}
                        </Typography>
                        <Typography component="span" color="text.secondary">
                        {note.description}
                        </Typography>
                    </Typography>
                    </Stack>
                ))}
                </Stack>
            </CardContent>
        </Card>
     </Stack>

  )
}

export default ImportantNotes