import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import '../style/Upload.css';


function FieldError (props) {
    return (
        <Alert className={props.classNameExtra? props.classNameExtra: ''} variant="warning">{props.message}</Alert>
    );
};

function FileField (props) {
    const { error } = props;
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
        imgDiv.style.display = 'block';
        alert.style.display = 'none';
    };

    return (
        <div>
            <div className="img-to-up" id={imgDivId}>
                <h6 className="text-center">You are about to upload the image below</h6>
                <img id={imgId} src="" alt="To be uploaded" />
            </div>

            {error? <FieldError id={alertId} message={error} />: <Alert id={alertId} variant='info'>Choose an image</Alert>}

            <Form.Group>
                <Form.Label>File</Form.Label>
                <Form.File name='file' accept='image/*' className="form-control" onChange={handleFileSelect} />
            </Form.Group>
        </div>
    );
};


function GenericTextField (props) {
    const { error, name, help, textArea, x_name } = props;

    return (
        <div>
            {error? <FieldError message={error} />: <Alert variant='info'>{help}</Alert>}

            <Form.Group>
                <Form.Label>{x_name}</Form.Label>
                <Form.Control as={textArea? 'textarea': 'input'} rows={textArea? 10: void 0} name={name}/>
            </Form.Group>
        </div>
    );
};

export default function Upload (props) {
    const captionField = {
        x_name: 'Caption',
        name: 'caption',
        help: 'Tell others what the image is about',
        textArea: true
    };

    const uploaderNameField = {
        x_name: 'Your name',
        name: 'your_name',
        help: 'Enter a name you would like to be known as',
        textArea: false
    }

    const [ errors, errorsUpdate ] = useState({
        file: null,
        caption: null,
        your_name: null
    });

    const errorsPresent = Object.values(errors).some((error) => Boolean(error));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        errorsUpdate({
            file: null,
            caption: 'Too short',
            your_name: 'Nest'
        })
    };

    return (
        <div className="cloud">
            <form method="POST" id="form-upload" encType="multipart/form-data" onSubmit={handleFormSubmit}>
                <legend className="text-center legend-form">Upload an image to <span className="s3">S3photos</span></legend>
                {errorsPresent? <FieldError classNameExtra="text-center error" message={'Please correct the errors below'} />: void 0}
                <FileField error={errors.file} />
                <hr />
                <GenericTextField {...captionField} error={errors.caption}/>
                <hr />
                <GenericTextField {...uploaderNameField} error={errors.your_name}/>
                <hr />
                <Button type="submit" variant="dark">Upload to <span className="s3">S3photos</span></Button>
            </form>
        </div>
    )
}