
import React, { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import {Route, Routes, useLocation} from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
// import MyBooking from './pages/MyBookings' // Remove unused singular import
import Favorite from './pages/Favorite'
import { Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'
const DashBoard = lazy(() => import('./pages/admin/DashBoard'))
const AddShows = lazy(() => import('./pages/admin/AddShows'))
const ListShows = lazy(() => import('./pages/admin/ListShows'))
const ListBookings = lazy(() => import('./pages/admin/ListBookings'))
const Layout = lazy(() => import('./pages/admin/Layout'))
import { useAppContext } from './context/AppContext'
import { SignIn } from '@clerk/clerk-react'
import Loading from './components/Loading'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const { user, isAdmin } = useAppContext();


  return (
    <>
      <Toaster/>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/:date' element={<SeatLayout/>} />
        <Route path='/my-bookings' element={<MyBookings/>} />
        <Route path='/loading/:nextUrl' element={<Loading/>} />
        <Route path='/favorite' element={<Favorite/>} />
        <Route path='/admin/*' element={
          // Admin route handling:
          // - If no user: show SignIn
          // - If user present but isAdmin is still null: show Loading
          // - If user present and isAdmin true: show Layout
          // - If user present and isAdmin false: show not authorized message
          !user ? (
            <div className='min-h-screen flex justify-center items-center'>
              <SignIn fallbackRedirectUrl={'/admin'}/>
            </div>
          ) : isAdmin === null ? (
            <Loading />
          ) : isAdmin ? (
            <Suspense fallback={<Loading/>}>
              <Layout />
            </Suspense>
          ) : (
            <div className='min-h-screen flex justify-center items-center'>
              <p className='text-lg'>You are not authorized to access this page</p>
            </div>
          )
        }>
          <Route index element={<Suspense fallback={<Loading/>}><DashBoard/></Suspense>}/>
          <Route path="add-shows" element={<Suspense fallback={<Loading/>}><AddShows/></Suspense>}/>
          <Route path="list-shows" element={<Suspense fallback={<Loading/>}><ListShows/></Suspense>}/>
          <Route path="list-bookings" element={<Suspense fallback={<Loading/>}><ListBookings/></Suspense>}/>
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
};

export default App
