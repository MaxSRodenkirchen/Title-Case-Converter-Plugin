import { Editor, Notice, Plugin } from 'obsidian';
import { TitleCaseConverterSettings, DEFAULT_SETTINGS, TitleCaseConverterSettingTab } from './src/settings';
import { styles } from './src/styles';

export default class TitleCaseConverterPlugin extends Plugin {
	settings: TitleCaseConverterSettings;

	async onload() {
		await this.loadSettings();

		// Add a command for each registered title case style
		for (const style of styles) {
			this.addCommand({
				id: `convert-title-case-${style.id}`,
				name: `Convert selection to Title Case (${style.label})`,
				editorCallback: (editor: Editor) => {
					const selection = editor.getSelection();
					
					if (!selection) {
						new Notice("Title Case Converter: please select some text first.");
						return;
					}

					const exceptions = this.settings.exceptionsList
						.split('\n')
						.map(line => line.trim())
						.filter(line => line.length > 0);

					const converted = style.convert(selection, exceptions, this.settings.preserveMixedCase);
					editor.replaceSelection(converted);
				}
			});
		}

		this.addSettingTab(new TitleCaseConverterSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<TitleCaseConverterSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
