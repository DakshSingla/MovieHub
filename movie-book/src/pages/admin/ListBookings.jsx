import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const {axios, getToken, user} = useAppContext(); 
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const {data} = await axios.get('/api/admin/bookings', {
        headers: {Authorization: `Bearer ${await getToken()}`}});
        // Only set bookings when API returns success and bookings array
        if (data && data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else if (data && Array.isArray(data.bookings)) {
          // Some responses might not include success flag but still return bookings
          setBookings(data.bookings);
        } else {
          console.warn('getAllBookings: unexpected response', data);
          setBookings([]);
        }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(()=>{
    if(user){
      getAllBookings();
    }
  },[user]);

  return !isLoading ?(
    <>
      <Title text1="List" text2="Bookings"/>
      <div className='max-w-5xl overflow-x-auto glass-card neon-border rounded-xl'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-white/5 text-left text-white'>
              <th className='p-2 font-medium pl-5'>User Name</th>
              <th className='p-2 font-medium'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Seats</th>
              <th className='p-2 font-medium'>Amount</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {bookings.map((item, index) =>(
              <tr key={index} className='border-b border-white/5 bg-white/[.02] even:bg-white/[.04]'>
                <td className='p-2 min-w-45 pl-5'>{item.user?.name || "Unknown User"}</td>
                <td className='p-2'>{item.show?.movie?.title || '-'}</td>
                <td className='p-2'>{item.show?.showDateTime ? dateFormat(item.show.showDateTime) : '-'}</td>
                <td className='p-2'>
                  {/* booked seats in DB are stored as `bookedseats` (array). Support both shapes for safety. */}
                  {Array.isArray(item.bookedseats) ? item.bookedseats.join(', ') :
                    (item.bookedSeats ? Object.values(item.bookedSeats).join(', ') : '-')}
                </td>
                <td className='p-2'>{currency}{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading/>
}

export default ListBookings
