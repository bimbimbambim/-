import { ExcelParser } from '../../services/ExcelParser';
import { ExcelExporter } from '../../services/ExcelExporter';
import ExcelJS from 'exceljs';
import { describe, it, expect } from 'vitest';

describe('Excel Services Integration', () => {
  it('should create, parse and export excel data', async () => {
    const workbook = new ExcelJS.Workbook();

    // Create Teachers sheet
    const tSheet = workbook.addWorksheet('Teachers');
    tSheet.addRow(['ID', 'Name', 'Subjects', 'MaxHours', 'Unavailable']);
    tSheet.addRow(['T1', 'Prof. Smith', 'S1', 8, '']);

    // Create Slots sheet
    const sSheet = workbook.addWorksheet('Slots');
    sSheet.addRow(['ID', 'Day', 'Start', 'End', 'Period']);
    sSheet.addRow(['SL1', 'Monday', '08:00', '09:00', 1]);

    // Create Rooms sheet
    const rSheet = workbook.addWorksheet('Rooms');
    rSheet.addRow(['ID', 'Name', 'Capacity', 'Type', 'Unavailable']);
    rSheet.addRow(['R1', 'Lab 1', 30, 'Lab', '']);

    // Create Subjects sheet
    const subSheet = workbook.addWorksheet('Subjects');
    subSheet.addRow(['ID', 'Name', 'Hours', 'Grade', 'RoomType']);
    subSheet.addRow(['S1', 'Math', 4, '10A', 'General']);

    // Create Classes sheet
    const cSheet = workbook.addWorksheet('Classes');
    cSheet.addRow(['ID', 'Name', 'Grade', 'Subjects', 'Count']);
    cSheet.addRow(['C1', 'Class 10A', '10A', 'S1', 25]);

    const buffer = await workbook.xlsx.writeBuffer();

    const parser = new ExcelParser();
    const data = await parser.parseData(buffer as ArrayBuffer);

    expect(data.teachers).toHaveLength(1);
    expect(data.teachers[0].name).toBe('Prof. Smith');
    expect(data.slots[0].day).toBe('Monday');

    const exporter = new ExcelExporter();
    const exportBuffer = await exporter.export(
      [{ id: '1', subjectId: 'S1', teacherId: 'T1', classGroupId: 'C1', roomId: 'R1', slotId: 'SL1' }],
      {
        teachers: data.teachers,
        subjects: data.subjects,
        rooms: data.rooms,
        slots: data.slots,
        classes: data.classes
      }
    );

    expect(exportBuffer).toBeDefined();

    // Verify the exported workbook
    const verifyWorkbook = new ExcelJS.Workbook();
    await verifyWorkbook.xlsx.load(exportBuffer);
    const scheduleSheet = verifyWorkbook.getWorksheet('Schedule');
    expect(scheduleSheet?.getCell('A2').value).toBe('Monday');
    expect(scheduleSheet?.getCell('D2').value).toBe('Math');
  });
});
