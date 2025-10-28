import DemoPaymentModal from '../components/DemoPaymentModal'
// ...existing code...
// there are some issue:-
//   no adding of the selected time in the Card
//   duplicate of cardds
//   and imae height
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const MyBookings = () => {
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const {axios, getToken, user,  image_base_url} = useAppContext()
  const location = useLocation();
  
  const currency = import.meta.env.VITE_CURRENCY
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const getMyBookings = async() => {
    try {
      const {data} = await axios.get('/api/user/bookings', {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){
        console.log('Bookings data from backend:', data.bookings);
        setBookings(data.bookings)
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
    // If redirected from payment, refresh bookings
    // Looks for ?payment=success or any query param
    if (location.search) {
      getMyBookings();
    }
  }, [user, location.search]);

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-32 md:pt-40 min-h-[80vh]'>
      <BlurCircle top='100px' left='100px'/>
      <div>
        <BlurCircle bottom='0px ' left='600px'/>
      </div>  
      <h1 className='text-lg font-semibold mb-4'>My Booking</h1>  
      {bookings.map((item,index)=>(        
        <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
          <div className='flex flex-col md:flex-row'>
            <img src={image_base_url + (item.show?.movie?.poster_path || item.show?.poster_path || '')} alt='' className='md:max-w-45 aspect-video h-40 object-cover object-bottom rounded'/>
            <div className='flex flex-col p-4'>
              <p className='text-lg font-semibold'>{item.show?.movie?.title || item.show?.title || 'No Title'}</p>
              <p className='text-gray-400 text-sm'>{item.show?.movie?.runtime ? timeFormat(item.show.movie.runtime) : (item.show?.runtime ? timeFormat(item.show.runtime) : '')}</p>
              <p className='text-gray-400 text-sm mt-auto'>{item.show?.showDateTime ? dateFormat(item.show.showDateTime) : (item.show?.dateTime ? dateFormat(item.show.dateTime) : '')}</p>
            </div>
          </div>
          <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
            <div className='flex items-center gap-4'>
              <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
              {!item.isPaid && (
                <>
                  <button
                    className='bg-primary px-4 py-1.5 mb-3 txt-sm rounded-full font-medium cursor-pointer'
                    onClick={() => {
                      setSelectedBooking(item);
                      setShowDemoModal(true);
                    }}
                  >
                    Pay now
                  </button>
                </>
              )}
    {/* Demo Payment Modal (optional, removable) */}
    <DemoPaymentModal
      open={showDemoModal}
      onClose={() => setShowDemoModal(false)}
      amount={selectedBooking?.amount}
      onSuccess={async () => {
        if (selectedBooking) {
          try {
            await axios.post(`/api/booking/fakepay/${selectedBooking._id}`);
            getMyBookings();
          } catch (err) {
            alert('Demo payment failed');
          }
        }
      }}
    />
            </div>
            <div className='text-sm'>
              <p><span className='text-gray-400'>Total Tickets</span>{Array.isArray(item.bookedseats) ? item.bookedseats.length : 0}</p>
              <p><span className='text-gray-400'>Seat Number</span>{Array.isArray(item.bookedseats) ? item.bookedseats.join(", ") : ''}</p>
            </div>
          </div>
        </div>
      ))}  
    </div>
  ) : <Loading/>
}

export default MyBookings
