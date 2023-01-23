import { useEffect, useState } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav';

import { searchQ } from './utils';

import '../style/topBar.css';

export default function TopBar (props) {
    const history = useHistory();
    const location = useLocation();
    const [ q, qChanger ] = useState('');
    const navId = 'top-nav';

    const handleSearch = (event_) => {
        event_.preventDefault();
        const term = event_.target.children.search.value;
        history.push(`/?post-query=${term}`);
    };

    useEffect(() => {
        const pq = searchQ(location.search);
        if (pq.has('post-query')) {
            qChanger(pq.get('post-query'))
        };
        const nav = document.getElementById(navId);
        nav? nav.scrollIntoView(): void 0;
    }, [location])

    return (
        <Navbar bg="dark" variant='dark' expand="lg" id={navId}>
            <Navbar.Brand className='s3' href="/">S3photos</Navbar.Brand>
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
                <Form inline onSubmit={handleSearch}>
                    <Form.Control name="search" type="text" defaultValue={q} placeholder="Search for posts, uploader and tags" className="mr-sm-2" required/>
                    <Button type="submit" variant="outline-success">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
};