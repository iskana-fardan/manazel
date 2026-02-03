import { Box, Container, Grid } from "@mui/material"
import FooterBrand from "./FooterBrand"
import LearningCategories from "./LearningCategories"
import ContactAndResources from "./ContactAndResources"
import Bottom from "./Bottom"

const FooterSection = () => {
  return (
    <Box
        component={"footer"}
        sx={{
            mt: 10,
            pt: 8,
            pb: 4,
            width: "100vw",
            backgroundColor: "background.paper",
        }}
    >
        <Container maxWidth="lg">
            <Grid container spacing={6}>
                {/* Brand */}
                <FooterBrand/>

                {/* Learning Categories */}
                <LearningCategories/>
                {/* Contact & Resources */}
                <ContactAndResources/>
                {/* Bottom */}
                <Bottom/>
            </Grid>
        </Container>
    </Box>
  )
}

export default FooterSection