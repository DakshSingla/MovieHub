import React from 'react'

const Title = ({ text1, text2}) => {
  return (
    <div className='mb-4'>
      <h1 className='text-3xl font-semibold text-glow'>
        {text1} <span className='text-primary text-glow-pink'>{text2}</span>
      </h1>
      <div className='mt-1 h-[2px] w-28 bg-gradient-to-r from-purple-500/60 via-pink-500/80 to-transparent rounded-full' />
    </div>
  )
}

export default Title
