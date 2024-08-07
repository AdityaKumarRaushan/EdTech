import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import Upload from '../CourseInformation/Upload';
import IconBtn from "../../../../common/IconBtn";


export default function SubSectionModal({modalData, setModalData, add=false, view=false, edit=false}){

    const {register, handleSubmit, setValue, getValues, formState:{errors}} = useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state)=> state.auth);
    const {course}= useSelector((state)=> state.course);

    useEffect(() => {
        if(view || edit){
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);
        }
    }, []);

    const isFormUpdated = () => {   // checking that is there any change in form
        const currentValues = getValues();
        if(
            currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl
        ){
            return true;
        }
        else return false;
    }

    const handleEditSubSection = async () => {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if(currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle);
        }
        if(currentValues.lectureDesc !== modalData.description) {
            formData.append("description", currentValues.lectureDesc);
        }
        if(currentValues.lectureVideo !== modalData.videoUrl) {
            formData.append("video", currentValues.lectureVideo);
        }

        // console.log("values of form data being used to call update subsection api ...", formData);

        setLoading(true);
        const result = await updateSubSection(formData, token);
        // console.log("result after updating Subsection ....", result);
        if(result){
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData.sectionId ? result : section);
            const updatedCourse = {...course, courseContent: updatedCourseContent};
            // console.log("updated course content after getting result from update subsection api call..", updatedCourse);
            dispatch(setCourse(updatedCourse));
        }

        setModalData(null);
        setLoading(false);
    }

    const onSubmit = async (data) => {
        if(view){
            return;
        }

        if(edit){
            if(!isFormUpdated()){
                toast.error("No changes made to the form");
            }
            else{
                handleEditSubSection();
            }

            return;
        }

        const formData = new FormData();
        formData.append("sectionId", modalData);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("video", data.lectureVideo);

        setLoading(true);
        const result = await createSubSection(formData, token);

        if(result) {   // update the structure of course
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData ? result : section);
            const updatedCourse = { ...course, courseContent: updatedCourseContent }
            dispatch(setCourse(updatedCourse))
        }

        setModalData(null);
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                    <p className="text-xl font-semibold text-richblack-5">{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
                    <button onClick={() => (!loading ? setModalData(null) : {})}>
                        <RxCross2 className="text-2xl text-richblack-5"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
                    <Upload name="lectureVideo" label="Lecture Video" register={register}
                        setValue={setValue} errors={errors} video={true} 
                        viewData={view ? modalData.videoUrl : null}  editData={edit ? modalData.videoUrl : null}
                    />

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="lectureTitle" className="text-sm text-richblack-5">
                            Lecture Title {!view && <sup className="text-pink-200">*</sup>}
                        </label>
                        <input type="text" id="lectureTitle" name="lectureTitle" placeholder="Enter Lecture Title"
                            {...register("lectureTitle", {required: true})} className=" form-style w-full"
                        />
                        {
                            errors.lectureTitle && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                    Lecture title is required
                                </span>
                            )
                        }
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="lectureDesc" className=" text-sm text-richblack-5">
                            Lecture Description {" "} {!view && <sup className="text-pink-200">*</sup>}
                        </label>
                        <textarea name="lectureDesc" id="lectureDesc" placeholder="Enter Lecture Description"
                            {...register("lectureDesc", {required: true})} disabled={view || loading} className="form-style resize-x-none min-h-[130px] w-full"
                        />

                        {
                            errors.lectureDesc && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                    Lecture Description is required
                                </span>
                            )
                        }
                    </div>

                    {
                        !view && (
                            <div className="flex justify-end">
                                <IconBtn disabled={loading}
                                    text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                                />
                            </div>
                        )
                    }
                </form>
            </div>
        </div>
    )

}

