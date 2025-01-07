import { NavLink } from 'react-router';
import Helmet from 'react-helmet';
import sketchDay1 from './sketches/01';

function Homepage() {
	return (
		<>
			<Helmet>
				<title>Genuary 2025</title>
			</Helmet>
			<h1>Genuary 2025</h1>
			<ul>
				<li>
					<NavLink to="day/1">Day 01 - Horizontal or Vertical Lines Only</NavLink>
				</li>
				<li>
					<NavLink to="day/2">Day 02 - Layers upon Layers upon Layers</NavLink>
				</li>
			</ul>
		</>
	);
}

export default Homepage;
