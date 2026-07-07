import { TitleCaseStyle } from "./index";

const ARTICLES = ["a", "an", "the"];
const COORDINATING_CONJUNCTIONS = ["and", "but", "for", "nor", "or", "so", "yet"];
const SHORT_PREPOSITIONS = ["as", "at", "by", "for", "in", "of", "off", "on", "out", "per", "to", "up", "via"];
const LOWERCASE_WORDS = new Set([...ARTICLES, ...COORDINATING_CONJUNCTIONS, ...SHORT_PREPOSITIONS]);

function hasUppercaseAfterFirst(word: string): boolean {
	for (let i = 1; i < word.length; i++) {
		if (word[i] !== word[i].toLowerCase()) {
			return true;
		}
	}
	return false;
}

function capitalizeFirst(word: string): string {
	if (!word) return word;
	// Find the first alphabetic character and capitalize it
	for (let i = 0; i < word.length; i++) {
		if (/\p{L}/u.test(word[i])) {
			return word.substring(0, i) + word[i].toUpperCase() + word.substring(i + 1).toLowerCase();
		}
	}
	return word.toUpperCase();
}

function processWord(token: string, isEdge: boolean, exceptionsSet: Set<string>, preserveMixedCase: boolean): string {
	// Strip leading/trailing punctuation to find the core word for exception checking
	const match = token.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
	const prefix = match ? match[1] : "";
	let word = match ? match[2] : token;
	const suffix = match ? match[3] : "";

	if (!word) {
		return token; // Pure punctuation
	}

	if (exceptionsSet.has(word) || (preserveMixedCase && hasUppercaseAfterFirst(word))) {
		return token; // Untouched
	}

	if (word.includes("-")) {
		const parts = word.split("-");
		const processedParts = parts.map((part, index) => {
			const isPartEdge = isEdge || index === 0 || index === parts.length - 1;
			return processWord(part, isPartEdge, exceptionsSet, preserveMixedCase);
		});
		return prefix + processedParts.join("-") + suffix;
	}

	const lowerWord = word.toLowerCase();
	if (isEdge || !LOWERCASE_WORDS.has(lowerWord)) {
		return prefix + capitalizeFirst(word) + suffix;
	} else {
		return prefix + lowerWord + suffix;
	}
}

export const amaStyle: TitleCaseStyle = {
	id: "ama",
	label: "AMA",
	convert(input: string, exceptions: string[], preserveMixedCase: boolean): string {
		const exceptionsSet = new Set(exceptions);
		
		// Split on colons, keeping the colon with the preceding segment
		const segments = [];
		let currentSegment = "";
		for (let i = 0; i < input.length; i++) {
			currentSegment += input[i];
			if (input[i] === ":") {
				segments.push(currentSegment);
				currentSegment = "";
			}
		}
		if (currentSegment) {
			segments.push(currentSegment);
		}

		return segments.map(segment => {
			// Split by whitespace but keep the whitespace tokens
			const tokens = segment.split(/(\s+)/);
			
			// Find indices of non-whitespace tokens that have alphabetic chars
			const wordIndices = [];
			for (let i = 0; i < tokens.length; i++) {
				if (!/^\s*$/.test(tokens[i]) && /\p{L}/u.test(tokens[i])) {
					wordIndices.push(i);
				}
			}

			if (wordIndices.length === 0) {
				return segment;
			}

			const firstWordIdx = wordIndices[0];
			const lastWordIdx = wordIndices[wordIndices.length - 1];

			const processedTokens = tokens.map((token, i) => {
				if (/^\s*$/.test(token)) {
					return token;
				}
				const isEdge = (i === firstWordIdx || i === lastWordIdx);
				return processWord(token, isEdge, exceptionsSet, preserveMixedCase);
			});

			return processedTokens.join("");
		}).join("");
	}
};
