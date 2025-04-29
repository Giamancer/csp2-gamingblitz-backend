import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import UserContext from '../context/UserContext';
import ResetPassword from '../components/ResetPassword';

export default function Profile(){

    const { user } = useContext(UserContext);

    const [details,setDetails] = useState({});

    useEffect(() => {
	    fetch(`http://localhost:4000/users/details`, {
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			// Set the user states values with the user details upon successful login.
			if (typeof data !== undefined) {

				setDetails(data);

			} else if (data.error === "User not found") {

				alert("User not found, please check if you're logged in or contact the administrator.");

			} else {

				alert("Something went wrong, kindly contact us for assistance.");

			}
	    });
    }, [])

	return (
        (user.id === null) ?
	        <Navigate to="/courses" />
	        :
	        <>
	        	<Row>
					<Col className="mt-5 p-5 bg-primary text-white">
						<h1 className="mb-5 ">Profile</h1>
						<h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
						<hr />
						<h4>Contacts</h4>
						<ul>
							<li>Email: {details.email}</li>
							<li>Mobile No: {details.mobileNo}</li>
						</ul>
					</Col>
	        	</Row>
	        	<Row className='pt-4 mt-4'>
	        		<Col>
	        			<ResetPassword />
	        		</Col>
	        	</Row>
		        
	        </>
			
	)

}