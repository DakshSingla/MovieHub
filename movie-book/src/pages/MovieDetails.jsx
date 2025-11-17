import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MovieDetails = () => {
  const navigate = useNavigate()
  const {id}  = useParams()
  const [show, setShow] = useState(null)
  const {shows, axios, getToken, user, fetchFavouriteMovies, favouriteMovies, image_base_url} = useAppContext()

  const getShow = async()=> {
    try {
      const {data} = await axios.get(`/api/show/${id}`)
        if(data.success){
          setShow({ movie: data.movie, dateTime: data.dateTime });
        }
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleFavourite = async() => {
    try {
      if(!user) return navigate('/sign-in')
  const {data} = await axios.post('/api/user/update-favorite', {movieId: id}, {
          headers: {Authorization: `Bearer ${await getToken()}`}
        })
        if(data.success){
          await fetchFavouriteMovies()
          toast.success('Favourite List Updated')
        }      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() =>{
    getShow()
  },[id])

  return show ? (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img src={image_base_url + show.movie.poster_path} alt='' className='max-md:ms-auto rounded-2xl h-104 max-w-70 object-cover neon-hover'/>

        <div className='relative flex flex-col gap-3'>
          <BlurCircle top='-100px' left='-100px'/>
          <p className='text-primary badge-neon w-max'>English</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance text-glow'>{show.movie.title}</h1>

          <div className='flex items-center gap-2 text-gray-300'>
            <span className='badge-neon flex items-center gap-1'>
              <StarIcon className='w-4 h-4 text-primary fill-primary'/>
              {show.movie.vote_average.toFixed(1)}
            </span>
            <span className='text-sm opacity-80'>User Rating</span>
          </div>

          <p className='text-gray-300 mt-2 text-sm leading-tight max-w-xl'>{show.movie.overview}</p>

          <p>
            {timeFormat(show.movie.runtime)} • {show.movie.genres.map(genre =>genre.name).join(", ")} • {show.movie.release_date.split("-")[0]}
          </p> 

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm glass-card neon-hover rounded-xl font-medium cursor-pointer'>
                <PlayCircleIcon className='w-5 h-5'/>
                Watch Trailer
              </button>
            <a href='#dateSelect' className='px-10 py-3 text-sm btn-neon'>Buy Tickets</a>
            <button onClick={handleFavourite} className='glass-card p-2.5 rounded-full neon-hover cursor-pointer'>
              <Heart className={`w-5 h-5 ${favouriteMovies.find(movie=> movie._id === id)? 'fill-primary text-primary':""}`}/>
            </button>
          </div>
        </div>
      </div>
          
          <p className='text-lg font-medium mt-20 text-glow'>Your favourite Cast</p>
          <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
            <div className='flex items-center gap-4 w-max px-4'>
              {show.movie.casts.slice(0,11).map((cast,index)=>(
                <div key={index} className='flex flex-col items-center text-center'>
                  <img src={image_base_url + cast.profile_path} alt='' className='rounded-full h-20 md:h-20 aspect-square object-cover neon-hover'/>
                  <p className='font-medium text-xs mt-3'>{cast.name}</p>
                </div>
              ))}
            </div>
          </div>
          <DateSelect dateTime={show.dateTime} id={show.movie._id}/>

          <p className='text-lg font-medium mt-20 mb-8 text-glow'>You may also like</p>
          <div className='flex flex-wrap max-sm:justify-center gap-9'>
            {shows.slice(0,4).map((movie, index) => (
              <MovieCard key={index} movie={movie}/>
            ))}
          </div>
          <div className='flex justify-center mt-20'>
            <button onClick={() => {navigate('/movies'); scrollTo(0,0)}} className='px-10 py-3 text-sm btn-neon'>Show more</button>
          </div>
    </div>
  ): <Loading/>
}

export default MovieDetails;



