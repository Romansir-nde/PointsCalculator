import { buildSelectedSeven, calculateClusterPoints, gradeToPoints, GRADE_POINTS, SubjectGrade } from '../lib/formula';

describe('formula.ts', () => {
  test('buildSelectedSeven selects 7 subjects correctly', () => {
    const input = [
      { code: 'eng', grade: 'C+' },
      { code: 'kis', grade: 'B' },
      { code: 'mat', grade: 'A' },
      { code: 'bio', grade: 'B' },
      { code: 'phy', grade: 'C' },
      { code: 'che', grade: 'C-' },
      { code: 'bst', grade: 'B-' },
    ];
    const result = buildSelectedSeven(input);
    expect(result.selected.length).toBeLessThanOrEqual(7);
    expect(result.agp).toBeGreaterThan(0);
    expect(result.meanGrade).not.toBe('N/A');
  });

  test('gradeToPoints converts grades correctly', () => {
    expect(gradeToPoints('A')).toBe(12);
    expect(gradeToPoints('B')).toBe(9);
    expect(gradeToPoints('C+')).toBe(7);
    expect(gradeToPoints('E')).toBe(1);
    expect(gradeToPoints('')).toBe(0);
  });

  test('Missing Math returns empty selected', () => {
    const input = [
      { code: 'eng', grade: 'C+' },
      { code: 'kis', grade: 'B' },
      { code: 'bio', grade: 'B' },
    ];
    const result = buildSelectedSeven(input);
    expect(result.selected.length).toBe(0);
    expect(result.agp).toBe(0);
  });

  test('Best of ENG/KIS is selected', () => {
    const input = [
      { code: 'mat', grade: 'A' },
      { code: 'eng', grade: 'B' },
      { code: 'kis', grade: 'A-' },
      { code: 'bio', grade: 'B' },
      { code: 'phy', grade: 'C' },
      { code: 'che', grade: 'C-' },
      { code: 'bst', grade: 'B-' },
    ];
    const result = buildSelectedSeven(input);
    const selected = result.selected.map(s => s.code);
    expect(selected).toContain('kis');
    expect(selected.length).toBeGreaterThanOrEqual(7);
  });

  test('AGP calculation is correct', () => {
    const input = [
      { code: 'mat', grade: 'A' },
      { code: 'eng', grade: 'A' },
      { code: 'bio', grade: 'A' },
      { code: 'phy', grade: 'A' },
      { code: 'che', grade: 'A' },
      { code: 'his', grade: 'A' },
      { code: 'geo', grade: 'A' },
    ];
    const result = buildSelectedSeven(input);
    expect(result.agp).toBe(84); // 7 A's = 7 * 12
  });
});
