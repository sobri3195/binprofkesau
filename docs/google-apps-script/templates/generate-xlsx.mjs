import XLSX from 'xlsx';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputCsv = resolve(__dirname, 'binprofkes_db_template.csv');
const outputXlsx = resolve(__dirname, 'binprofkes_db_template.xlsx');

const csv = readFileSync(inputCsv, 'utf8');
const workbook = XLSX.read(csv, { type: 'string' });
const firstSheetName = workbook.SheetNames[0];
workbook.SheetNames[0] = 'binprofkes_db';
workbook.Sheets.binprofkes_db = workbook.Sheets[firstSheetName];
if (firstSheetName !== 'binprofkes_db') {
  delete workbook.Sheets[firstSheetName];
}

XLSX.writeFile(workbook, outputXlsx);

console.log(`Generated: ${outputXlsx}`);
