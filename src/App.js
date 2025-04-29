import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserProvider } from './context/UserContext';
import AppNavbar from './components/AppNavbar';
// import Banner from './components/Banner';
// import Highlights from './components/Highlights';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import AddCourse from './pages/AddCourse';
import Home from './pages/Home';
import Register from './pages/Register';
import News from './pages/News';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';

function App() {

  //State hook for the user state is defined here to allow it to have a global scope
  //This can be achieved using prop drilling or via react context
  //This will be used to store the user information and will be used for validating if a user is logged in on the app or not
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })


  //Function for clearing localStorage on logout
  function unsetUser(){
    localStorage.clear()
  }

  useEffect(() => {
    fetch(`http://localhost:4000/users/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token') }`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      console.log(typeof data !== "undefined")
      // Set the user states values with the user details upon successful login.
      if (typeof data !== "undefined") {

        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });

      // Else set the user states to the initial values
      } else {

        setUser({
          id: null,
          isAdmin: null
        });

      }

    })
  }, [])

  //Used to check if the user information is properly stored upon login and the localStorage information is cleared upon logout
  useEffect(()=> {
    console.log(user);
    console.log(localStorage)
  }, [user])


  return (
    <>
      <UserProvider value ={{user, setUser, unsetUser}}>
        <Router>
          <AppNavbar />
          <Container>
            <Routes>
              <Route path="/" element ={<Home />}/>
              <Route path="/courses" element ={<Courses />}/>
              <Route path="/courses/:courseId" element ={<CourseView />}/>
              <Route path="/addCourse" element={<AddCourse />} />
              <Route path="*" element={<Error />} />
              <Route path="/register" element ={<Register />}/>
              <Route path="/login" element ={<Login />}/>
              <Route path="/news" element={<News />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/logout" element ={<Logout />}/>
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  )
}

export default App