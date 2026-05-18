import ExcelJS from 'exceljs';
import { ScheduledItem, Teacher, Subject, Room, TimeSlot, ClassGroup } from '../types';

export class ExcelExporter {
  async export(
    schedule: ScheduledItem[],
    data: {
      teachers: Teacher[],
      subjects: Subject[],
      rooms: Room[],
      slots: TimeSlot[],
      classes: ClassGroup[]
    },
    templateFile?: ArrayBuffer
  ): Promise<ArrayBuffer> {
    const workbook = new ExcelJS.Workbook();

    if (templateFile) {
      await workbook.xlsx.load(templateFile);
    } else {
      this.createDefaultTemplate(workbook, data.slots);
    }

    const sheet = workbook.getWorksheet('Schedule') || workbook.addWorksheet('Schedule');

    // Create lookup maps
    const teacherMap = new Map(data.teachers.map(t => [t.id, t.name]));
    const subjectMap = new Map(data.subjects.map(s => [s.id, s.name]));
    const roomMap = new Map(data.rooms.map(r => [r.id, r.name]));
    const classMap = new Map(data.classes.map(c => [c.id, c.name]));
    const slotMap = new Map(data.slots.map(s => [s.id, s]));

    // Fill Data
    schedule.forEach((item, index) => {
      const row = sheet.getRow(index + 2);
      const slot = slotMap.get(item.slotId);

      row.getCell(1).value = slot?.day;
      row.getCell(2).value = `${slot?.startTime} - ${slot?.endTime}`;
      row.getCell(3).value = classMap.get(item.classGroupId);
      row.getCell(4).value = subjectMap.get(item.subjectId);
      row.getCell(5).value = teacherMap.get(item.teacherId);
      row.getCell(6).value = roomMap.get(item.roomId);

      // Apply some basic styling if it's a new row
      row.eachCell((cell) => {
        if (!cell.style.font) {
          cell.font = { name: 'Arial', size: 10 };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      });
      row.commit();
    });

    return await workbook.xlsx.writeBuffer() as ArrayBuffer;
  }

  private createDefaultTemplate(workbook: ExcelJS.Workbook, slots: TimeSlot[]) {
    const sheet = workbook.addWorksheet('Schedule');
    const header = sheet.getRow(1);
    header.values = ['Day', 'Time', 'Class', 'Subject', 'Teacher', 'Room'];
    header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    header.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0071E3' } // Apple Blue
    };

    sheet.columns = [
      { width: 15 }, { width: 20 }, { width: 15 },
      { width: 25 }, { width: 25 }, { width: 15 }
    ];
  }
}
