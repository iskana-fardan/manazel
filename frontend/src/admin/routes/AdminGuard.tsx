import { useEffect, useState } from "react";
import api from "../services/api";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";


export default function AdminGuard(){
  const [loading,setLoading] = useState(true);
  const [authenticated,setAuthenticated] = useState(false);

  useEffect(()=>{
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setAuthenticated(true);
      }catch {
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    };

    checkAuth();
  },[]);


  if (loading){
    return (
       <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return authenticated ? <Outlet/> : <Navigate to={"/admin/login"} replace/>
}

