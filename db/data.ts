// Types for seeding data
export interface SeedUser {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio?: string;
}

export interface SeedPost {
  content: string;
  userIndex: number; 
}

// sample user
export const seedUsers: SeedUser[] = [
  {
    username: "gatotimut67",
    email: "gatotimut@gmail.com",
    password: "gatot123", // bakal dihash pas proses seeding
    displayName: "Gatot Imut",
    bio: "gatot imut"
  }, 
  {
    username: "ambaimut67",
    email: "ambaimut@gmail.com",
    password: "amba123", // bakal dihash pas proses seeding
    displayName: "Amba Imut",
    bio: "amba imut"
  }, 
];

// sampel post
export const seedPosts: SeedPost[] = [
  {
    content: "wir jawir",
    userIndex: 0 
  }, 
  {
    content: "bass bass",
    userIndex: 1
  }
];

// sample follow
export const seedFollows: Array<{ followerIndex: number; followingIndex: number }> = [
  { 
    followerIndex: 0, 
    followingIndex: 1 // gatot (0) follow amba (1)
  }
];

// sampel like
export const seedLikes: Array<{ userIndex: number; postIndex: number }> = [
  { 
    userIndex: 0, // gatot ngelike postnya sendiri 
    postIndex: 0 
  }
];

// sampel Comment
export const seedComments: Array<{ userIndex: number; postIndex: number; content: string }> = [
  { 
    userIndex: 0, 
    postIndex: 1, // gatot komen di postingan amba
    content: "aduhai" 
  }
];