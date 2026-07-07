import { amaStyle } from "./ama";

export interface TitleCaseStyle {
  id: string;          // "ama", "apa", ...
  label: string;       // "AMA", "APA", ... (used in command name & settings)
  convert(input: string, exceptions: string[], preserveMixedCase: boolean): string;
}

export const styles: TitleCaseStyle[] = [
  amaStyle,
];
