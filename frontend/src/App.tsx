import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";
import ColorModeProvider from "./theme/ColorModeProvider";
import HeroSection from "./sections/hero/HeroSection";
import FooterSection from "./sections/footer/FooterSection";
import LearningApproachSection from "./sections/learning-approach/LearningApproachSection";
import RoadmapDetailPage from "./features/roadmaps/Roadmap";
import FieldList from "./features/fields/FieldList";

function App() {


  return (
    <ColorModeProvider>
        <BrowserRouter>
          <Navbar/>
          <HeroSection/>
          <RoadmapDetailPage/>
          {/* <AboutSection/> */}
          <FieldList/>
          <LearningApproachSection/>
          <FooterSection/>
        </BrowserRouter>
    </ColorModeProvider>
  );
}

export default App;