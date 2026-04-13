const SHEET_NAME = 'binprofkes_db';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'getAll';

  if (action === 'getAll') {
    return jsonResponse({
      success: true,
      data: getAllData(),
    });
  }

  return jsonResponse({
    success: false,
    message: `Action GET tidak dikenali: ${action}`,
  });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = body.action;

    if (action === 'replaceAll') {
      replaceAllData(body.payload || {});
      return jsonResponse({ success: true });
    }

    return jsonResponse({
      success: false,
      message: `Action POST tidak dikenali: ${action}`,
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message || 'Terjadi kesalahan di Apps Script',
    });
  }
}

function getAllData() {
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {};
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  const result = {};

  values.forEach(([key, value]) => {
    if (!key) return;
    try {
      result[key] = JSON.parse(value);
    } catch (_error) {
      result[key] = value;
    }
  });

  return result;
}

function replaceAllData(payload) {
  const sheet = getOrCreateSheet();

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).clearContent();
  }

  const rows = Object.keys(payload).map((key) => [key, JSON.stringify(payload[key])]);

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 2).setValues(rows);
  }
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
  }

  return sheet;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
