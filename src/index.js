import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = document.getElementById('root');



export const loadPostsUrl = root.dataset.loadPosts;
export const uploadPostUrl = root.dataset.uploadPost;
export const token = root.dataset.token;
export const icons = {
    user: root.dataset.userIcon,
    clock: root.dataset.timeIcon,
    heart: root.dataset.heartIcon,
    heartFull: root.dataset.heartFullIcon
};

ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, root);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
