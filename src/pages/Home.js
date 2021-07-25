import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { NavLink, useLocation } from 'react-router-dom';

import store from '../store/PhotosStore';
import { loadPosts, likePost } from '../actions/actions';
import { searchQ } from './utils';
import { token, icons } from '../index';

import '../style/Home.css';


function NoPostsAvailable (props) {
    const { error, reloader } = props
    return (
        <div className="container" id="no-posts">
            <div className="text-center">
                <h2>No posts availble at this moment {props.from? `from ${props.from}`: void 0}</h2>
                <NavLink to={`${props.from? `/upload/?as=${props.from}`: '/upload/'}`} className="btn btn-dark upload-btn" exact>Upload to <span className="s3">S3photos</span> {props.from? `as ${props.from}`: void 0}</NavLink>
            </div>
            <br />
            <div className="text-center">
                <Button onClick={reloader} variant={error? "danger": "dark"}>{error? 'An error occured ': ''}Click to reload</Button>
            </div>
        </div>
    )
};

function PostLike (props) {
    const { likes, likingUrl, liked, id, line } = props;
    const [ likeStatus, statusUpdater ] = useState(liked);
    const [ _likes, likesUpdater ] = useState(likes);
    const likeBtnId = `like-btn-${id}`;

    const submitLikeForm = () => {
        const btn = document.getElementById(likeBtnId);
        btn? btn.click(): void 0;
    };

    const afterLike = () => {
        const _data = store.getPostLikes(id);
        if (_data !== null) {
            statusUpdater(_data.liked);
            likesUpdater(_data.likes);
        };
    };

    const handleLikeClick = (event_) => {
        event_.preventDefault();
        line(97, false);
        likePost(likingUrl, event_.target, id, () => line(0, true));
    };
    
    useEffect(() => {
        store.on(`change_to_post_${id}`, afterLike);
        return () => store.removeListener(`change_to_post_${id}`, afterLike);
    });

    return (
        <form className="like" onSubmit={handleLikeClick}>
            <input type="hidden" name="csrfmiddlewaretoken" value={token}/>
            <img type="image" src={likeStatus? icons.heartFull: icons.heart} alt="like vector" className="vector liking" onClick={submitLikeForm} />
            <input type="submit" hidden id={likeBtnId} />
            <span className="h-m-l" name='count'> {_likes}</span>
        </form>
    );
};


function Post (props) {
    const { caption, imageFile, likes, likingUrl, cleanTime, uploadedBy, id, liked, line } = props;

    const _cleanTime = (time) => {
        return time.replace(/\s0/g, ' ').replace(/AM/, 'a.m.').replace(/PM/, 'p.m.');
    };

    return (
        <Card className="post" id={`post-${id}`}>
            <img src={imageFile} alt={`Post by ${uploadedBy}`}/>
            <div className="post-info">
                <div className="info-post">
                    <div className="uploader">
                        <span className="uploader-info">
                            <img className="user-vector vector" src={icons.user} alt="user-vector" />
                            <NavLink to={`/?post-query=${uploadedBy}`} className="uploader-name">{uploadedBy}</NavLink>
                        </span>
                    </div>
                    <div className="date">
                        <img src={icons.clock} alt="clock-vector" className="clock-vector vector" />
                        <span className="posted-time">{_cleanTime(cleanTime)}</span>
                    </div>
                </div>

                <div className="caption">
                    <p>{caption}</p>
                </div>

                <PostLike {...{likes, likingUrl, id, liked, line }} />
            </div>
        </Card>
    );
};


export default function Home (props) {
    const { line } = props;
    const location = useLocation();
    const [ rPosts, postsUpdate ] = useState(store.posts);
    const [ fetchPosts, fetchPostsChanger ] = useState(true);
    const [ errorLoadingPosts, errorUpdate ] = useState(false);
    const posts = rPosts.map((post_, i) => <Post key={i} {...post_} {...{line}}/>)
    const searchs = searchQ(props.location.search);

    const stopLoading = (error = false) => {
        line(0, true);
        error? errorUpdate(true): void 0;
    }

    if (fetchPosts) {
        line(95, false);
        loadPosts(searchs.has('post-query')? searchs.get('post-query'): null, stopLoading);
        fetchPostsChanger(false);
    };

    const loadNewPosts = () => {
        postsUpdate(store.posts);
    };

    const reloadPosts = () => fetchPostsChanger(true);

    useEffect(() => {
        fetchPostsChanger(true);
    }, [location])

    useEffect(() => {
        store.on('change', loadNewPosts);
        return () => store.removeListener('change', loadNewPosts);
    });

    document.title = "S3photos | all posts"

    return (
        <div className="every">
            {posts.length > 0? posts: <NoPostsAvailable from={searchs.has('post-query')? searchs.get('post-query'): null} error={errorLoadingPosts} reloader={reloadPosts} />}
        </div>
    );
};