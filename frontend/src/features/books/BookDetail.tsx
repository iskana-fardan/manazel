import { Box, Button, Chip, Divider, Drawer, IconButton, Stack, Typography, useTheme } from "@mui/material"

import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import type { Book } from "../../types/book";


interface Props {
    book: (Book | undefined),
    open: boolean,
    onClose: () => void
}


const BookDetail = ({book,open, onClose}: Props) => {
    const theme = useTheme();
    console.log(book)
    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
        >
            <Box p={3}  sx={{ 
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`
                 }}>
                {/* === Header ===*/}
                {/* === Header ===*/}
                {/* === Header ===*/}


                <Stack spacing={2}  mb={3} >
                    
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <Stack spacing={1.5} direction={"row"}>
                            <Stack sx={{
                                // width: 44,
                                // height: 44,
                                p: 1,
                                borderRadius: "7px",
                                backgroundColor: "rgba(255,255,255,0.06)", // subtle
                                color: theme.palette.teal[200],
                                fontSize: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                             <ImportContactsOutlinedIcon fontSize="inherit" />
                            </Stack>
                            
                            <Stack>
                                <Typography fontWeight={700}>
                                    {book?.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {book?.titleArabic}
                                </Typography>
                            </Stack>
                        </Stack>

                        <IconButton 
                            disableRipple
                            sx={{ 
                                fontSize: "16px", 
                                p: 0,
                                borderRadius: '5px',
                                border: `2px solid ${theme.palette.teal[100]}`,
                                color: 'text.secondary',
                                '&:hover': {
                                    border: `2px solid ${theme.palette.teal[100]}`,
                                }
                             }}
                            onClick={onClose}>
                            <CloseRoundedIcon fontSize="inherit"/>
                        </IconButton>
                    </Stack>

                    <Stack direction="row" spacing={1}>


                            <Chip
                                sx={{
                                    borderRadius: '5px',
                                    textTransform: 'capitalize',
                                    backgroundColor: theme.palette.teal[100],
                                    color: 'text.primary',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                }}
                                size="small"
                                label={`kitab ${book?.type}`}
                                variant={ 'filled' }
                            />

                             {book?.type === 'dars' && 
                                <Chip
                                    sx={{
                                        borderRadius: '5px',
                                        textTransform: 'capitalize',
                                        borderColor: theme.palette.divider ,
                                        color: 'text.primary',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                    

                                        '& .MuiChip-icon': {
                                            fontSize: 15,   // ukuran icon
                                            ml: '4px',      // optional: rapihin jarak
                                        },
                                    }}
                                    icon={<SchoolOutlinedIcon/>}
                                    size="small"
                                    label= {book.level === "beginner" 
                                        ? "Dasar (Beginner)" 
                                        : book.level === "intermediate" 
                                        ? "Menengah (Intermediate)" 
                                        : "Lanjutan (Advanced)" } // nanti render berdasarkan level di kitab
                                    variant={ 'outlined' }
                                />}
                    </Stack>
                </Stack>


                {/* === Meta ===*/}
                {/* === Meta ===*/}
                {/* === Meta ===*/}
                <Stack spacing={1} mb={3}>
                    <Typography variant="caption" color="text.secondary">
                        Pengarang
                    </Typography>
                    <Typography variant="body1">
                        {book?.author}
                    </Typography>
                </Stack>

                {/* === Description ===*/}
                {/* === Description ===*/}
                {/* === Description ===*/}
                 <Box mb={3}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                    >
                        Gambaran Umum
                    </Typography>
                    <Typography variant="body2">
                        {book?.description}
                    </Typography>
                 </Box>


                {/* === Recommended Usage ===*/}
                {/* === Recommended Usage ===*/}
                {/* === Recommended Usage ===*/}
                 <Box mb={3}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                    >
                        Cara Belajar yang Disarankan
                    </Typography>
                    <Typography variant="body2">
                        {book?.recommendedUsage}
                    </Typography>
                 </Box>


                {/* === Recommended Editions ===*/}
                {/* === Recommended Editions ===*/}
                {/* === Recommended Editions ===*/}
                <Divider/>
                <Box mb={3} mt={3}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Pilihan Cetakan Rekomendasi
                    </Typography>

                    <Stack spacing={1.5}>
                        {book?.recommendedEditions.length === 0 && "-"}
                        {book?.recommendedEditions.map((ed, i) => (
                        <Box
                            key={i}
                            sx={{
                            p: 2,
                            borderRadius: "10px",
                            border: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography variant="body2">
                                    {ed.publisher}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {ed.note}
                                </Typography>
                            </Box>

                            <Chip
                                sx={{
                                    borderRadius: '7px',
                                    textTransform: 'capitalize',
                                    backgroundColor: ed.label === 'recommended' ? theme.palette.teal[100] : 'none',
                                    color: 'text.primary',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    px: 0.5,
                                    py: 1.6,

                                    '& .MuiChip-icon': {
                                        fontSize: 14,   // ukuran icon
                                        ml: '4px',      // optional: rapihin jarak
                                    },
                                }}
                                icon={ ed.label === 'recommended' ? <VerifiedOutlinedIcon /> : <CircleOutlinedIcon/>}
                                size="small"
                                label={ed.label}
                                variant={ed.label === 'recommended' ? 'filled' : 'outlined'}
                            />

                        </Box>
                        ))}
                    </Stack>
                </Box>
                
                <Divider/>
                {/* === Resources Sections ===*/}
                {/* === Resources Sections ===*/}
                {/* === Resources Sections ===*/}

                <Box mt={3} mb={4}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Referensi Pembelajaran
                    </Typography>

                    <Stack direction="row" spacing={1} mt={1}>
                        {book?.resources.length === 0 && "-"}
                        {book?.resources.map(resource => (
                            <Button
                                href={resource.url}
                                size="small"
                                variant="outlined"
                                startIcon={resource.type === 'pdf' ? <DescriptionOutlinedIcon/> : <VideocamOutlinedIcon/>}
                                endIcon={<OpenInNewOutlinedIcon/>}
                                sx={{
                                    color: 'text.primary',
                                    borderColor: theme.palette.divider,
                                    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                                    mx: 2,
                                    },
                                    textTransform:'none',
                                    borderRadius:'5px',
                                    py:0.3,
                                    '&:hover':{
                                        borderColor: theme.palette.divider,
                                        color: 'text.primary',
                                    },
                                    
                                }}
                            >
                                <Typography sx={{ fontSize: 'small',pt:0.5,fontWeight:550 }}>
                                    {resource.type === 'pdf' ? 'Kitab (PDF)' : 'Seri Penjelasan Kitab'}
                                </Typography>
                            </Button>
                        ))}
                    </Stack>
                </Box>
            </Box>

        </Drawer>
    )
}

export default BookDetail