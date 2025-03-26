import { Component, inject, output, viewChild } from '@angular/core';
import { ExcelData } from '../../models/file-upload.model';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-excel-upload',
  templateUrl: './excel-upload.component.html',
  styleUrl: './excel-upload.component.scss',
  standalone: true,
})
export class ExcelUploadComponent {
  fileInput = viewChild('fileInput');
  fileSubmission = output<ExcelData>();
  spinner: NgxSpinnerService = inject(NgxSpinnerService);

  /**
   * Accept excel or csv files only
   */
  readonly accept = '.xls, .xlsx, .csv';

  /**
   * Read file data on change
   * @param evt (any) - file submitted from input
   */
  onFileChange(evt: any) {
    const target: DataTransfer = evt.target as any;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    this.spinner.show();
    const reader: FileReader = new FileReader();

    setTimeout(() => {
      reader.onload = (e: any) => {
        // Read workbook
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {
          type: 'binary',
        });
        // Grab the first sheet
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        // Extract data and headers
        const data = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          raw: false,
        }) as any;
        const dataHeaders = data.shift();
        const fileName = target.files[0].name;
        // Emit data to output
        this.fileSubmission.emit({ data, dataHeaders, fileName });
        this.spinner.hide();
      };
      reader.readAsBinaryString(target.files[0]);
    }, 200);
  }
}
