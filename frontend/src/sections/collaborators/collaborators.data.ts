export interface Collaborator {
  id: string
  name: string
  role: string
  description: string
  avatar: string
  socials?: {
    github?: string
    instagram?: string
    website?: string
  }
}

export const collaborators: Collaborator[] = [
  {
    id: "ahmad-fauzi",
    name: "Ahmad Fauzi",
    role: "Penulis Konten & Reviewer",
    description:
      "Fokus pada fiqih dasar dan penulisan konten materi keislaman.",
    avatar: "/avatars/avatar-1.svg",
    socials: {
      github: "https://github.com/",
      website: "https://ahmadwibowo.com",
    },

  },
  {
    id: "ahmad-widobwo",
    name: "Ahmad Wibowo",
    role: "UI/UX Designer",
    description:
      "Bertanggung jawab atas desain antarmuka yang bersih dan ramah pengguna.",
    avatar: "/avatars/avatar-2.svg",
    socials: {
      instagram: "https://instagram.com/",
    },
  },
  {
    id: "budi-santoso",
    name: "Budi Santoso",
    role: "Software Engineer",
    description:
      "Mengembangkan arsitektur teknis dan fungsionalitas platform.",
    avatar: "/avatars/avatar-3.svg",
    socials: {
      github: "https://github.com/",
      website: "https://ahmadwibowo.com",
    },
  },
  {
    id: "luthfi-hakim",
    name: "Luthfi Hakim",
    role: "Reviewer Materi",
    description:
      "Melakukan review mendalam terhadap akurasi materi roadmap hadits.",
    avatar: "/avatars/avatar-4.svg",
     socials: {
      instagram: "https://instagram.com/",
    },
  },
]
