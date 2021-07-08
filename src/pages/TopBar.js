import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav';

import '../style/topBar.css';

export default function TopBar () {
    return (
        <Navbar bg="dark" variant='dark' expand="lg">
            <Navbar.Brand href="/">S3photos</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Item>
                        <NavLink className="nav-link" to={'/'} exact>Home</NavLink>
                    </Nav.Item>

                    <Nav.Item>
                        <NavLink className="nav-link" to={'/upload/'} exact>Upload</NavLink>
                    </Nav.Item>                    
                </Nav>
                <Form inline>
                    <Form.Control type="text" placeholder="Search for posts, uploader and tags" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
};