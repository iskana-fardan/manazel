import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  Typography,
} from "@mui/material"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined"
import { useState } from "react"
import KitabDarsCard from "./KitabDarsCard"
import type { Book } from "../../types/book"


interface Props {
  books: (Book | undefined)[],
  title: string,
  color: string,
 
}

const RoadmapLevel = ({books,  title , color }: Props) => {
  const [expanded, setExpanded] = useState(false)


  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      disableGutters
      sx={{
        bgcolor: "#0b0b0b",
        borderLeft: "2px solid",
        borderColor: "divider",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolOutlinedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography fontWeight={600}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Jumlah kitab : {books.length}
            </Typography>
          </Box>
        </Stack>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          position: "relative",
          pl: 4,
          "&::before": {
            content: '""',
            position: "absolute",
            left: 16,
            top: 0,
            width: 2,
            height: expanded ? "100%" : 0,
            bgcolor: "divider",
            transition: "height .3s ease",
          },
        }}
      >
        <KitabDarsCard
          books={books}
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default RoadmapLevel