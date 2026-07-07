import { describe, it, expect } from 'vitest';
import { amaStyle } from '../src/styles/ama';

describe('AMA Title Case Style', () => {
    const convert = (input: string, exceptions: string[] = [], preserveMixedCase: boolean = true) => {
        return amaStyle.convert(input, exceptions, preserveMixedCase);
    };

    it('capitalizes properly according to standard AMA rules', () => {
        expect(convert('how to be idle')).toBe('How to Be Idle');
        expect(convert('a tale of two cities')).toBe('A Tale of Two Cities');
    });

    it('preserves mixed case words if heuristic is enabled', () => {
        expect(convert('well-known facts about nasa')).toBe('Well-Known Facts About Nasa');
        expect(convert('well-known facts about NASA')).toBe('Well-Known Facts About NASA');
        expect(convert('working with iPhone apps')).toBe('Working With iPhone Apps');
        
        // Mixed case heuristic OFF -> it should lowercase 'iPhone' and capitalize 'Iphone'
        expect(convert('working with iPhone apps', [], false)).toBe('Working With Iphone Apps');
    });

    it('uses exception list to preserve words exactly', () => {
        // "nasa" is lowercase, usually it would become "Nasa"
        expect(convert('well-known facts about nasa')).toBe('Well-Known Facts About Nasa'); 
        expect(convert('well-known facts about nasa', ['nasa'])).toBe('Well-Known Facts About nasa');
        // Let's test a word that WOULD be capitalized normally
        expect(convert('the strange case of dr. jekyll and mr. hyde', ['mr'])).toBe('The Strange Case of Dr. Jekyll and mr. Hyde');
    });

    it('handles titles with colons as two separate segments', () => {
        expect(convert('the lord of the rings: the fellowship of the ring')).toBe('The Lord of the Rings: The Fellowship of the Ring');
        expect(convert('up and out: a memoir')).toBe('Up and Out: A Memoir');
    });

    it('handles hyphenated compounds correctly', () => {
        expect(convert('check-in procedures')).toBe('Check-In Procedures');
        expect(convert('x-ray imaging')).toBe('X-Ray Imaging');
        // Both parts capitalized because they are major words or at edges
        expect(convert('well-known')).toBe('Well-Known');
        // What about a preposition inside a hyphen? 'in-and-out'
        expect(convert('an in-and-out process')).toBe('An In-and-Out Process'); 
    });

    it('handles edge cases', () => {
        expect(convert('')).toBe('');
        expect(convert('a')).toBe('A');
        expect(convert('  a  ')).toBe('  A  ');
        expect(convert('the.')).toBe('The.');
        expect(convert('of')).toBe('Of');
        expect(convert('(idle)')).toBe('(Idle)');
        expect(convert('"idle"')).toBe('"Idle"');
    });
});
