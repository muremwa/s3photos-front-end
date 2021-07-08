import dispatcher from '../dispatcher/dispatcher';
import ajax from './ajaxWrapper';
import { loadPostsUrl, uploadPostUrl } from '../index';

export function loadPosts (query) {
    const url_ = query? `${loadPostsUrl}?post-query=${query}`: loadPostsUrl;

    const loadOptions = {
        url: url_,
        responseType: 'json',
        error: () => {},
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
        }
    };

    ajax.get(loadOptions);
};
