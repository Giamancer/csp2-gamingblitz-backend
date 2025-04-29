import { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import CourseSearch from './CourseSearch';

export default function UserView({coursesData}) {

    const [courses, setCourses] = useState([])

    useEffect(() => {
        console.log(coursesData);

        const coursesArr = coursesData.map(course => {
            //only render the active courses
            if(course.isActive === true) {
                return (
                    <CourseCard courseProp={course} key={course._id}/>
                    )
            } else {
                return null;
            }
        })

        //set the courses state to the result of our map function, to bring our returned course component outside of the scope of our useEffect where our return statement below can see.
        setCourses(coursesArr)

    }, [coursesData])

    return(
        <>
            <CourseSearch />
            { courses }
        </>
        )
}