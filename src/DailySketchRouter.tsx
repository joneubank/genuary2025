import { BrowserRouter, Routes, Route, useParams, NavLink } from 'react-router';
import Helmet from 'react-helmet';
import sketchDay1 from './sketches/01';
import sketchDay2 from './sketches/02';
import { App, SketchDefinition } from '@code-not-art/sketch';

function getSketchForDay(
	day: string | undefined,
): SketchDefinition<any, any> | { error: 'NOT_FOUND' | 'INVALID_DAY'; message: string } {
	if (day === undefined) {
		return { error: 'INVALID_DAY', message: 'No value was provided for the day.' };
	}
	switch (day) {
		case '1': {
			return sketchDay1;
		}
		case '2': {
			return sketchDay2;
		}
		default:
			return { error: 'NOT_FOUND', message: `No sketch is available for day "${day}".` };
	}
}

function DailySketchRouter(props: {}) {
	const { day } = useParams();

	const sketch = getSketchForDay(day);
	if ('error' in sketch) {
		console.log(sketch);
		return (
			<>
				<h1>Navigation Error</h1>
				<p>{sketch.message}</p>
				<NavLink to="/">Return Home</NavLink>
			</>
		);
	}
	return (
		<>
			<App sketch={sketch} />
			<Helmet>
				<title>Genuary 2025 - Day {day}</title>
			</Helmet>
		</>
	);
}

export default DailySketchRouter;
