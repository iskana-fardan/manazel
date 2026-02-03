import { Box } from "@mui/material"
import Navbar from "../components/Navbar/Navbar"
import FooterSection from "../sections/footer/FooterSection"
import { Outlet } from "react-router-dom"
import DevNotice from "../components/DevNotice"
import { useState } from "react"
import ScrollToTop from "../components/ScrollToTop"

const RootLayout = () => {
    const [noticeHeight, setNoticeHeight] = useState(0);
    return (
        <Box>
            <DevNotice onHeightChange={setNoticeHeight} />

            <ScrollToTop/>
            <Navbar offsetTop={noticeHeight}/>

            {/* Konten page */}
            <Box flex={"1"} sx={{ pt: `${noticeHeight}px` }}>
                <Outlet/>
            </Box>

            <FooterSection/>
        </Box>
    )
}

export default RootLayout;