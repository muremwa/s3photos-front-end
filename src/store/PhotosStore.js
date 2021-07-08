import { EventEmitter } from 'events';
import dispatcher from '../dispatcher/dispatcher';

class PhotoStore extends EventEmitter {
    posts = []
    likedPosts = []
    loaded = false;
    cases = {
        HUNGARIAN_NOTATION: 'HN',
        NORMAL_CASE: 'NC',
        CAMEL_CASE: 'CC',
        SNAKE_CASE: 'SC',
    };

        
    /**
     * @param {string} toChange
     * @param {cases} currentCase
     * @param {cases} changeTo
     * @returns {string} Returns an string in the new case type
    */
    caseChanger (toChange, currentCase, changeTo) {
        if ([toChange, currentCase, changeTo].some((arg) => arg === undefined)) {
            throw new Error('Missing arguments');
        };

        if ([toChange, currentCase, changeTo].some((arg) => (typeof arg) !== 'string')) {
            throw new Error('Wrong argument type');
        };

        currentCase = currentCase.toUpperCase();
        changeTo = changeTo.toUpperCase();

        if (currentCase === changeTo) {
            return toChange;
        }

        let temp;
        let result;

        switch (currentCase) {
            case this.cases.CAMEL_CASE:
                temp = toChange.split(/([A-Z]{1}[a-z]*)/).filter(Boolean);
                break;

            case this.cases.HUNGARIAN_NOTATION:
                temp = toChange.split(/([A-Z]{1}[a-z]*)/).filter(Boolean);
                break;

            case this.cases.SNAKE_CASE:
                temp = toChange.split("_");
                break;

            case this.cases.NORMAL_CASE:
                temp = toChange.split(/\s/);
                break;
        
            default:
                throw new Error(`Converting from '${currentCase}' not supported`);
        };


        switch (changeTo) {
            case this.cases.CAMEL_CASE:
                result = temp.map((char) => `${char[0].toUpperCase()}${char.substring(1).toLowerCase()}`).join('');
                break;

            case this.cases.HUNGARIAN_NOTATION:
                result = temp.map((char, index) => {
                    char = char.toLowerCase();
                    if (index > 0) {
                        char = `${char[0].toUpperCase()}${char.substring(1).toLowerCase()}`;
                    };

                    return char
                }).join('');
                break;

            case this.cases.SNAKE_CASE:
                result = temp.map((char) => char.toLowerCase()).join('_');
                break;

            case this.cases.NORMAL_CASE:
                result = temp.map((char) => char.toLowerCase()).join(' ');
                break;

            default:
                throw new Error(`Converting to '${changeTo}' not supported`);
        };

        return result;
    };

    cleanPost (post = {}) {
        const liked = this.likedPosts.includes(post.id);
        const cleanPost_ = { liked }
        const cKeys = Object.keys(post).map((key) => this.caseChanger(key, this.cases.SNAKE_CASE, this.cases.HUNGARIAN_NOTATION));

        Object.values(post).forEach((value, i) => {
            cleanPost_[cKeys[i]] = value;
        });

        return cleanPost_
    };

    handleActions (action) {
        switch (action.type) {
            case 'LOADED_POSTS':
                this.likedPosts = action.payload.liked;
                this.posts = Array.isArray(action.payload.posts)? action.payload.posts.map((post) => this.cleanPost(post)): [];
                this.loaded = true;
                this.emit('change');
                break;
        
            default:
                break;
        }
    }
};


const postStore = new PhotoStore();
dispatcher.register(postStore.handleActions.bind(postStore));
export default postStore;