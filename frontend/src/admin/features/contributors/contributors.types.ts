export interface Contributor {
  _id: string;
  name: string;
  role: string;
  description?: string;
  avatar?: string;
  socials: {
    github?: string;
    instagram?: string;
    website?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}


