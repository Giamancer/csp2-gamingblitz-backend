import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

export default function NewsCard({newsProp}) {

    console.log(newsProp);
    const {name, description} = newsProp;

    const [likes, setLikes] = useState(0);

    function likeNews(){
        if (likes < 10) {
            setLikes(likes + 1);
            console.log('Likes: ' + likes)
        } else {
            alert("Promo Alert: Since this news has reached a certain number of likes, we would like to offer a discount on your next class.");
        }
    }

    return (
        <Card className="mb-3">
            <Card.Body className="text-center">
                <Card.Title>{name}</Card.Title>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle className="mb-3">Likes: {likes}</Card.Subtitle>
                <Button variant="primary" onClick={likeNews}  className="text-center">Like</Button>
            </Card.Body>
        </Card>
    )
}

NewsCard.propTypes = {
    newsProp: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        isActive: PropTypes.bool.isRequired
    })
}