import { Brush, Circle, Color, Constants, Path, Utils, Vec2 } from '@code-not-art/core';
import {
	ControlPanel,
	MultiSelectUtils,
	PaletteType,
	Parameters,
	Sketch,
	SketchConfig,
	SketchDraw,
	SketchInit,
	SketchLoop,
	SketchReset,
	type ControlPanelElements,
} from '@code-not-art/sketch';

const { TAU } = Constants;
const { array, repeat, range, clamp, ratioArray } = Utils;

const config = SketchConfig({
	menuDelay: 0,
	paletteType: PaletteType.Curated,
	// width: 4000,
	// height: 4000,
});

const controls = {
	layers: ControlPanel('Layers', {
		count: Parameters.range({ label: 'Layer Count', step: 1, min: 1, max: 100, initialStart: 10, initialEnd: 20 }),
		circles: Parameters.range({ label: 'Circle Count', step: 1, min: 1, max: 100, initialStart: 10, initialEnd: 20 }),
		patterns: Parameters.multiSelect({
			label: 'Patterns',
			options: ['line', 'diamond', 'circle'],
			initialValue: { circle: true, diamond: false, line: false },
		}),
		padding: Parameters.number({ label: 'Padding', initialValue: 0.15 }),
		direction: Parameters.boolean({ label: 'Direction' }),
		pageScale: Parameters.number({ label: 'Page Scale', initialValue: 0.5, min: 0.1 }),
	}),
	circles: ControlPanel('Circles', {
		colors: Parameters.number({ label: 'Color Count', max: 4, min: 1, step: 1 }),
		layers: Parameters.range({ label: 'Layer Count', max: 20, min: 1, step: 1, initialEnd: 7, initialStart: 3 }),
	}),
	shadows: ControlPanel('Shadows', {
		length: Parameters.number({ label: 'Length', initialValue: 0.01, step: 0.0001, max: 0.03 }),
		opacity: Parameters.number({ label: 'Opacity', initialValue: 0.2, step: 0.01, max: 0.5 }),
	}),
} satisfies ControlPanelElements;

type CustomParams = typeof controls;
type CustomData = {};

const init: SketchInit<CustomParams, CustomData> = (props) => {
	const initialData: CustomData = {};
	return initialData;
};

const reset: SketchReset<CustomParams, CustomData> = (props, data) => {
	const resetData: CustomData = {};
	return resetData;
};

type DrawCommand = {
	drawShadow: () => void;
	drawShape: () => void;
};

function drawCommands(commands: DrawCommand[]) {
	commands.forEach((command) => command.drawShadow());
	commands.forEach((command) => command.drawShape());
	// commands.forEach((command) => {
	// 	command.drawShadow();
	// 	command.drawShape();
	// });
}

const draw: SketchDraw<CustomParams, CustomData> = ({ canvas, palette, params, rng }, data) => {
	const { layers, shadows } = params;
	const sortedPalette = [...palette.colors].sort((a, b) => (a.get.hsv().v > b.get.hsv().v ? 1 : -1));
	const background = sortedPalette.shift() as Color;
	const remainingColors = sortedPalette.slice(-params.circles.colors);

	canvas.fill(background);

	const minDim = canvas.get.minDim();

	let nextColorIndex = 0;
	function getNextColor() {
		const color = remainingColors[nextColorIndex];
		nextColorIndex = (nextColorIndex + 1) % remainingColors.length;
		return color.color().darken(rng.float(0, 10)).lighten(rng.float(0, 10));
	}

	const r = palette.rng.int(0, 255);
	const g = palette.rng.int(0, 255);
	const b = palette.rng.int(0, 255);
	// const r = palette.colors[0].get.rgb().r;
	// const g = palette.colors[0].get.rgb().g;
	// const b = palette.colors[0].get.rgb().b;
	const shadowColor = new Color(`rgba(${r}, ${g}, ${b}, ${shadows.opacity})`);
	const shadowBrush =
		(invertNormal: boolean, offsetVector: Vec2): Brush =>
		(props) => {
			const { draw, path: originalPath } = props;
			const path = originalPath.transform.map(100, (point) => point);
			const density = 1000000;
			const shadowMaxDistance = minDim * shadows.length;
			const shadowMaxRadius = minDim / 170;
			const shadowMinRadius = minDim / 1000;

			// canvas.draw.path(path, { fill: shadowColor });
			canvas.draw.path(path.transform.translate(offsetVector.scale(shadowMaxDistance)), {
				fill: shadowColor,
			});
			canvas.draw.path(path.transform.translate(offsetVector.scale(shadowMaxDistance * 0.75)), {
				fill: shadowColor,
			});
			canvas.draw.path(path.transform.translate(offsetVector.scale(shadowMaxDistance * 0.5)), {
				fill: shadowColor,
			});

			// const shadowColor = new Color(palette.colors[1]).set.alpha(0.1);

			// rng.push('shadow');
			// const shadowDotCount = Math.ceil((path.get.length() / minDim / minDim) * density);
			// repeat(shadowDotCount, () => {
			// 	const ratio = rng.next();
			// 	const point = path.get.point(ratio);
			// 	const normal = path.get.normal(ratio).scale(invertNormal ? -1 : 1);
			// 	const distance = rng.float(0, 1);
			// 	const radius = shadowMaxRadius - distance * (shadowMaxRadius - shadowMinRadius);
			// 	// const center = point.add(normal.scale(radius)).add(offsetVector.scale(distance * shadowMaxDistance));
			// 	const center = point.add(normal.scale(-distance * shadowMaxDistance));
			// 	canvas.draw.circle({ center, radius }, { fill: shadowColor });
			// });
			// rng.pop();
		};

	const shadowOffset = Vec2.unit().rotate(rng.float(0, TAU));

	function drawCircleShadow(position: Vec2, radius: number) {
		const circle: Circle = { center: position, radius };
		const path = Path.fromCircle(circle);
		canvas.draw.path(path, { brush: shadowBrush(false, shadowOffset) });
	}
	function drawCircleShape(position: Vec2, radius: number) {
		const circle: Circle = { center: position, radius };
		const path = Path.fromCircle(circle);

		// draw shape
		canvas.draw.circle(circle, { fill: getNextColor() });

		rng.push('draw circle');
		const circleLayers = Math.max(0, rng.int(params.circles.layers[0], params.circles.layers[1]) - 1);
		// const circleLayers = 2;
		const chordRotation = rng.next();
		repeat(circleLayers, (layer) => {
			const layerMod = (layer * 0.3) / circleLayers;
			const chordStart = path.get.point((rng.float(0.6 - layerMod, 0.75 - layerMod) + chordRotation) % 1);
			// const chordStart = path.get.point(0.75);

			const cutCirclePath = new Path(chordStart)
				.arc(-TAU * rng.float(0.6 - layerMod, 0.8 - layerMod), position)
				.line(chordStart);
			canvas.draw.path(cutCirclePath, { fill: getNextColor() });
		});
		rng.pop();
	}
	function getCircleCommand(position: Vec2, radius: number): DrawCommand {
		return { drawShadow: () => drawCircleShadow(position, radius), drawShape: () => drawCircleShape(position, radius) };
	}

	function getPath(ratio: number): Path {
		const centeredMin = (1 - ratio) / 2;
		const centeredMax = ratio + centeredMin;

		switch (rng.chooseOne(MultiSelectUtils.selected(layers.patterns))) {
			case 'line': {
				return new Path(canvas.get.position(centeredMin, 0.5)).line(canvas.get.position(centeredMax, 0.5));
			}
			case 'diamond': {
				return new Path(canvas.get.position(centeredMin, 0.5))
					.line(canvas.get.position(0.5, 0.5 - ratio))
					.line(canvas.get.position(centeredMax, 0.5))
					.line(canvas.get.position(0.5, 0.5 + ratio))
					.line(canvas.get.position(centeredMin, 0.5));
			}
			case 'circle': {
				return Path.fromCircle({ center: canvas.get.center(), radius: (ratio * minDim) / 2 });
			}
		}
	}

	function getLayoutDrawCommands(ratio: number, circleCount: number) {
		const path = getPath(ratio);

		const padding = 1 - layers.padding;

		const length = path.get.length();
		const circleRadius = (length / circleCount / 2) * padding;
		const ratioOffset = 1 / circleCount / 2;
		return array(circleCount).map((index) => {
			// const rotatedRatio = (ratio + layoutRotation) % 1;
			const center = path.get.point(index / circleCount + ratioOffset);
			return getCircleCommand(center, circleRadius);
		});
	}
	// drawCommands(getLayoutDrawCommands(1, rng.int(3, 7)));
	// drawCommands(getLayoutDrawCommands(0.8, rng.int(3, 7)));
	// drawCommands(getLayoutDrawCommands(0.6, rng.int(3, 7)));
	// drawCommands(getLayoutDrawCommands(0.4, rng.int(3, 7)));
	const count = 30;
	// drawCommands(getLayoutDrawCommands(1, count));
	// drawCommands(getLayoutDrawCommands(0.9, count));
	// drawCommands(getLayoutDrawCommands(0.8, count));
	// drawCommands(getLayoutDrawCommands(0.7, count));
	// drawCommands(getLayoutDrawCommands(0.6, count));
	// drawCommands(getLayoutDrawCommands(0.5, count));
	// drawCommands(getLayoutDrawCommands(0.4, count));
	// drawCommands(getLayoutDrawCommands(0.3, count));
	// drawCommands(getLayoutDrawCommands(0.2, count));
	const layerCount = rng.int(layers.count[0], layers.count[1]);
	repeat(layerCount, (index) => {
		const ratio = layers.direction ? (layerCount - index) / layerCount : (index + 1) / layerCount;
		drawCommands(getLayoutDrawCommands(ratio * 2 * layers.pageScale, rng.int(layers.circles[0], layers.circles[1])));
	});
};

const loop: SketchLoop<CustomParams, CustomData> = ({}, _data, { frame }) => {
	return true;
};

export default Sketch<CustomParams, CustomData>({
	config,
	controls,
	init,
	draw,
	loop,
	reset,
});
