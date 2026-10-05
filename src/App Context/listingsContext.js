import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../API";

const ListingsContext = createContext({
  listings: [],
  loading: true,
  error: null,
  refreshListings: async () => {},
});

const MIGRATION_KEY = "migrated-v2";
const LEGACY_KEYS = [
  "favorites",
  "customListings",
  "listingIds",
  "bookings",
  "listingModal",
  "User Logged in",
];

const clearLegacyKeys = () => {
  try {
    if (window.localStorage.getItem(MIGRATION_KEY)) return;
    LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
    window.localStorage.setItem(MIGRATION_KEY, "1");
  } catch (error) {}
};

export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    clearLegacyKeys();
  }, []);

  const refreshListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { listings: nextListings } = await api.get("/listings");
      setListings(nextListings);
    } catch (err) {
      setError(err.message || "Failed to load listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  const value = useMemo(
    () => ({ listings, loading, error, refreshListings }),
    [listings, loading, error, refreshListings],
  );

  return (
    <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
  );
};

export const useListings = () => useContext(ListingsContext);

export default ListingsContext;