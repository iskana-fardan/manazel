import { Box, Container } from "@mui/material"
import Title from "./Title"
import Mission from "./Mission"
import TwoTypeOfBooks from "./TwoTypeOfBooks"
import HowToUse from "./HowToUse"
import ImportantNotes from "./ImportantNotes"
import Contribution from "./Contribution"



const AboutSection = () => {
  return (
    <Box
        component="section"
    >
        <Container maxWidth="md">
            {/* Title */}
            <Title/>
            {/* Mission */}
            <Mission/>
            {/* Two Types of Books */}
            <TwoTypeOfBooks/>
            {/* How to Use */}
            <HowToUse/>
            {/* Important Notes */}
            <ImportantNotes/>
            {/* Contribution */}
            <Contribution/>
        </Container>
    </Box>
  )
}

export default AboutSection