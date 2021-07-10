import dispatcher from '../dispatcher/dispatcher';
import ajax from './ajaxWrapper';
import { loadPostsUrl, uploadPostUrl } from '../index';

export function loadPosts (query, end = () => {}) {
    const url_ = query? `${loadPostsUrl}?post-query=${query}`: loadPostsUrl;

    const loadOptions = {
        url: url_,
        responseType: 'json',
        error: () => end(true),
        success: (payload_) => {
            if (payload_.response) {
                dispatcher.dispatch ({
                    type: 'LOADED_POSTS',
                    payload: {
                        posts: payload_.response.posts,
                        liked: payload_.response.liked
                    }
                });
            };
            end(false);
        }
    };

    ajax.get(loadOptions);
};


// upload a post
export function uploadPost (form, uploading = () => {}, onSuccess = () => {}, end = () => {}, error = () => {}) {
    const uploadOptions = {
        url: uploadPostUrl,
        responseType: 'json',
        form: form,
        error: error,
        success: (payload_) => {
            const response = payload_.response;
            if (response.success) {
                onSuccess();
            } else {
                const cleanErrors = {}
                Object.keys(response.errors).forEach((key) => cleanErrors[key] = response.errors[key][0])
                error(cleanErrors);
                end();
            };
        },
        uploadprogress: (loaded, total) => {
            const pc = (loaded/total) * 100;
            uploading(pc);
        },
    };

    ajax.post(uploadOptions);
};

// like a post
export function likePost (_url, form, postId, endOfLike) {
    const likeOptions = {
        url: _url,
        responseType: 'json',
        form: form,
        error: endOfLike,
        success: (payload_) => {
            const response = payload_.response;
            const responseKeys = Object.keys(response);

            dispatcher.dispatch ({
                type: 'LIKED_POST',
                payload: {
                    postId,
                    status: responseKeys.includes('liked')? response.liked: false,
                    likes: responseKeys.includes('likes')? response.likes: -1 
                }
            });
            endOfLike();
        }
    };

    ajax.post(likeOptions);
};
