import HeroSection from '../sections/hero/HeroSection'
import LearningApproachSection from '../sections/learning-approach/LearningApproachSection'
import FieldList from '../features/fields/FieldList'

const HomePage = () => {
  return (
    <>
        <HeroSection/>

        <FieldList/>

        <LearningApproachSection/>
    </>
  )
}

export default HomePage