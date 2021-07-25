import { NavLink } from 'react-router-dom';


export default function Error404 (props) {
    console.log(props)
    return (
        <div id="main" class="text-center">
            <h1>404 error</h1>
            <h2>the page you requested does not exist</h2>
            <NavLink className="btn btn-dark" to='/'>Home</NavLink>
        </div>
    );
};