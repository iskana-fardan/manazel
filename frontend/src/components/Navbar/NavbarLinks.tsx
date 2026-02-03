import { Box, Button } from "@mui/material"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useNavItems } from "./useNavItems";

const NavbarLinks = () => {
  const navItems = useNavItems();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = (anchorId: string) => {
    const scrollToAnchor = () => {
      const el = document.getElementById(anchorId)
      if(el){
        el.scrollIntoView({ behavior: "smooth" })
      }
    }

    
    if (location.pathname !== "/"){
      navigate("/")
      setTimeout(scrollToAnchor,150)
    }else {
      scrollToAnchor()
    }
  }


  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {navItems.map((item) => {
        const isActive = 
          item.type === "route" && location.pathname === item.path

        // ROUTE ITEM
        if (item.type === "route") {
          return (
            <Button
              disableRipple
              key={item.label}
              component={NavLink}
              to={item.path}
              sx={{
                textTransform: "none",
                borderRadius: "5px",
                fontSize: "12px",
                color: "text.primary",

                "&:hover": {
                  backgroundColor: "rgba(100,100,100,0.1)",
                  color:"text.primary"
                },

                backgroundColor: isActive
                  ? "rgba(90, 130, 126, 0.2)"
                  : "transparent",
                }}
              >
                {item.label}
            </Button>
          )
        }

        return (
          <Button
            disableRipple
            key={item.label}
            onClick={() => handleAnchorClick(item.anchor)}
            sx={{
              textTransform: "none",
              borderRadius: "5px",
              fontSize: "12px",
              color: "text.primary",

              "&:hover": {
                backgroundColor: "rgba(100,100,100,0.1)",
                color:"text.primary"
              },
            }}
          >
            {item.label}
          </Button>
        )
      })}
    </Box>
  )
}

export default NavbarLinks
