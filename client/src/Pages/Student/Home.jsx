import React from 'react'
import Navbar from '../../Components/Student/Navbar'
import Hero from '../../Components/Student/Hero'
import Companies from '../../Components/Student/Companies'
import CourseSection from '../../Components/Student/CourseSection'
import TestimonialSection from '../../Components/Student/TestimonialSection'
import CalltoAction from '../../Components/Student/CalltoAction'
import Footer from '../../Components/Student/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero/>
      <Companies/>
      <CourseSection/>
      <TestimonialSection/>
      <CalltoAction/>
      <Footer/>
    </div>
  )
}

export default Home