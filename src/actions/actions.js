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
