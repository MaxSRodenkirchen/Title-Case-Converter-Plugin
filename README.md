# Obsidian Title Case Converter

> **Note:** This plugin was programmed with the assistance of **Gemini 3.1 Pro (High)**.

This plugin allows you to convert the selected text in your editor into proper title case according to specific citation styles. Currently, it supports the **AMA (American Medical Association)** style out of the box, with an architecture designed to make adding more styles trivial.

## Features

- Converts selected text to AMA Title Case style.
- Handles edge cases such as colons (title/subtitle splits) and hyphenated compounds.
- Provides an **Exception List** via settings to specify words (e.g. `NASA`, `brandNames`) that should always retain their exact typed capitalization.
- Built-in heuristic to **auto-preserve mixed-case words** (e.g., `iPhone`, `macOS`, `GitHub`), which can be disabled in the settings.

## Usage

1. Select text in your Obsidian editor.
2. Open the Command Palette (`Ctrl+P` / `Cmd+P`).
3. Search for and execute: `Convert selection to Title Case (AMA)`.
4. Your text will be instantly converted!

## Installation

You can install this plugin directly from within Obsidian:
1. Open Obsidian **Settings**.
2. Go to **Community Plugins** and disable "Safe Mode" if it is active.
3. Click **Browse** and search for "Title Case Converter".
4. Click **Install**, and once finished, click **Enable**.

**Manual Installation (for beta versions):**
1. Download the latest release (`main.js` and `manifest.json`) from the [Releases page](https://github.com/MaxSRodenkirchen/Title-Case-Converter-Plugin/releases).
2. Create a folder named `title-case-converter` in your vault's `.obsidian/plugins/` directory.
3. Move the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in Settings -> Community Plugins.

## Installation for Development

1. Clone this repository into your vault's plugin directory: `<vault>/.obsidian/plugins/` (or simply create a vault in this directory itself).
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start compilation in watch mode. This will automatically rebuild the plugin and copy files to `.obsidian/plugins/title-case-converter` whenever you make changes.
4. Run `npm test` to run the unit test suite via Vitest.

## Contributing (Adding New Styles)

To add a new citation style (e.g., APA, Chicago):
1. Create a new file in `src/styles/` (e.g. `apa.ts`).
2. Implement the `TitleCaseStyle` interface.
3. Add your style object to the array in `src/styles/index.ts`.
4. The main plugin file will automatically register a new command for your style!
