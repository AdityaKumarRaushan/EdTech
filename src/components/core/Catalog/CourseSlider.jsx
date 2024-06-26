import React from 'react'
import {Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import Course_Card from './Course_Card';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const CourseSlider = ({Courses}) => {
  return (
    <>
        {
            Courses?.length
            ? (
                <Swiper slidesPerView={1} loop={true} spaceBetween={200} breakpoints={{1024 : {slidesPerView: 3}}}
                    pagination={true} navigation={true} className='mySwiper'
                    modules={[Autoplay, Pagination, Navigation]} autoplay={{delay:1000, disableOnInteraction:false}}
                >
                    {
                        Courses?.map((course, index) => (
                            <SwiperSlide key={index}>
                                <Course_Card course={course} Height={"h-[250px]"}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
              )
            : (
                <p>No Courses Found</p>
              )
        }
    </>
  )
}

export default CourseSlider