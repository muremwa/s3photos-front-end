import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import { uploadPost, uploadConnection } from '../actions/actions';
import { searchQ } from './utils';
import { token } from '../index';

import '../style/Upload.css';


function FieldError (props) {
    return (
        <Alert id={props.id? props.id: ''} className={props.classNameExtra? props.classNameExtra: ''} variant="warning">{props.message}</Alert>
    );
};

function FileField (props) {
    const { error, me } = props;
    const alertId = 'file-alert';
    const imgDivId = 'image-to-upload'
    const imgId = 'image-to-call'

    const handleFileSelect = (event_) => {
        const img = document.getElementById(imgId);
        const imgDiv = document.getElementById(imgDivId);
        const alert = document.getElementById(alertId);
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        reader.readAsDataURL(event_.target.files[0]);
        imgDiv? imgDiv.style.display = 'block': void 0;
        alert? alert.style.display = 'none': void 0;
    };

    me === null? void 0: me(alertId);

    return (
        <div>
            <div className="img-to-up" id={imgDivId}>
                <h6 className="text-center">You are about to upload the image below</h6>
                <img id={imgId} src="" alt="To be uploaded" />
            </div>

            {error? <FieldError id={alertId} message={error} />: <Alert id={alertId} variant='info'>Choose an image</Alert>}

            <Form.Group>
                <Form.Label>File</Form.Label>
                <Form.File name='file' accept='image/*' className="form-control" onChange={handleFileSelect} required />
            </Form.Group>
        </div>
    );
};


function YourNameField (props) {
    const { error, name, help, x_name, dValue, me } = props;
    const errorId = 'your-name-error';

    me === null? void 0: me(errorId);

    return (
        <div>
            {error? <FieldError message={error} id={errorId} />: <Alert variant='info'>{help}</Alert>}

            <Form.Group>
                <Form.Label>{x_name}</Form.Label>
                <Form.Control defaultValue={dValue} name={name} required/>
            </Form.Group>
        </div>
    );
};


function CaptionField (props) {
    const { error, name, help, x_name, dValue, me } = props;
    const errorId = 'caption-error-id';

    me === null? void 0: me(errorId);

    return (
        <div>
            {error? <FieldError id={errorId} message={error} />: <Alert variant='info'>{help}</Alert>}

            <Form.Group>
                <Form.Label>{x_name}</Form.Label>
                <Form.Control defaultValue={dValue} as='textarea' rows="10" name={name} required />
            </Form.Group>
        </div>
    );
};


function MainError (props) {
    props.me? props.me(props.id): void 0;

    return (
        <div className="text-center">
            <FieldError id={props.id} classNameExtra='text-center error' message={props.unexpected? 'An unexpected error occurred': 'Please correct the errors below'} />
            {props.unexpected? <Button onClick={props.reload} variant='dark'>Refresh to try again</Button>: null}
        </div>
    );
};

function UploadForm (props) {
    const searches = searchQ(props.location.search);
    const { line, reload } = props;
    const mainErrorId = 'main-error-id';

    const captionField = {
        dValue: '',
        x_name: 'Caption',
        name: 'caption',
        help: 'Tell others what the image is about',
    };

    const uploaderNameField = {
        dValue: searches.has('as')? searches.get('as'): '',
        x_name: 'Your name',
        name: 'your_name',
        help: 'Enter a name you would like to be known as',
    }

    const [ errors, errorsUpdate ] = useState({
        file: null,
        caption: null,
        your_name: null,
        unexpected: false
    });

    const errorsPresent = Object.values(errors).some((error) => Boolean(error));

    const onFormError = (errors = {}) => errorsUpdate(errors);

    const endOfUpload = () => line(0, true);

    const onSuccessUpload = (id) => props.history.push('/');

    const uploadProgress = (pc) => line(pc, false);

    const handleFormSubmit = (event_) => {
        event_.preventDefault();
        uploadPost(event_.target, uploadProgress, onSuccessUpload, endOfUpload, onFormError)
    };

    const errorMaster = (() => {
        if (errors.unexpected) {
            return 0;
        } else if (errors.file) {
            return 1;
        } else if (errors.caption) {
            return 2;
        } else if (errors.your_name) {
            return 3;
        } else {
            return null;
        };
    })();

    const errorPaint = (id) => {
        const errorDiv = document.getElementById(id);
        errorDiv? errorDiv.scrollIntoView(): void 0;
    };

    errorMaster === 0? errorPaint(mainErrorId): void 0;

    return (
        <div className="cloud">
            <form method="POST" id="form-upload" encType="multipart/form-data" onSubmit={handleFormSubmit}>
                <legend className="text-center legend-form">Upload an image to <span className="s3">S3photos</span>{searches.has('as')? ` as ${searches.get('as')}`: void 0}</legend>
                <input type="hidden" value={token} name="csrfmiddlewaretoken"/>
                {errorsPresent? <MainError id={mainErrorId} unexpected={errors.unexpected} me={errorMaster === 0? errorPaint: null} {...{reload}} />: void 0}
                <FileField error={errors.file} me={errorMaster === 1? errorPaint: null} />
                <hr />
                <CaptionField {...captionField} error={errors.caption} me={errorMaster === 2? errorPaint: null}/>
                <hr />
                <YourNameField {...uploaderNameField} error={errors.your_name} me={errorMaster === 3? errorPaint: null}/>
                <hr />
                <Button type="submit" variant="dark">Upload to <span className="s3">S3photos</span></Button>
            </form>
        </div>
    )
};

function NoConnection (props) {
    const { connection } = props;

    return (
        <div className="text-center">
            <h1>{connection? '': 'No Connection available'}</h1>
            {!connection? <Button onClick={props.reload}>Click to retry</Button>: null}
        </div>
    )
}


export default function Upload (props) {
    const [ connectedReq, connectedReqChanger ] = useState(false);
    const [ connection, connectionChanger ] = useState(true);

    const doneLoading = () => props.line(0, true);

    const success = () => {
        connectedReqChanger(true);
        connectionChanger(true);
    };

    const error = () => {
        connectedReqChanger(true);
        connectionChanger(false);
    }

    const reload = () => connectedReqChanger(false);

    if (!connectedReq) {
        props.line(98, false);
        uploadConnection(doneLoading, success, error);
    };

    const show = () => {
        if (connectedReq) {
            return connection? <UploadForm {...props} {...{reload}} />: <NoConnection connection={false} {...{reload}}/>
        } else {
            return <NoConnection connection={true} />
        };
    };
    document.title = "S3photos | upload"

    return show();
};