import { useState, useEffect, useContext } from 'react';
import CourseCard from '../components/CourseCard';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';


export default function Courses() {

	const {user} = useContext(UserContext);

	const [courses, setCourses] = useState([])

	// The "map" method loops through the individual course objects in our array and returns a component for each course
	// Multiple components created through the map method must have a unique key that will help React JS identify which components/elements have been changed, added or removed
	// Everytime the map method loops through the data, it creates a "CourseCard" component and then passes the current element in our coursesData array using the courseProp
	// const courses = coursesData.map(course => {
	//     return (
	//         <CourseCard key={course.id} courseProp={course}/>
	//     );
	// })

    const fetchData = () => {
    	let fetchUrl = user.isAdmin === true ? "http://localhost:4000/courses/all" : "http://localhost:4000/courses/"

    	fetch(fetchUrl, {
    		headers: {
    			Authorization: `Bearer ${ localStorage.getItem('token') }`
    		}
    	})
    	.then(res => res.json())
    	.then(data => {
    		setCourses(data)
    	});
    }

    useEffect(() => {
    	fetchData()
    }, [user]);

    return(
        (user.isAdmin === true)
        ?
            <AdminView coursesData={courses} fetchData={fetchData}/>
        :
            <UserView coursesData={courses} />
    )
}