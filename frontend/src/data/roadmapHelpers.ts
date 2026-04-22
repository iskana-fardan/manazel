import type { Roadmap } from "../types/roadmap";
import { getBookById } from "./books";


export function getMuthalaahBooks(roadmap:Roadmap | undefined) {
    return roadmap?.muthalaah
        ?.map(d => getBookById(d.bookId))
        .filter(Boolean) ?? []
}

export function getBooksByLevel(
    roadmap:Roadmap | undefined,
    levelId : string
    ) {
    const level = roadmap?.levels?.find(l => l.id === levelId)
    if (!level) return []

    return level.dars
        .map(d => getBookById(d.bookId))
        .filter(Boolean)
}


// {
//   "title": "Basic Arabic Grammar",
//   "titleArabic": "القواعد الأساسية",
//   "author": "Ahmad Yusuf",
//   "type": "dars",
//   "level": "beginner",
//   "field": "nahwu",
//   "description": "An introduction to basic Arabic grammar concepts for beginners.",
//   "recommendedUsage": "Study daily with exercises and review lessons weekly.",
//   "resources": [
//     {
//       "label": "YouTube Explanation",
//       "type": "video",
//       "url": "https://www.youtube.com/watch?v=example1"
//     }
//   ],
//   "recommendedEditions": [
//     {
//       "publisher": "Dar Al Ilm",
//       "note": "Clear explanation and examples",
//       "label": "First Edition"
//     }
//   ]
// }