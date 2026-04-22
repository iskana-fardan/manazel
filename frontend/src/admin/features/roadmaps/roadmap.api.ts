export const fetchRoadmap = async (fieldId: string) => {
    // TODO: ganti ke backend
    return {
        fieldId,
        dars: {
            beginner: [],
            intermediate: [],
            advanced: [],
        },
        muthalaah: {
            recommended: [],
        },
    };
};



export const fetchBooks = async () => {
    // dummy data
    return [
        { id: "1", title: "Tafsir al-Jalalayn", author: "Al-Mahalli & As-Suyuti" },
        { id: "2", title: "Usul al-Tafsir", author: "Ibn Taymiyyah" },
    ]
}