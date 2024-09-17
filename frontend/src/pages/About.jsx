import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox';

const About = () => {
  return (
    <div>
      
    <div className='text-2xl text-center pt-8 border-t'>
         <Title text1={'ABOUT'} text2={"US"}/>
    </div>
     
     <div className='my-10 flex flex-col md:flex-row gap-6'>
         <img src={assets.about_img} alt="" className='w-full md:max-w-[450px]' />
         <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
           <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod eum adipisci non sint fugiat dicta maiores natus totam, quasi iste!</p>
           <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque sunt exercitationem voluptatum eveniet, nemo perferendis. Iste laboriosam amet deserunt, dolor excepturi, officiis libero quos in facilis necessitatibus aliquam numquam velit.</p>
           <b className='text-gray-800'>Our Mission</b>
           <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident blanditiis doloribus sed. Doloremque, maiores, eos iste ea consequuntur quia soluta maxime optio vero at aliquam reprehenderit architecto cumque provident incidunt expedita accusamus suscipit, nihil quod! Rem, officia, sed numquam dignissimos labore sapiente dolorum dolor provident nulla vero id, porro totam?</p>
         </div>
     </div>

     <div className='text-xl py-4'>
          <Title text1={"WHY"} text2={"CHOOSE US"}/>
     </div>

     <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>we meticulously select and vet each product to ensure it meets our stringent quality standrards. </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>WiTh our user-friendly interface and hassle-free ordering process, shopping has never been easier. </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
        </div>
     </div>
      
      <NewsLetterBox/>
    </div>
  )
}

export default About
