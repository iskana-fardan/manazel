import { Grid, Link, Stack, Typography } from "@mui/material"
import { LuGithub, LuMail } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const ContactAndResources = () => {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2}>
           <Typography fontWeight={600}>
                Kontak & Sumber
            </Typography>


            <Stack spacing={1.5} sx={{ color: "text.secondary" }}>
                <Stack>
                  <Link
                    component={NavLink}
                    to={"/kolaborasi"}
                    variant="body2" 
                    sx={{ textDecoration: 'none',color: "text.secondary" }}>
                    Kontributor Kami
                  </Link>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LuGithub fontSize={"medium"}/>
                  <Link
                   variant="body2"
                    href="#"
                    underline="hover"
                    sx={{ color: "text.secondary" }}
                  >
                    Lihat di Github
                  </Link>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LuMail fontSize={"medium"}/>
                  <Link
                    variant="body2"
                    href="#"
                    underline="hover"
                    sx={{ color: "text.secondary" }}
                  >
                    Hubungi Kami
                  </Link>
                </Stack>
              </Stack>

            <Typography
                variant="caption"
                sx={{ color: "text.secondary", mt: 2 }}
            >
                Dibangun dengan kepedulian untuk para penuntut ilmu
            </Typography>
        </Stack>
    </Grid>
  )
}

export default ContactAndResources