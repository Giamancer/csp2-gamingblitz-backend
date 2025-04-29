import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import EditCourse from './EditCourse';
import ArchiveCourse from './ArchiveCourse';


export default function AdminView({ coursesData, fetchData }) {


    const [courses, setCourses] = useState([])


    //Getting the coursesData from the courses page
    useEffect(() => {
        console.log(coursesData);

        const coursesArr = coursesData.map(course => {
            return (
                <tr key={course._id}>
                    <td>{course._id}</td>
                    <td>{course.name}</td>
                    <td>{course.description}</td>
                    <td>{course.price}</td>
                    <td className={course.isActive ? "text-success" : "text-danger"}>
                        {course.isActive ? "Available" : "Unavailable"}
                    </td>
                    <td> <EditCourse course={course} fetchData={fetchData} /> </td> 
                    <td><ArchiveCourse course={course} isActive={course.isActive} fetchData={fetchData}/></td>
                </tr>
                )
        })

        setCourses(coursesArr)

    }, [coursesData])


    return(
        <>
            <h1 className="text-center my-4"> Admin Dashboard</h1>
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {courses}
                </tbody>
            </Table>    
        </>

        )
}