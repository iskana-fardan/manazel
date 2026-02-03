import { Box, Typography, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useEffect, useRef, useState } from "react"

type DevNoticeProps = {
  onHeightChange: (height: number) => void
}

export default function DevNotice({ onHeightChange }: DevNoticeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (visible && ref.current) {
      onHeightChange(ref.current.offsetHeight)
    }

    if (!visible) {
      onHeightChange(0)
    }
  }, [visible, onHeightChange])

  if (!visible) return null

  return (
    <Box
      ref={ref}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: (theme) => theme.zIndex.appBar + 1,
        bgcolor: "#fff3cd",
        color: "#664d03",
        px: 2,
        py: 0.75,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body2">
        🚧 <strong>Versi pratinjau.</strong> Website ini masih dalam pengembangan aktif.
Kami terbuka terhadap saran dan kontribusi untuk menyempurnakannya.
      </Typography>

      <IconButton size="small" onClick={() => setVisible(false)} sx={{ color: 'darkgrey' }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
