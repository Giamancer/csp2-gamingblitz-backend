import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function CourseView() {

	const notyf = new Notyf();
	const navigate = useNavigate();

	const { courseId } = useParams();
	const {user} = useContext(UserContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    function enroll(courseId) {
    	fetch("http://localhost:4000/enrollments/enroll", {
    		method: "POST",
    		headers: {
    			"Content-Type": "application/json",
    			Authorization: `Bearer ${ localStorage.getItem('token')}`
    		},
    		body: JSON.stringify({
    			enrolledCourses: [{courseId}],
    			totalPrice: price
    		})
    	})
    	.then(res => res.json())
    	.then(data => {
    		if (data.message === 'Admin is forbidden'){
    			notyf.error("Admin Forbidden")
    		} else if (data.message === 'Enrolled successfully'){
    			notyf.success("Enrollment Successful")
    			navigate("/courses");
    		} else {
    			notyf.error("Internal Server Error. Notify System Admin.")
    		}
    	})
    };

    useEffect(() => {
    	console.log(courseId);

    	fetch(`http://localhost:4000/courses/specific/${courseId}`)
    	.then( res => res.json())
    	.then(data => {
    		console.log(data);

    		setName(data.name);
    		setDescription(data.description);
    		setPrice(data.price);
    	})
    }, [courseId]);

    return(
        <Container className="mt-5">
            <Row>
                <Col lg={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>{name}</Card.Title>
                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text>{description}</Card.Text>
                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text>PhP {price}</Card.Text>
                            <Card.Subtitle>Class Schedule</Card.Subtitle>
                            <Card.Text>8 am - 5 pm</Card.Text>
                            { user.id !== null ? 
                                <Button variant="primary" block="true" onClick={() => enroll(courseId)}>Enroll</Button>
                            : 
                                <Link className="btn btn-danger btn-block" to="/login">Log in to Enroll</Link>
                            }
                            
                        </Card.Body>        
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}