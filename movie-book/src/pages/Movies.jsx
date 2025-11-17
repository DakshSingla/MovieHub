import React from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';

const Movies = () => {
  const { shows, showsLoading } = useAppContext();

  if (showsLoading) {
    return (
      <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[60vh]'>
        <h1 className='text-lg font-medium my-4 text-glow'>Now Showing</h1>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='rounded-xl glass-card skeleton h-64 w-full' />
          ))}
        </div>
      </div>
    );
  }

  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top='150px' left='0px'/>
      <BlurCircle bottom='50px' right='0px'/>

      <h1 className='text-lg font-medium my-4 text-glow'>Now Showing</h1>

      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows.map((movie) => {
          if (!movie) return null;
          return <MovieCard movie={movie} key={movie._id} />;
        })}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center text-glow'>No Movies Available</h1>
    </div>
  );
};

export default Movies;
