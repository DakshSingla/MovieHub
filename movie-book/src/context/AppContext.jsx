
import { createContext, useContext, useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // null = unknown/loading, true/false = resolved
    const [isAdmin, setIsAdmin] = useState(null);
    const [shows, setShows] = useState([]);
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

    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all');
            if (data.success) {
                setShows(data.shows);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
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
        user,
        getToken,
        navigate,
        isAdmin,
        shows,
    favouriteMovies,
    fetchFavouriteMovies,
        image_base_url,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
