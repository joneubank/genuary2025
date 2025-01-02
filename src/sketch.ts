import {
	ControlPanel,
	Parameters,
	Sketch,
	SketchConfig,
	SketchDraw,
	SketchInit,
	SketchLoop,
	SketchReset,
	type ControlPanelElements,
} from '@code-not-art/sketch';

const config = SketchConfig({});

const controls = {
	exampleControls: ControlPanel('Example Custom Controls', {
		exampleBoolean: Parameters.boolean({ label: 'Example Bool' }),
		exampleNumber: Parameters.number({ label: 'Example Number' }),
		exampleRange: Parameters.range({
			label: 'Example Range',
			initialValue: [0.25, 0.75],
		}),
		exampleSelect: Parameters.multiSelect({
			label: 'Example Select',
			options: ['A', 'B', 'C'],
		}),
		exampleString: Parameters.string({ label: 'Example String' }),
	}),
} satisfies ControlPanelElements;

type CustomParams = typeof controls;
type CustomData = {};

/**
 * Init is run once on startup to initialize the values of the sketch data.
 * Since init is only run once, when the sketch is first loaded, this can be
 * used to run any calculations that are slow and you don't want to repeat on
 * redraw.
 *
 * The content of the data object returned by this function will persist across
 * every draw and every step of the loop. You are free to modify and update this
 * data in the draw and loop steps, just be aware that it will never be reset
 * by the Sketch lifecycle.
 *
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter
 * values, and persistent data.
 */
const init: SketchInit<CustomParams, CustomData> = (props) => {
	console.log('Initializing Sketch...');
	const initialData: CustomData = {};
	return initialData;
};

/**
 * Reset does not run the first time the sketch is drawn, instead it is run
 * between redraws of the sketch. This can be used to reset the data in the
 * sketch props that is passed to the draw and loop methods. The current data
 * state is provided, so if you want to persist any data from one drawing to
 * the next redraw you can configure that here.
 *
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter
 * values, and persistent data.
 */
const reset: SketchReset<CustomParams, CustomData> = (props, data) => {
	console.log('Resetting Sketch...');
	const resetData: CustomData = {};
	return resetData;
};

/**
 * Runs once for the sketch, after data initialization/reset and before the
 * animation loop begins.
 *
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter
 * values, and persistent data.
 */
const draw: SketchDraw<CustomParams, CustomData> = ({ canvas, palette, params, rng }, data) => {
	console.log('Drawing Sketch...');

	// Random canvas background color
	canvas.fill(palette.colors[0]);

	const {
		exampleControls: { exampleBoolean, exampleNumber, exampleRange, exampleSelect, exampleString },
	} = params;

	// Your sketch instructions here:
	// ...
};

/**
 * Repeats on every available animation frame. Attemtps to render on every 1/60th of a second but may be longer.
 * The frame data will provide specific timing data if frame windows are missed.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 * @param frameData Frame count, and time since last frame was drawn.
 * @returns return value indicates if the loop is complete: return true when finished. This will be called repeatedly so long as it returns false.
 */
const loop: SketchLoop<CustomParams, CustomData> = ({}, _data, { frame }) => {
	console.log(`Sketch animation loop, frame ${frame} ...`);

	// Your sketch animation instructions here:
	// ...

	// return true when loop is complete, return false to continue running loop every animation frame
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
