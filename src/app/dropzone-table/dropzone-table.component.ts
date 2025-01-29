import { Component, EventEmitter, Output } from '@angular/core'
import { NgxDropzoneModule } from 'ngx-dropzone'
import { NgForOf, NgIf } from '@angular/common'
import * as Papa from 'papaparse'
import { MatListSubheaderCssMatStyler } from '@angular/material/list'

// @ts-expect-error
import { FileSelectResult } from 'ngx-dropzone/lib/ngx-dropzone.service'

@Component({
  selector: 'app-dropzone-table',
  templateUrl: './dropzone-table.component.html',
  imports: [
    NgxDropzoneModule,
    NgForOf,
    NgIf,
    MatListSubheaderCssMatStyler
  ],
  styleUrls: ['./dropzone-table.component.css']
})
export class DropzoneTableComponent {
  protected file: File | null = null
  isButtonDisabled = true
  data: never[] = []
  errorMessage = ''
  resultMessage = ''
  @Output() csvData = new EventEmitter<any[]>()

  onSelect (event: FileSelectResult) {
    const selectedFile = event?.addedFiles[0]
    if (selectedFile?.type === 'text/csv') {
      this.file = selectedFile
      this.isButtonDisabled = false
      this.errorMessage = ''
      this.parseCSV(selectedFile)
    } else {
      this.onRemove()
      this.errorMessage = 'Only .csv files are allowed!'
      this.resultMessage = ''
    }
  }

  onRemove () {
    this.file = null
    this.isButtonDisabled = true
    this.data = []
    this.errorMessage = ''
    this.resultMessage = ''
    this.csvData.emit([])
  }

  parseCSV (file: File) {
    Papa.parse(file, {
      header: false,
      complete: (result) => {
        const rows = result.data.length - 1
        const data = result.data.slice(0, rows)
        // @ts-expect-error
        this.data = data
        this.csvData.emit(data)
        this.resultMessage = `Showing all ${rows} Row(s)`
      },
      error: (error) => {
        this.csvData.emit([])
        this.errorMessage = 'Error parsing CSV file!'
        console.error('Error parsing CSV file:', error)
      }
    })
  }
}
