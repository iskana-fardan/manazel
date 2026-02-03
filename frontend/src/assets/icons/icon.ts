import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import TranslateIcon from '@mui/icons-material/Translate';
import BrushIcon from '@mui/icons-material/Brush';
import DrawIcon from '@mui/icons-material/Draw';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';



export const icons = {
  fiqh_syafii: MenuBookOutlinedIcon,
  usul_fiqh: BalanceRoundedIcon,
  nahwu: BrushIcon,
  sharaf: TranslateIcon,
  balaghah: DrawIcon,
  hadits: ArticleOutlinedIcon,
  aqidah: VolunteerActivismOutlinedIcon,
  tafsir: AutoStoriesOutlinedIcon,
  ulumul_quran: AutoAwesomeOutlinedIcon,
  others: FolderOutlinedIcon,
};

export type IconKey = keyof typeof icons;