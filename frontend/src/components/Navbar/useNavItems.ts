
export const useNavItems = () => {
    return [
        { label: "Beranda", path: "/", type: "route" },
        { label: "Bidang Ilmu", anchor: "bidang-ilmu", type: "anchor" },
        { label: "Kolaborasi", path: "/kolaborasi", type: "route" },
        { label: "Tentang", path: "/tentang", type: "route" },
    ] as const
}

// using as const so typescript will read the literal value