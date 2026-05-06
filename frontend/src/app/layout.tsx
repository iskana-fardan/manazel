import { Suspense, useState } from "react"
import { Box, CircularProgress } from "@mui/material"
import ErrorBoundary from "../shared/components/ErrorBoundary"
import Navbar from "../components/Navbar/Navbar"
import FooterSection from "../sections/footer/FooterSection"
import { Outlet } from "react-router-dom"
import DevNotice from "../components/DevNotice"
import ScrollToTop from "../components/ScrollToTop"

const RootLayout = () => {
    const [noticeHeight, setNoticeHeight] = useState(0);
    return (
        <Box>
            <DevNotice onHeightChange={setNoticeHeight} />

            <ScrollToTop/>
            <Navbar offsetTop={noticeHeight}/>

            <Box flex={"1"} sx={{ pt: `${noticeHeight}px` }}>
                <ErrorBoundary>
                    <Suspense fallback={
                        <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CircularProgress />
                        </Box>
                    }>
                        <Outlet/>
                    </Suspense>
                </ErrorBoundary>
            </Box>

            <FooterSection/>
        </Box>
    )
}

export default RootLayout;