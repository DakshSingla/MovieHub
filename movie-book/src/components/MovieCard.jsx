import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'


const MovieCard = ({movie}) => {
  const navigate = useNavigate()
  // image_base_url is already declared, remove duplicate
    const {image_base_url} = useAppContext()
  if (!movie) return null;
  return (
    <div className='flex flex-col justify-between p-3 rounded-2xl glass-card neon-border neon-hover w-66'>
      {movie.poster_path && (
        <img
          onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0); }}
          src={image_base_url + movie.poster_path}
          alt=""
          className='rounded-xl h-52 w-full object-cover object-right-bottom cursor-pointer neon-hover'
        />
      )}
      <p className='font-semibold mt-3 truncate text-glow'>{movie.title}</p>
      <p className='text-sm text-gray-300 mt-1'>
        {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}.
        {Array.isArray(movie.genres) ? movie.genres.slice(0, 2).map(genre => genre.name).join(" | ") : ''}.
        {movie.runtime ? timeFormat(movie.runtime) : ''}
      </p>
      <div className='flex items-center justify-between mt-4 pb-3'>
        <button onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0); }} className='px-4 py-2 text-xs btn-neon font-semibold'>Buy Ticket</button>
        <div className='flex items-center gap-2 mt-1 pr-1'>
          <span className='badge-neon flex items-center gap-1 text-sm'>
            <StarIcon className='w-4 h-4 text-primary fill-primary' />
            {movie.vote_average ? movie.vote_average.toFixed(1) : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(MovieCard)
