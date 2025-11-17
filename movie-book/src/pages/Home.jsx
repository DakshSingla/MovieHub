
import React, { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import TrailerSection from '../components/TrailerSection'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'

const Home = () => {
  const { shows } = useAppContext();
  const [latestMovie, setLatestMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestMovie = async () => {
      try {
        const { data } = await axios.get('/api/show/latest');
        if (data.success) {
          setLatestMovie(data.movie);
        }
      } catch (error) {
        setLatestMovie(null);
      }
      setLoading(false);
    };
    fetchLatestMovie();
  }, []);

  return (
    <div>
      <HeroSection movie={latestMovie} loading={loading} />
      <FeaturesSection/>
      <TrailerSection/>
    </div>
  )
}

export default Home
