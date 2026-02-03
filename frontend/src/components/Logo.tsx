import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { IconButton } from '@mui/material';

const Logo = () => {
  return (
    <IconButton 
        sx={{
            backgroundColor: "#1a746b", // shade 400
            borderRadius: '5px',
            p:'6px'
        }}
        disableRipple // disableRipple = matiin efek “gelombang air” pas diklik
    >
        <LocalLibraryIcon fontSize='small' sx={{color: 'white'}}/>
    </IconButton>
  )
}

export default Logo