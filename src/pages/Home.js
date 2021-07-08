import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { NavLink } from 'react-router-dom';

import '../style/Home.css';
import user from '../icons/user.svg';
import clock from '../icons/clock.svg';
import heart from '../icons/heart.svg';
import heartFull from '../icons/heart_full.svg';


function NoPostsAvailable () {
    return (
        <div className="container" id="no-posts">
            <div className="text-center">
                <h2>No posts availble at this moment</h2>
                <NavLink to='/upload/' className="btn btn-dark upload-btn" exact>Upload to <span className="s3">S3photos</span></NavLink>
            </div>
        </div>
    )
};

function PostLike (props) {
    const { likes, likingUrl, liked} = props;
    const [ likeStatus, statusUpdater ] = useState(liked);
    const [ _likes, likesUpdater ] = useState(likes)

    const handleLikeClick = () => {
        likesUpdater(likeStatus? _likes - 1: _likes + 1);
        statusUpdater(!likeStatus);
    };

    return (
        <div className="like">
            <img src={likeStatus? heartFull: heart} alt="like vector" className="vector liking" data-like-url="" onClick={handleLikeClick} />
            <span className="h-m-l" name='count'>{_likes}</span>
        </div>
    );
};


function Post (props) {
    const { caption, imageFile, likes, likingUrl, cleanTime, uploadedBy, id, liked } = props;

    const _cleanTime = (time) => {
        return time.replace(/\s0/g, ' ').replace(/AM/, 'a.m.').replace(/PM/, 'p.m.');
    };

    return (
        <Card className="post">
            <img src={imageFile} alt={`Post by ${uploadedBy}`}/>
            <div className="post-info">
                <div className="info-post">
                    <div className="uploader">
                        <span className="uploader-info">
                            <img className="user-vector vector" src={user} alt="user-vector" />
                            <NavLink to={`/?post-query=${uploadedBy}`} className="uploader-name">{uploadedBy}</NavLink>
                        </span>
                    </div>
                    <div className="date">
                        <img src={clock} alt="clock-vector" className="clock-vector vector" />
                        <span className="posted-time">{_cleanTime(cleanTime)}</span>
                    </div>
                </div>

                <div className="caption">
                    <p>{caption}</p>
                </div>

                <PostLike {...{likes, likingUrl, id, liked}} />
            </div>
        </Card>
    );
};


export default function Home (props) {
    const p = [
        {
            id: 20,
            likingUrl: '/',
            uploadedBy: 'Muremwa',
            imageFile: 'http://localhost:8000/media/photos/900828.jpg',
            caption: 'For Nancy',
            likes: 7,
            cleanTime: 'July 08, 2021, 04:03 PM',
        },
        {
            id: 20,
            likingUrl: '/',
            uploadedBy: 'Luke',
            imageFile: 'http://localhost:8000/media/photos/91069_2.jpg',
            caption: 'For Leia',
            likes: 7,
            cleanTime: 'July 08, 2021, 04:03 PM',
        },
        {
            id: 20,
            likingUrl: '/',
            uploadedBy: 'Mr. White',
            imageFile: 'http://localhost:8000/media/photos/bb.gif',
            caption: 'For Jesee',
            likes: 7,
            cleanTime: 'July 08, 2021, 04:03 PM',
        },
        {
            id: 20,
            likingUrl: '/',
            uploadedBy: 'Tony',
            imageFile: 'http://localhost:8000/media/photos/empire_hospital_mafia_II.png',
            caption: 'For Vito',
            likes: 7,
            cleanTime: 'July 08, 2021, 04:03 PM',
        }
    ]
    const posts = p.map((x, i) => <Post key={i} {...x} liked={(i+1)%2 === 0}/>)

    return (
        <div className="every">
            {posts.length > 0? posts: <NoPostsAvailable />}
        </div>
    )
}