import { nanoid } from "nanoid";

const uid = () => nanoid(5, "0123456789");
const listingIdStorageKey = "listingIds";

const getStoredListingIds = () => {
  try {
    const storedIds = JSON.parse(
      window.localStorage.getItem(listingIdStorageKey),
    );

    if (
      Array.isArray(storedIds) &&
      storedIds.length === 12 &&
      storedIds.every((id) => typeof id === "string" && id.length > 0)
    ) {
      return storedIds;
    }
  } catch (error) {
    return null;
  }

  return null;
};

const storedListingIds = getStoredListingIds();
const listingIds = Array.isArray(storedListingIds)
  ? storedListingIds
  : Array.from({ length: 12 }, uid);

try {
  window.localStorage.setItem(listingIdStorageKey, JSON.stringify(listingIds));
} catch (error) {}

const listingsStorageKey = "customListings";

const getStoredListings = () => {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(listingsStorageKey),
    );
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
};

export const saveListings = (nextListings) => {
  try {
    window.localStorage.setItem(
      listingsStorageKey,
      JSON.stringify(nextListings),
    );
  } catch (error) {}
};

export const addListing = (listing) => {
  listings.push(listing);
  saveListings(listings.filter((l) => l.customId));
};

export const removeListing = (listingId) => {
  const idx = listings.findIndex((l) => l.id === listingId);
  if (idx !== -1) {
    listings.splice(idx, 1);
  }
  const customListings = listings.filter((l) => l.customId);
  saveListings(customListings);
  const storedBookings = getStoredBookings();
  const nextBookings = storedBookings.filter(
    (b) => b.listingId !== listingId,
  );
  saveBookings(nextBookings);
};

export const getStoredBookings = () => {
  try {
    const storedBookings = JSON.parse(
      window.localStorage.getItem("bookings"),
    );
    return Array.isArray(storedBookings) ? storedBookings : [];
  } catch (error) {
    return [];
  }
};

export const saveBookings = (nextBookings) => {
  try {
    window.localStorage.setItem(
      "bookings",
      JSON.stringify(nextBookings),
    );
  } catch (error) {}
};

let listings = [
  {
    id: "Event" + listingIds[0],
    location: "Cape Town, South Africa",
    title: "Azure Beachfront Apartment | 4 Sleeper",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/4bb5fb78-4b89-4a55-b65c-ad3f9fb1a7bd.jpeg?im_w=1200",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 4,
    price: 1420,
    about: "bluuuuuuud",
  },
  {
    id: "Event" + listingIds[1],
    location: "Johannesburg, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 800,
    about: "",
  },
  {
    id: "Event" + listingIds[2],
    location: "Cape Town, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 4,
    price: 1200,
    about: "",
  },
  {
    id: "Event" + listingIds[3],
    location: "Johannesburg, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 3,
    price: 769,
    about: "",
  },
  {
    id: "Event" + listingIds[4],
    location: "Cape Town, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 1369,
    about: "",
  },
  {
    id: "Event" + listingIds[5],
    location: "Johannesburg, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 950,
    about: "",
  },
  {
    id: "Event" + listingIds[6],
    location: "Johannesburg, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 950,
    about: "",
  },
  {
    id: "Event" + listingIds[7],
    location: "Cape Town, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 1369,
    about: "",
  },
  {
    id: "Event" + listingIds[8],
    location: "Johannesburg, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 950,
    about: "",
  },
  {
    id: "Event" + listingIds[9],
    location: "Cape Town, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 1369,
    about: "",
  },
  {
    id: "Event" + listingIds[10],
    location: "Johannesburg, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 950,
    about: "",
  },
  {
    id: "Event" + listingIds[11],
    location: "Cape Town, South Africa",
    title: "yuh",
    address: "...",
    image:
      "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480",
    layoutimgs: [
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/ebb8c7a5-08dd-4fc9-b29c-c7053192d7ec.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/b0bf5d65-5d53-40c2-86d4-ea036ff28646.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/6ab00b9e-648f-4c22-a780-0c110578d534.jpeg?im_w=720",
      },
      {
        src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1206419791630844189/original/450946b2-8ad3-4f88-90d8-a9958cc633c0.jpeg?im_w=720",
      },
    ],
    rating: 5,
    price: 1369,
    about: "",
  },
];

const storedCustomListings = getStoredListings();
storedCustomListings.forEach((listing) => {
  listings.push(listing);
});

export { listings };

export const favoritesStorageKey = "favorites";
export const favoritesChangedEvent = "favoritesChanged";

export const getStoredFavorites = () => {
  try {
    const storedFavorites = JSON.parse(
      window.localStorage.getItem(favoritesStorageKey),
    );
    if (!Array.isArray(storedFavorites)) return [];

    return [
      ...new Set(
        storedFavorites.filter((id) => typeof id === "string" && id.length > 0),
      ),
    ];
  } catch (error) {
    return [];
  }
};

export const saveFavorites = (favoriteIds) => {
  try {
    window.localStorage.setItem(
      favoritesStorageKey,
      JSON.stringify(favoriteIds),
    );
  } catch (error) {}

  window.dispatchEvent(new Event(favoritesChangedEvent));
};
