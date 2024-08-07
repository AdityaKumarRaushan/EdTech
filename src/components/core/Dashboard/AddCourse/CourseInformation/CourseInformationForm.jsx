import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailAPI';
import { setCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import IconBtn from "../../../../common/IconBtn";
import { MdNavigateNext } from 'react-icons/md';
import ChipInput from './ChipInput';
import Upload from './Upload';
import RequirementsField from './RequirementsField';


const CourseInformationForm = () => {

    const {register, handleSubmit, setValue, getValues, formState:{errors}} = useForm();
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const {course, editCourse} = useSelector((state) =>  state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(()=>{
        const getCategories = async () => {
            setLoading(true);
            const categories = await fetchCourseCategories();
            if(categories.length > 0){
                setCourseCategories(categories);
            }
            // console.log("Printing values of course used in course slice whose thumbnail value is sent to UploadForm ,", course);
            setLoading(false);
        }

        // if form is in edit mode
        // console.log("value of edit course ,", editCourse);
        if(editCourse){
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.category);
            setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail);
            console.log("data populated when form is in edit mode ,", course);
        }

        getCategories();
    },[]);

    const isFormUpdated = () => {
        const currentValues = getValues();

        //  console.log("value of current value of form in isFormUpdated", currentValues);

        if(
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
        ){
            return true;
        }
        else return false;
    }

    const onSubmit = async (data) => {
        // if editing is on
        if(editCourse){
            if(isFormUpdated()){
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId", course._id);

                if(currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle)
                }
                if(currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc)
                }
                if(currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice)
                }
                if(currentValues.courseTags.toString() !== course.tag.toString()) {
                    formData.append("tag", JSON.stringify(data.courseTags))
                }
                if(currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits)
                }
                if(currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory)
                }
                if(currentValues.courseRequirements.toString() !==course.instructions.toString()) {
                    formData.append("instructions",JSON.stringify(data.courseRequirements))
                }
                if(currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage)
                }

                console.log("form Data in edit course, ", formData);

                setLoading(true);
                const result = await editCourseDetails(formData, token);
                setLoading(false);

                if(result){
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
            }
            else{
                toast.error("No changes have been made to the form");
            }
            return;
        }

        // if the new form is created 
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("tag", JSON.stringify(data.courseTags));
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("category", data.courseCategory);
        formData.append("status", COURSE_STATUS.DRAFT);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("thumbnailImage", data.courseImage);

        setLoading(true);
        // console.log("form Data in newly created course form Data, and sending to adCourse Details api ", formData);
        const result = await addCourseDetails(formData, token);
        if(result){
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
    }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className=' space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
        
        <div className="flex flex-col space-y-2">
            <label htmlFor="courseTitle" className="text-sm text-richblack-5">Course Title <sup className=' text-pink-200'>*</sup></label>
            <input type="text" id='courseTitle' name='courseTitle' placeholder='Enter course title'
                   {...register("courseTitle", {required: true})} className=' form-style w-full'    
            />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is Required</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2">
            <label htmlFor="courseShortDesc" className="text-sm text-richblack-5">Course Short Description <sup className=' text-pink-200'>*</sup></label>
            <textarea type="text" id='courseShortDesc' name='courseShortDesc' placeholder='Enter Course Description'
                   {...register("courseShortDesc", {required: true})} className=' form-style resize-x-none min-h-[130px] w-full'    
            />
            {
                errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is Required</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2">
            <label htmlFor="coursePrice" className="text-sm text-richblack-5">Course Price <sup className=' text-pink-200'>*</sup></label>
            <div className=' relative'>
                <input id='coursePrice' name='coursePrice' placeholder='Enter Course Price'
                    {...register("coursePrice", {required: true, valueAsNumber:true, pattern:{value: /^(0|[1-9]\d*)(\.\d+)?$/,}})} className=' form-style !pl-12 w-full '    
                />
                <HiOutlineCurrencyRupee className='absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400'/>
            </div>
            {
                errors.coursePrice && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is Required</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2">
            <label htmlFor="courseCategory" className="text-sm text-richblack-5">Course Category <sup className=' text-pink-200'>*</sup></label>
            <select name="courseCategory" id="courseCategory" className=' form-style w-full' defaultValue=""
                    {...register("courseCategory", {required: true})}
            >
                <option value="" disabled>Choose a Category</option>
                {
                    !loading && (
                        courseCategories?.map((category, i) => (
                            <option value={category?._id} key={i}>
                                {category?.name}
                            </option>
                        ))
                    )
                }
            </select>
            {
                errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is Required</span>
                )
            }
        </div>

        {/* ChipInput */}
        <ChipInput label="Tags" name="courseTags" placeholder="Enter Tags and press Enter"
            register={register} errors={errors} setValue={setValue} getValues={getValues}
        />

        {/* Upload  */}

        <Upload name="courseImage" label="Course Thumbnail" register={register} errors={errors}
                setValue={setValue} editData={editCourse ? course?.thumbnail : null}
        />



        <div className="flex flex-col space-y-2">
            <label htmlFor="courseBenefits" className="text-sm text-richblack-5">Benefits of the Course <sup className=' text-pink-200'>*</sup></label>
            <textarea type="text" id='courseBenefits' name='courseBenefits' placeholder='Enter Course Benefits'
                   {...register("courseBenefits", {required: true})} className=' form-style resize-x-none min-h-[130px] w-full'    
            />
            {
                errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Benefits of course is Required</span>
                )
            }
        </div>

        {/* Requirements  */}
        <RequirementsField name="courseRequirements" label={"Requirements"} errors={errors}
                            register={register} setValue={setValue} getValues={getValues}
        />

        <div className='flex justify-end gap-x-2'>
            {
                editCourse && (
                    <button onClick={()=>dispatch(setStep(2))} disabled={loading} className=' flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900'>
                        Continue without Saving
                    </button>
                )
            }

            <IconBtn onclick={handleSubmit(onSubmit)} disabled={loading} text={!editCourse ? "Next" : "Save Changes"}/>
            <MdNavigateNext/>
        </div>

    </form>
  )
}

export default CourseInformationForm