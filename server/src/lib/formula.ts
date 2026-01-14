export const GRADE_POINTS: Record<string, number> = {
  'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
  'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
};

export type SubjectGrade = { code: string; grade: string };
export type ClusterDefinition = { id: number; name: string; subjects: string[][] };

function normalizeCode(code: string) {
  return code.trim().toLowerCase();
}

export function gradeToPoints(grade?: string) {
  if (!grade) return 0;
  const g = grade.trim().toUpperCase();
  return GRADE_POINTS[g] || 0;
}

export function buildSelectedSeven(input: SubjectGrade[]): { selected: SubjectGrade[]; agp: number; meanGrade: string } {
  // Normalize and map
  const map: Record<string, SubjectGrade> = {};
  input.forEach(s => map[normalizeCode(s.code)] = { code: normalizeCode(s.code), grade: s.grade });

  // Require Math
  const mathKeys = ['mat', 'mata', 'matb'];
  const mathEntryKey = Object.keys(map).find(k => mathKeys.includes(k));
  if (!mathEntryKey) {
    return { selected: [], agp: 0, meanGrade: 'N/A' };
  }

  const math = map[mathEntryKey];
  // choose best of ENG/KIS
  const eng = map['eng'];
  const kis = map['kis'];
  const engPoints = gradeToPoints(eng?.grade);
  const kisPoints = gradeToPoints(kis?.grade);
  let lang: SubjectGrade | undefined;
  if (eng && kis) lang = engPoints >= kisPoints ? eng : kis;
  else lang = eng || kis;

  // Build remaining candidates excluding selected
  const excluded = new Set<string>([math.code, lang?.code || '']);
  const remaining = Object.values(map).filter(s => !excluded.has(s.code));
  // Sort remaining by points desc
  remaining.sort((a, b) => gradeToPoints(b.grade) - gradeToPoints(a.grade));
  const top5 = remaining.slice(0, 5);

  const selected = [math, ...(lang ? [lang] : []), ...top5].filter(Boolean) as SubjectGrade[];
  const agp = selected.reduce((sum, s) => sum + gradeToPoints(s.grade), 0);

  // Map AGP to a simple mean grade string (approx)
  let mean = 'N/A';
  if (agp >= 84) mean = 'A';
  else if (agp >= 72) mean = 'A-';
  else if (agp >= 60) mean = 'B+';
  else if (agp >= 48) mean = 'B';
  else if (agp >= 36) mean = 'C+';
  else if (agp >= 24) mean = 'C';
  else mean = 'D';

  return { selected, agp, meanGrade: mean };
}

export function calculateClusterPoints(selectedMap: Record<string, number>, cluster: ClusterDefinition) {
  // Check core single-item groups
  const missingCore: string[] = [];
  const chosenPoints: number[] = [];

  for (const group of cluster.subjects) {
    // find best subject in group
    let best = 0;
    let foundCode: string | null = null;
    for (const code of group) {
      const p = selectedMap[code.toLowerCase()] || 0;
      if (p > best) { best = p; foundCode = code; }
    }

    if (best === 0) {
      if (group.length === 1) {
        missingCore.push(group[0]);
      }
    }
    chosenPoints.push(best);
  }

  if (missingCore.length > 0) {
    return { points: 0.0, missingCore };
  }

  // sum of four chosen group points
  const r = chosenPoints.slice(0,4).reduce((s, v) => s + v, 0);
  const R = 48;
  return { r, points: 0 }; // caller will compute with AGP
}

export function computeAllClusters(input: SubjectGrade[], clusters: ClusterDefinition[]) {
  const { selected, agp, meanGrade } = buildSelectedSeven(input);
  const selectedMap: Record<string, number> = {};
  selected.forEach(s => selectedMap[s.code.toLowerCase()] = gradeToPoints(s.grade));

  const results = clusters.map(cl => {
    const clusterRes = calculateClusterPoints(selectedMap, cl as ClusterDefinition);
    if (clusterRes.missingCore && clusterRes.missingCore.length > 0) {
      return { id: cl.id, name: cl.name, points: 0.000, missingCore: clusterRes.missingCore };
    }
    const r = (clusterRes as any).r || 0;
    const ratio = (r / 48) * (agp / 84);
    const pts = Math.sqrt(Math.max(0, ratio)) * 48;
    return { id: cl.id, name: cl.name, points: Math.round(pts * 1000) / 1000, missingCore: [] };
  });

  return { selected, agp, meanGrade, clusters: results };
}
