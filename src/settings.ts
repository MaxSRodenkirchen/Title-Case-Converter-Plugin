import { App, PluginSettingTab, Setting, TextAreaComponent } from 'obsidian';
import TitleCaseConverterPlugin from '../main';

export interface TitleCaseConverterSettings {
	exceptionsList: string;
	preserveMixedCase: boolean;
}

export const DEFAULT_SETTINGS: TitleCaseConverterSettings = {
	exceptionsList: 'NASA\niPhone\nmacOS\nGitHub',
	preserveMixedCase: true
}

export class TitleCaseConverterSettingTab extends PluginSettingTab {
	plugin: TitleCaseConverterPlugin;

	constructor(app: App, plugin: TitleCaseConverterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Exception list')
			.setDesc('A list of words whose casing should always be preserved exactly as typed (one word/phrase per line).')
			.addTextArea((text: TextAreaComponent) => text
				.setPlaceholder('NASA\niPhone')
				.setValue(this.plugin.settings.exceptionsList)
				.onChange(async (value: string) => {
					this.plugin.settings.exceptionsList = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Auto-preserve mixed-case words')
			.setDesc('If a word already contains an uppercase letter after its first character (e.g. NASA, iPhone), leave it untouched.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preserveMixedCase)
				.onChange(async (value: boolean) => {
					this.plugin.settings.preserveMixedCase = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
