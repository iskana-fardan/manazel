import { Card, CardContent, Stack, Box, Typography, IconButton, useTheme, CardActionArea } from "@mui/material"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { icons } from "../../assets/icons/icon";
import type { IconKey } from "../../assets/icons/icon";
import { NavLink } from "react-router-dom";


interface Props {
    name: string;
    slug: string;
    nameArabic: string
    description: string
    icon: IconKey
   
}

const FieldCard = ({name,slug, nameArabic, description, icon }:Props) => {
    const theme = useTheme();

    const Icon = icons[icon];
    
  return (
    
              <Card
                component={NavLink}
                to={`/roadmap/${slug}`}
                variant="outlined"
                sx={{
                  height: "100%",
                  background: 'none',
                  borderRadius: 1,
                  transition: "all .25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    backgroundColor: theme.palette.background.paper
                  },
                }}
              >
                <CardActionArea
                  disableRipple
                >
                  <CardContent>
                    <Stack spacing={2}  direction="row">
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "7px",
                          bgcolor: theme.palette.teal[100],
                          color: "text.primary",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                          
                        }}
                      >
                        { Icon && <Icon/> }
                      </Box>

                      {/* Title  & desc*/}
                      <Stack spacing={1.5}>
                        <Stack spacing={0.7}>
                              <Typography 
                                    color="text.primary"
                                    fontSize={"1.1rem"} 
                                    fontWeight={600} 
                                    sx={{ wordSpacing: 3 }}
                                  >
                                    {name}{" "}
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {nameArabic}
                                  </Typography>
                              </Typography>

                              <Typography
                                  variant="body2"
                                  color="text.secondary"
                              >
                                  {description}
                              </Typography>
                        </Stack>


                        {/* Action */}
                          <Box>
                              <IconButton
                                  disableRipple
                                  sx={{ 
                                      color: theme.palette.teal[100],
                                      borderRadius:"5px",
                                      p:1,
                                      "&:hover": {
                                          backgroundColor: "rgba(100,100,100,0.1)",
                                      },
                                      fontSize: "1rem"
                                  }}

                                  
                              >
                                  <Typography variant="caption" mr={0.5}>
                                  Lihat alur belajar
                                  </Typography>
                                  <ArrowForwardIcon sx={{ "&:hover": { transform: "translateX(2px)" } }} fontSize="inherit"/>
                              </IconButton>
                          </Box>
                      </Stack>
                    </Stack>
                </CardContent>
                </CardActionArea>
              </Card>
  )
}

export default FieldCard