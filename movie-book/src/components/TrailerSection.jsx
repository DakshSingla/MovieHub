import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets';
import BlurCircle from './BlurCircle';
import ReactPlayer from 'react-player';
import { PlayCircleIcon } from 'lucide-react';

const TrailerSection = () => {
    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
      <p className='text-white font-medium text-lg max-w-[960px] mx-auto text-glow'>Trailers</p>
      <div className='relative mt-6'>
        <BlurCircle top='-100px' right='-100px'/>
        <div className='glass-card neon-border neon-hover rounded-2xl p-2 mx-auto max-w-fit'>
          <ReactPlayer src={currentTrailer.videoUrl} width='960px' height='540px' controls={true} className='mx-auto max-w-full rounded-xl overflow-hidden'/>
        </div>
      </div>
      <div className='group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>
        {dummyTrailers.map((trailer)=>(
            <div key={trailer.image} className='relative group-hover:not-hover:opacity-50 neon-hover cursor-pointer rounded-xl glass-card overflow-hidden'  onClick={()=> setCurrentTrailer(trailer)}>
                <img src={trailer.image} alt='trailer' className='w-full h-full object-cover brightness-90'/>
                <PlayCircleIcon strokeWidth={1.6} className='absolute top-1/2 left-1/2 w-6 md:w-8 h-6 md:h-8 transform -translate-x-1/2 -translate-y-1/2' />
            </div>
        ))}
      </div>
    </div>
  )
}

export default TrailerSection
