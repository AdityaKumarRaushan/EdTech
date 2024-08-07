import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from './components/core/Dashboard/Settings';
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import Cart from "./components/core/Dashboard/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
// import { useEffect } from "react";
// import { getUserDetails } from "./services/operations/profileAPI";
import Instructor from "./components/core/Dashboard/Instructor";
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/core/ViewCourse/VideoDetails';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';


function App() {

  const { user } = useSelector((state) => state.profile);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if(localStorage.getItem("token")){
  //     const token = JSON.parse(localStorage.getItem("token"));
  //     dispatch(getUserDetails(token, navigate));
  //   }
  // }, []);

  return (
      <div className=" flex flex-col w-screen min-h-screen bg-richblack-900 font-inter">
        <Navbar/>
        <Routes>
            <Route path="/" element={ <Home/>} />
            <Route path="about" element={<About />}/>
            <Route path="contact" element={<Contact />}/>
            <Route path="catalog/:catalogName" element={<Catalog/>}/>
            <Route path="courses/:courseId" element={<CourseDetails/>}/>

            <Route path="signup" 
                  element={
                  <OpenRoute>
                    <Signup />
                  </OpenRoute>
                }
            />
            <Route path="login" 
                  element={
                  <OpenRoute>
                    <Login />
                  </OpenRoute>
                }
            />

            <Route path="verify-email" 
                  element={
                  <OpenRoute>
                    <VerifyEmail />
                  </OpenRoute>
                }
            />

            <Route path="forgot-password" 
                  element={
                  <OpenRoute>
                    <ForgotPassword />
                  </OpenRoute>
                }
            />

            <Route path="update-password/:id" 
                  element={
                  <OpenRoute>
                    <UpdatePassword />
                  </OpenRoute>
                }
            />

            {/* // private routes are only for logged in users  */}
            <Route
              element={
                <PrivateRoute>
                  <Dashboard/>
                </PrivateRoute>
              }
            >
                {/* // this setting outlet route is for both students and instructor  */}
                <Route path="dashboard/my-profile" element={<MyProfile/>} />
                <Route path="dashboard/Settings" element={<Settings/>} />
                
                {/* // this is for students to be accessed */}
                {
                  user?.accountType === ACCOUNT_TYPE.STUDENT && (
                    <>
                      <Route path="dashboard/cart" element={<Cart />} />
                      <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                    </>
                  )
                }
                 
                {/* // this is for instructor to be accessed  */}
                {
                  user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                    <>
                      <Route path="dashboard/add-course" element={<AddCourse />} />
                      <Route path="dashboard/my-courses" element={<MyCourses />} />
                      <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                      <Route path="dashboard/instructor" element={<Instructor/>}/>
                    </>
                  )
                }
            </Route>


            {/* For watching the video lectures we have outlet components  */}
            <Route element={
              <PrivateRoute>
                <ViewCourse/>
              </PrivateRoute>
            }>
                {
                  user?.accountType === ACCOUNT_TYPE.STUDENT && (
                    <Route element={<VideoDetails/>}
                      path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                    />
                  )
                }
            </Route>

            <Route path="*" element={<Error />} />

        </Routes>

      </div>
  );
}

export default App;
