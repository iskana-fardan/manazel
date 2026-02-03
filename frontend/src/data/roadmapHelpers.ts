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
