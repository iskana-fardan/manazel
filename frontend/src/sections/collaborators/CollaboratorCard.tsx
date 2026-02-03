import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import LanguageIcon from "@mui/icons-material/Language"
import InstagramIcon from "@mui/icons-material/Instagram"
import type { Collaborator } from "./collaborators.data"
import { LuGithub} from "react-icons/lu";

interface Props {
  data: Collaborator
}

export default function CollaboratorCard({ data }: Props) {
  const theme = useTheme()

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "18px",
        border: `1px solid ${theme.palette.divider}`,
        backgroundImage: "none",
        transition: "0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardContent>
        <Stack spacing={2.2} alignItems="center" textAlign="center">
          {/* Avatar */}
          <Avatar
            src={data.avatar}
            alt={data.name}
            sx={{
              width: 82,
              height: 82,
              border: `2px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[2],
            }}
          />

          {/* Name & Role */}
          <Box>
            <Typography fontWeight={700}>{data.name}</Typography>

            <Box
              sx={{
                display: "inline-block",
                mt: 0.4,
                px: 1.2,
                py: 0.3,
                borderRadius: "999px",
                color: theme.palette.teal[100],
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {data.role}
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            {data.description}
          </Typography>

          {/* Social Icons */}
          {data.socials && (
            <Stack direction="row" spacing={1}>
              {data.socials.github && (
                <IconButton
                  size="small"
                  component="a"
                  href={data.socials.github}
                  target="_blank"
                  sx={{color:"text.secondary"}}
                >
                  <LuGithub fontSize="large" />
                </IconButton>
              )}

              {data.socials.instagram && (
                <IconButton
                  size="small"
                  component="a"
                  href={data.socials.instagram}
                  target="_blank"
                  sx={{color:"text.secondary"}}
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
              )}

              {data.socials.website && (
                <IconButton
                  size="small"
                  component="a"
                  href={data.socials.website}
                  target="_blank"
                  sx={{color:"text.secondary"}}
                >
                  <LanguageIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
