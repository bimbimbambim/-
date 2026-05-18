import ExcelJS from 'exceljs';
import { Teacher, Room, Subject, ClassGroup, TimeSlot, DayOfWeek } from '../types';

export class ExcelParser {
  async parseData(file: ArrayBuffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    const teachers = this.parseTeachers(workbook.getWorksheet('Teachers'));
    const rooms = this.parseRooms(workbook.getWorksheet('Rooms'));
    const subjects = this.parseSubjects(workbook.getWorksheet('Subjects'));
    const classes = this.parseClasses(workbook.getWorksheet('Classes'));
    const slots = this.parseSlots(workbook.getWorksheet('Slots'));

    return { teachers, rooms, subjects, classes, slots };
  }

  private parseTeachers(sheet: ExcelJS.Worksheet | undefined): Teacher[] {
    if (!sheet) return [];
    const teachers: Teacher[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Header
      teachers.push({
        id: row.getCell(1).text,
        name: row.getCell(2).text,
        subjects: row.getCell(3).text.split(',').map(s => s.trim()),
        maxHoursPerDay: Number(row.getCell(4).value) || 8,
        unavailableSlots: row.getCell(5).text ? row.getCell(5).text.split(',').map(s => s.trim()) : [],
        preferences: {}
      });
    });
    return teachers;
  }

  private parseRooms(sheet: ExcelJS.Worksheet | undefined): Room[] {
    if (!sheet) return [];
    const rooms: Room[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      rooms.push({
        id: row.getCell(1).text,
        name: row.getCell(2).text,
        capacity: Number(row.getCell(3).value) || 30,
        type: (row.getCell(4).text as any) || 'General',
        unavailableSlots: row.getCell(5).text ? row.getCell(5).text.split(',').map(s => s.trim()) : []
      });
    });
    return rooms;
  }

  private parseSubjects(sheet: ExcelJS.Worksheet | undefined): Subject[] {
    if (!sheet) return [];
    const subjects: Subject[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      subjects.push({
        id: row.getCell(1).text,
        name: row.getCell(2).text,
        hoursPerWeek: Number(row.getCell(3).value) || 1,
        grade: row.getCell(4).text,
        requiredRoomType: (row.getCell(5).text as any) || 'General'
      });
    });
    return subjects;
  }

  private parseClasses(sheet: ExcelJS.Worksheet | undefined): ClassGroup[] {
    if (!sheet) return [];
    const classes: ClassGroup[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      classes.push({
        id: row.getCell(1).text,
        name: row.getCell(2).text,
        grade: row.getCell(3).text,
        subjects: row.getCell(4).text.split(',').map(s => s.trim()),
        studentCount: Number(row.getCell(5).value) || 20
      });
    });
    return classes;
  }

  private parseSlots(sheet: ExcelJS.Worksheet | undefined): TimeSlot[] {
    if (!sheet) return [];
    const slots: TimeSlot[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      slots.push({
        id: row.getCell(1).text,
        day: row.getCell(2).text as DayOfWeek,
        startTime: row.getCell(3).text,
        endTime: row.getCell(4).text,
        period: Number(row.getCell(5).value) || rowNumber - 1
      });
    });
    return slots;
  }
}
