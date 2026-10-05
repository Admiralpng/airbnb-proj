import { useCallback, useEffect, useState } from "react";

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

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(getStoredFavorites);

  useEffect(() => {
    const syncFavorites = () => setFavorites(getStoredFavorites());
    window.addEventListener(favoritesChangedEvent, syncFavorites);
    return () => {
      window.removeEventListener(favoritesChangedEvent, syncFavorites);
    };
  }, []);

  const toggleFavorite = useCallback((listingId) => {
    const next = getStoredFavorites();
    const nextFavorites = next.includes(listingId)
      ? next.filter((id) => id !== listingId)
      : [...next, listingId];
    saveFavorites(nextFavorites);
    setFavorites(nextFavorites);
    return nextFavorites;
  }, []);

  const removeFavorite = useCallback((listingId) => {
    const nextFavorites = getStoredFavorites().filter(
      (id) => id !== listingId,
    );
    saveFavorites(nextFavorites);
    setFavorites(nextFavorites);
    return nextFavorites;
  }, []);

  return { favorites, toggleFavorite, removeFavorite };
};