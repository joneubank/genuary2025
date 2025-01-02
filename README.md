# Genuary 2025

Collection of sketches made following the prompts for [Genuary 2025](https://genuary.art/).

## Tech

Runs on Node using Vite. Tested on Node version 22. Dependencies managed with `pnpm`.

All sketches are drawn in the browser on HTML canvas using TypeScript. This is done using the [Make Code Not Art](https://github.com/code-not-art/sketch) drawing library and developer setup.

## Quick Start

Install dependencies with `pnpm i`

Start local server with `pnpm start`

The landing page of the site provides a table of contents of the available sketches. Each will link to a page where you can interact with that day's algorithm and generate new images. See the [Sketch library documentation](https://github.com/code-not-art/sketch?tab=readme-ov-file#sketch-web-interface-controls) for the keyboard controls that you can use to interact with this page. Keyboard controls of note are:

| Key                   | Action                                                                        |
| --------------------- | ----------------------------------------------------------------------------- |
| `space`               | Regenerate sketch with new image and palette seeds.                           |
| `s`                   | Save image to file.                                                           |
| `p`                   | Regenerate sketch with new palette seed, image random seed remains unchanged. |
| `i`                   | Regenerate sketch with new image seed, palette random seed remains unchanged. |
| Left and Right arrows | Preview/Next image seeds.                                                     |
| Up and Down arrows    | Preview/Next palette seeds.                                                   |
