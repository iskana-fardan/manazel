
// fix hadits
import nuzhatunNadzar from "./dars/hadits/nuzhatun-nadzar.json"
import tadribArrowi from "./dars/hadits/tadrib-ar-rowi.json"
import muqoddimahIbnuSholah from "./dars/hadits/muqoddimah-ibnu-sholah.json"
import taysirMustholahulHadits from "./muthalaah/hadits/taysir-mustholahul-hadist.json"

// fix fiqh syafii
import safinahAnNajah from "./dars/fiqh-syafii/safinah-an-najah.json"
import fathulQorib from "./dars/fiqh-syafii/fathul-qorib.json"
import minhajAtTalibin from "./dars/fiqh-syafii/minhaj-at-talibin.json"
import fathulMuin from "./muthalaah/fiqh-syafii/fathul-muin.json"


// fix ushul fiqh
import alwaroqat from "./dars/usul-fiqh/al-waroqat.json"
import jamulJawamik from "./dars/usul-fiqh/jamul-jawamik.json"
import nihatusSul from "./dars/usul-fiqh/nihayatus-sul.json"
import almustashfa from "./muthalaah/usul-fiqh/al-mustashfa.json"


// fix nahwu
import tuhfahSaniyyah from "./dars/nahwu/tuhfah-saniyyah.json"
import qotrunNada from "./dars/nahwu/ qatrun-nada-wa-ballas-shoda.json"
import syarahMakudi from "./dars/nahwu/ syarah-makudi-alal-alfiyyah-ibn-malik.json"


import type { Book } from "../../types/book";


export const books = [
    // hadits
    nuzhatunNadzar,
    tadribArrowi,
    muqoddimahIbnuSholah,
    taysirMustholahulHadits,

    // fiqh syafii
    safinahAnNajah,
    fathulQorib,
    minhajAtTalibin,
    fathulMuin,

    // usul fiqh
    alwaroqat,
    jamulJawamik,
    nihatusSul,
    almustashfa,

    // nahwu
    tuhfahSaniyyah,
    qotrunNada,
    syarahMakudi

] as Book[];

export const getBookById = (id?: string) =>
  books.find(b => b.id === id)
