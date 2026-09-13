import { nanoid } from 'nanoid';

const uid = () => nanoid(5, '0123456789');
const listingIdStorageKey = 'listingIds';

const getStoredListingIds = () => {
  try {
    const storedIds = JSON.parse(window.localStorage.getItem(listingIdStorageKey));

    if (
      Array.isArray(storedIds) &&
      storedIds.length === 6 &&
      storedIds.every(id => typeof id === 'string' && id.length > 0)
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
  : Array.from({ length: 6 }, uid);

try {
  window.localStorage.setItem(listingIdStorageKey, JSON.stringify(listingIds));
} catch (error) {
}

export const listings = [
  { id: listingIds[0], location: "Cape Town, South Africa", title: "yuh", image: "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480", rating: 5, price: 250 },
  { id: listingIds[1], location: "Cape Town, South Africa", title: "yuh", image: "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480", rating: 5, price: 250 },
  { id: listingIds[2], location: "Cape Town, South Africa", title: "yuh", image: "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480", rating: 5, price: 250 },
  { id: listingIds[3], location: "Cape Town, South Africa", title: "yuh", image: "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480", rating: 5, price: 250 },
  { id: listingIds[4], location: "Cape Town, South Africa", title: "yuh", image: "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480", rating: 5, price: 250 },
  { id: listingIds[5], location: "Cape Town, South Africa", title: "yuh", image: "https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480", rating: 5, price: 250 },
];

export const favoritesStorageKey = 'favorites';
export const favoritesChangedEvent = 'favoritesChanged';

export const getStoredFavorites = () => {
  try {
    const storedFavorites = JSON.parse(window.localStorage.getItem(favoritesStorageKey));
    if (!Array.isArray(storedFavorites)) return [];

    return [
      ...new Set(
        storedFavorites.filter(id => typeof id === 'string' && id.length > 0)
      ),
    ];
  } catch (error) {
    return [];
  }
};

export const saveFavorites = (favoriteIds) => {
  try {
    window.localStorage.setItem(favoritesStorageKey, JSON.stringify(favoriteIds));
  } catch (error) {
  }

  window.dispatchEvent(new Event(favoritesChangedEvent));
};