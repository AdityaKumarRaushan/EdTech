import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import Error  from './Error';
import CourseSlider from '../components/core/Catalog/CourseSlider'
import Course_Card from '../components/core/Catalog/Course_Card';
import Footer from '../components/common/Footer';

const Catalog = () => {

    const {loading} = useSelector((state) => state.profile);
    const {catalogName} = useParams();
    const [active, setActive] = useState(1);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        ;(async() => {
            try{
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                // console.log("result after hitting categories API ....", res);
                const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
                // console.log("category_id after filtering the data ...", category_id);
                setCategoryId(category_id);
            }
            catch(error){
                console.log("Could not fetch categories for catalog.JSX ...", error);
            }
        })() 
    }, [catalogName]);

    useEffect(() => {
        if(categoryId){
            ;( async () => {
                try{
                    // console.log("before hitting the getCatalogPage Data api ....")
                    const res = await getCatalogPageData(categoryId);
                    // console.log("after hitting the getCatalogPage Data api...", res);
                    setCatalogPageData(res);
                }
                catch(error){
                    console.log("Unable to fetch catalog page data in catalog.jsx ...", error);
                }
            })()
        }
    }, [categoryId]);

    if(loading || !catalogPageData){
        return (
            <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
                <div className=' spinner'></div>
            </div>
        )
    }

    if(!loading && !catalogPageData.success){
        return <Error/>
    }

  return (
    <>
        <div className='box-content bg-richblack-800 px-4'>
            <div className='mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent'>
                <p className='text-sm text-richblack-300'>{`Home / Catalog / `}
                    <span className='text-yellow-25'>{catalogPageData?.data?.selectedCategory?.name}</span>
                </p>

                <p className='text-3xl text-richblack-5'>
                    {catalogPageData?.data?.selectedCategory?.name}
                </p>

                <p className='max-w-[870px] text-richblack-200'>
                    {catalogPageData?.data?.selectedCategory?.description}
                </p>
            </div>
        </div>


        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className='section_heading'>Courses to get you started</div>

            <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                <p onClick={() => setActive(1)} className={`${active === 1 ? "border-b border-b-yellow-25 text-yellow-25" : " text-richblack-50"} cursor-pointer px-4 py-2`}>
                    Most Popular
                </p>

                <p onClick={() => setActive(2)} className={`${active === 2 ? "border-b border-b-yellow-25 text-yellow-25" : " text-richblack-50"} cursor-pointer px-4 py-2`}>
                    New
                </p>
            </div>

            <div>
                <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
            </div>
        </div>

        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className=' section_heading '>
                Top Courses in {catalogPageData?.data?.differentCategory?.name}
            </div>
            <div className=' py-8'>
                <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
            </div>
        </div>

        <div className=' mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className='section_heading '>Frequently Bought</div>
            <div className=' py-8'>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {
                        catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, i) => (
                            <Course_Card course={course} key={i} Height={"h-[400px]"}/>
                        ))
                    }
                </div>
            </div>
        </div>

        <Footer/>
    </>
  )
}

export default Catalog