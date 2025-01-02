import { Path, Constants, Utils, Noise, Vec2, Color, Gradient } from '@code-not-art/core';
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
	width: 1000,
	height: 1800,
});

const controls = {
	rings: ControlPanel('Layout', {
		size: Parameters.range({ label: 'Ring Size', max: 2, initialEnd: 0.85 }),
		ringCount: Parameters.number({ label: 'Ring Count', initialValue: 25, min: 0, max: 50, step: 1 }),
	}),
	lines: ControlPanel('Lines', {
		thickness: Parameters.number({ label: 'Line Thickness', initialValue: 0.1 }),
		height: Parameters.number({ label: 'Line Height', initialValue: 0.75 }),
		density: Parameters.number({ label: 'Line Density', initialValue: 0.75 }),
		fixedDirection: Parameters.boolean({ label: 'Fixed Direction', initialValue: false }),
	}),
	noise: ControlPanel('Noise Config', {
		amplitude: Parameters.number({ label: 'Amplitude', initialValue: 1 }),
		frequency: Parameters.number({ label: 'Frequency', initialValue: 0.2 }),
		octaves: Parameters.multiSelect({
			label: 'Octaves',
			options: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
			initialValue: {
				'0': false,
				'1': true,
				'2': true,
				'3': true,
				'4': true,
				'5': true,
				'6': true,
				'7': true,
				'8': false,
			},
		}),
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

const draw: SketchDraw<CustomParams, CustomData> = ({ canvas, palette, params, rng }, data) => {
	const { rings, lines, noise: noiseParams } = params;

	canvas.fill(palette.colors[0]);

	const minDim = canvas.get.minDim();

	const baseWidth = minDim * 0.025 * lines.thickness;

	const drawCircle = (scale: number, color: Color): Array<[number, () => void]> => {
		const offset = rng.next();
		const heightNoise = Noise.simplex2(rng.int(1, 100000), {
			amplitude: noiseParams.amplitude,
			frequency: noiseParams.frequency * 10,
			octaves: MultiSelectUtils.selected(noiseParams.octaves).map(Number),
		});

		const basePath = Path.fromCircle({
			center: canvas.get.center(),
			radius: (minDim / 2) * (rings.size[1] - rings.size[0]) * scale + (minDim / 2) * rings.size[0],
		});
		const getLineHeight = (position: number, max: number): number => {
			const height = max * heightNoise(0, position);
			return lines.fixedDirection ? Math.abs(height) : height;
		};

		const commands = ratioArray(scale * lines.density * 1000).map<[number, () => void]>((ratio) => {
			const offsetRation = (ratio + offset) % 1;
			const start = basePath.get.point(offsetRation);
			const lineHeight = getLineHeight(
				offsetRation,
				scale * lines.height * minDim * 2 * Math.sin(((offsetRation / 0.5) * TAU) / 2),
			);
			const end = Vec2.unit()
				.scale(lineHeight)
				.rotate(-TAU / 4)
				.add(start);
			return [
				start.y,
				() =>
					canvas.draw.line(
						{ start, end },
						{ stroke: { width: baseWidth, color: color.color().darken(rng.float(0, 2)).lighten(rng.float(0, 2)) } },
					),
			];
		});
		return commands;
	};

	const gradient = new Gradient(...palette.colors.slice(1));

	const commands = rng
		.shuffle(
			array(rings.ringCount).flatMap((ringIndex) =>
				drawCircle((ringIndex + 1) / rings.ringCount, gradient.at((ringIndex + 1) / rings.ringCount)),
			),
		)
		.sort((a, b) => (a[0] > b[0] ? 1 : -1));
	commands.forEach((command) => command[1]());
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
