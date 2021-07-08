import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { NavLink, useLocation } from 'react-router-dom';

import store from '../store/PhotosStore';
import { loadPosts } from '../actions/actions';
import { searchQ } from './utils';

import '../style/Home.css';
import user from '../icons/user.svg';
import clock from '../icons/clock.svg';
import heart from '../icons/heart.svg';
import heartFull from '../icons/heart_full.svg';


function NoPostsAvailable (props) {
    return (
        <div className="container" id="no-posts">
            <div className="text-center">
                <h2>No posts availble at this moment {props.from? `from ${props.from}`: void 0}</h2>
                <NavLink to={`/upload/${props.from? `?as=${props.from}`: void 0}`} className="btn btn-dark upload-btn" exact>Upload to <span className="s3">S3photos</span> {props.from? `as ${props.from}`: void 0}</NavLink>
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
            <span className="h-m-l" name='count'> {_likes}</span>
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
    const location = useLocation();
    const [ rPosts, postsUpdate ] = useState(store.posts);
    const [ fetchPosts, fetchPostsChanger ] = useState(true);
    const posts = rPosts.map((x, i) => <Post key={i} {...x}/>)
    const searchs = searchQ(props.location.search);

    if (fetchPosts) {
        loadPosts(searchs.has('post-query')? searchs.get('post-query'): null);
        fetchPostsChanger(false);
    };

    const loadNewPosts = () => {
        postsUpdate(store.posts);
    };

    useEffect(() => {
        fetchPostsChanger(true);
    }, [location])

    useEffect(() => {
        store.on('change', loadNewPosts);
        return () => store.removeListener('change', loadNewPosts);
    });

    return (
        <div className="every">
            {posts.length > 0? posts: <NoPostsAvailable from={searchs.has('post-query')? searchs.get('post-query'): null} />}
        </div>
    );
};