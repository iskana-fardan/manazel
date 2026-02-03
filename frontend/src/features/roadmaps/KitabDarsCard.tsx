import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded"
import type { Book } from "../../types/book"
import BookDetail from "../books/BookDetail"
import { useState } from "react"

interface Props  {
  books: (Book | undefined)[]
}


          // completed={completed === 1}


const KitabDarsCard = ({books}: Props) => {
  const [ open, setOpen ] = useState(false);
  const [completed, setCompleted] = useState(0)
  const theme =  useTheme();

  const onToggle = () => {
            setCompleted((prev) => (prev === 1 ? 0 : 1))
          }
        
  return (
    <>
      {books.length === 0 && '-'}
      {books.map(book => (
      <Card
        key={book?.id}
        sx={{
          position: "relative",
          background: "none",
          border: `1px solid ${theme.palette.divider}` ,
          bgcolor: completed ? "rgba(255,255,255,0.04)" : "transparent",
          transition: "all .2s ease",
          "&::after": completed
            ? {
                content: '""',
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.35)",
                pointerEvents: "none",
              }
            : {},
        }}
    >
      <CardActionArea
        onClick={()=> setOpen(true)}
        disableRipple
        sx={{
          "&:hover .hover-arrow": {
            opacity: 1,
            transform: "translateX(0)",
          },
        }}
      >
        <CardContent >
          <Box display="flex" gap={1} alignItems="flex-start">
            {/* Checkbox */}
            <Checkbox
              disableRipple
              checked={completed === 1}
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              sx={{p:0 }}
            />

            {/* Content */}
            <Box flex={1}>
              <Box display="flex" justifyContent="space-between" gap={2}>
                <Typography
                  fontWeight={600}
                  sx={{
                    textDecoration: completed ? "line-through" : "none",
                    opacity: completed ? 0.6 : 1,
                  }}
                >
                  {book?.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "serif",mt:3 }}
                >
                  {book?.titleArabic}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {book?.description}
              </Typography>

              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ mt: 0.75, display: "block" }}
              >
                {book?.author}
              </Typography>

              {/* CTA */}
              <Box>
                  <IconButton
                      disableRipple
                      sx={{ 
                          color: theme.palette.teal[100],
                          borderRadius:"5px",
                          mt:1,
                          "&:hover": {
                              backgroundColor: "rgba(100,100,100,0.1)",
                          },
                          fontSize: "1rem"
                      }}
                      
                  >
                      <Typography variant="caption" mr={0.5}>
                        Lihat Detail
                      </Typography>
                      <ArrowForwardIcon sx={{ "&:hover": { transform: "translateX(2px)" } }} fontSize="inherit"/>
                  </IconButton>
              </Box>
            </Box>

            {/* Hover Arrow */}
            <ChevronRightRoundedIcon
              className="hover-arrow"
              sx={{
                opacity: 0,
                transform: "translateX(-4px)",
                transition: "all .2s ease",
                color: "text.secondary",
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>

      <BookDetail book={book} open={open} onClose={()=>setOpen(false)}/>
    </Card>
    ))}
    </>
  )
}

export default KitabDarsCard
