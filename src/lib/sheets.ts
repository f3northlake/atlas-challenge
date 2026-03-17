import 'server-only';
import { google } from 'googleapis';
import type { SheetsRow, LeaderboardEntry, AOEntry } from '@/types/challenge';

const SUBMISSIONS_RANGE = 'Submissions!A:K';
const SUBMISSIONS_RANGE_DATA = 'Submissions!A2:K'; // skip header row

function getAuthClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var is not set');

  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error('GOOGLE_SHEET_ID env var is not set');
  return id;
}

/** Append one submission row to the Submissions tab. */
export async function appendSubmissionRow(row: SheetsRow): Promise<void> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const values = [
    row.timestamp,
    row.date,
    row.paxName,
    row.homeAO,
    row.totalPoints,
    row.corePoints,
    row.chestPoints,
    row.backPoints,
    row.bicepsPoints,
    row.tricepsPoints,
    row.rawSetsJson,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range: SUBMISSIONS_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
}

/** Read all submissions and aggregate into leaderboard data. */
export async function getLeaderboardData(): Promise<{
  individuals: LeaderboardEntry[];
  aos: AOEntry[];
}> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: SUBMISSIONS_RANGE_DATA,
  });

  const rows = response.data.values ?? [];

  // Columns: 0=timestamp, 1=date, 2=paxName, 3=homeAO, 4=totalPoints,
  //          5=corePoints, 6=chestPoints, 7=backPoints, 8=bicepsPoints, 9=tricepsPoints
  const paxMap = new Map<string, LeaderboardEntry>();
  const aoMap = new Map<string, { totalPoints: number; paxSet: Set<string> }>();

  for (const row of rows) {
    if (!row[2] || !row[3]) continue; // skip rows without PAX name or AO

    const paxName = String(row[2]).trim();
    const homeAO = String(row[3]).trim();
    const totalPoints = Number(row[4]) || 0;
    const corePoints = Number(row[5]) || 0;
    const chestPoints = Number(row[6]) || 0;
    const backPoints = Number(row[7]) || 0;
    const bicepsPoints = Number(row[8]) || 0;
    const tricepsPoints = Number(row[9]) || 0;

    // Aggregate by PAX
    const existing = paxMap.get(paxName);
    if (existing) {
      existing.totalPoints += totalPoints;
      existing.corePoints += corePoints;
      existing.chestPoints += chestPoints;
      existing.backPoints += backPoints;
      existing.bicepsPoints += bicepsPoints;
      existing.tricepsPoints += tricepsPoints;
      existing.submissionCount += 1;
    } else {
      paxMap.set(paxName, {
        paxName,
        homeAO,
        totalPoints,
        corePoints,
        chestPoints,
        backPoints,
        bicepsPoints,
        tricepsPoints,
        submissionCount: 1,
      });
    }

    // Aggregate by AO
    const aoEntry = aoMap.get(homeAO) ?? { totalPoints: 0, paxSet: new Set() };
    aoEntry.totalPoints += totalPoints;
    aoEntry.paxSet.add(paxName);
    aoMap.set(homeAO, aoEntry);
  }

  const individuals = [...paxMap.values()].sort((a, b) => b.totalPoints - a.totalPoints);

  const aos: AOEntry[] = [...aoMap.entries()]
    .map(([ao, data]) => ({ ao, totalPoints: data.totalPoints, paxCount: data.paxSet.size }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return { individuals, aos };
}
