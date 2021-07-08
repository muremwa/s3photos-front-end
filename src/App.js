import { Switch, Route, BrowserRouter } from 'react-router-dom';

import './style/bootstrap.min.css';
import './style/App.css';

import TopBar from './pages/TopBar';
import Home from './pages/Home';
import Upload from './pages/Upload';

function App() {
  return (
	  <div>
		<BrowserRouter>
			<TopBar />
			<Switch>
				<Route path='/' exact component={Home} />
				<Route path='/upload/' exact component={Upload} />
			</Switch>
		</BrowserRouter>
	  </div>
  );
}

export default App;
