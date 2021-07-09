import { Switch, Route, BrowserRouter } from 'react-router-dom';

import './style/bootstrap.min.css';
import './style/App.css';

import TopBar from './pages/TopBar';
import Home from './pages/Home';
import Upload from './pages/Upload';

function App() {
	const loadLine = (pc = 0, kill = false) => {
		const line = document.getElementById("line-load");
		if (kill) {
			line? line.style.width = '0%': void 0;
		} else {
			if (pc < 101 && pc > -1) {
				line? line.style.width = `${pc}%`: void 0;
			}
		};
	};

	return (
		<div>
			<BrowserRouter>
				<TopBar />
				<div id="load-line">
					<div id="line-load"></div>
				</div>
				<Switch>
					<Route path='/' exact render={(props) => <Home {...props} line={loadLine} />} />
					<Route path='/upload/' exact render={(props) => <Upload {...props} line={loadLine} />} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
