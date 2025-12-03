
import { createContext, useContext, useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, '');

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // null = unknown/loading, true/false = resolved
    const [isAdmin, setIsAdmin] = useState(null);
    const [shows, setShows] = useState([]);
    const [showsLoading, setShowsLoading] = useState(true);
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchIsAdmin = async () => {
        try {
            const { data } = await axios.get('/api/admin/is-admin', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            setIsAdmin(data.isAdmin);
            // If user is not admin and currently on an admin route, redirect away
            if (data.isAdmin === false && location.pathname.startsWith('/admin')) {
                navigate('/')
                toast.error("You are not authorized to access this page")
            }
        } catch (error) {
            // treat errors as not-admin (and stop loading)
            setIsAdmin(false);
            console.error(error);
        }
    }

    const CACHE_KEY = 'shows_cache_v1';
    const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

    const invalidateShowsCache = () => {
        try { sessionStorage.removeItem(CACHE_KEY); } catch {}
    };

    const fetchShows = async () => {
        setShowsLoading(true);
        try {
            const { data } = await axios.get('/api/show/all', { timeout: 10000 });
            if (data.success) {
                setShows(data.shows || []);
                try {
                    const payload = { ts: Date.now(), shows: data.shows || [] };
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
                } catch {}
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShowsLoading(false);
        }
    };

    const fetchFavouriteMovies = async () => {
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });
            if (data.success) {
                setFavouriteMovies(data.movies);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // hydrate from cache first for instant render
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed && Array.isArray(parsed.shows)) {
                    const fresh = Date.now() - (parsed.ts || 0) < CACHE_TTL_MS;
                    setShows(parsed.shows);
                    setShowsLoading(!fresh);
                    if (!fresh) fetchShows();
                    return;
                }
            }
        } catch {}
        fetchShows();
    }, []);
    useEffect(() => {
        if (user) {
            fetchIsAdmin();
            fetchFavouriteMovies();
        }
    }, [user]);

    const value = {
        axios,
        fetchIsAdmin,
        fetchShows,
        user,
        getToken,
        navigate,
        isAdmin,
        shows,
        showsLoading,
        favouriteMovies,
        fetchFavouriteMovies,
        invalidateShowsCache,
        image_base_url,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
