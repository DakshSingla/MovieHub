import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import BlurCircle from './BlurCircle'
import { dummyShowsData } from '../assets/assets'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'

const FeaturesSection = () => {
    const navigate = useNavigate()
    const {shows} = useAppContext()
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
      <div className='relative flex items-center justify-between pt-20 pb-8'>
        <BlurCircle top='0' right='-80px'/>
        <p className='text-white font-medium text-lg text-glow'>Now Showing</p>
        <button onClick={()=> navigate('/movies')} className='group flex items-center gap-2 text-sm text-white/90 nav-link cursor-pointer'>View All 
            <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5'/> 
        </button>
      </div>
      <div className='flex flex-wrap max-sm:justify-center gap-8 mt-4'>
        {shows.slice(0,4).map((show) => {
          if (!show) return null;
          return <MovieCard key={show._id} movie={show}/>;
        })}
      </div>
                  {/* Home body box button */}
        <div className='flex justify-center mt-12 mb-4'>
            <button onClick={() => {navigate('/movies'); scrollTo(0,0)}} className='px-10 py-3 text-sm btn-neon'>Show more</button>
        </div>
    </div>
  )
}

export default FeaturesSection
