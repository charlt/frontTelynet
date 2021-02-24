import { AfterViewInit, Component, ViewChild, Inject, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CoreServices } from './services/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as alertify from 'alertifyjs';

import { Iuser } from './interfaces/user.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DialogData {
  add: boolean;
  userId: string;
}
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  title = 'frontTelynet';
  dataUsers;
  elements = [];

  constructor(
    private coreServices: CoreServices,
    public dialog: MatDialog
  ) {

  }
  displayedColumns: string[] = ['Codigo', 'Nombre', 'Direccion', 'Poblacion', 'Cp', 'Ciudad', 'Telefono', 'Editar', 'Eliminar'];
  dataSource = new MatTableDataSource<any>(this.elements);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.coreServices.getUsers().subscribe(res => {
      this.dataSource.data = res.data;
    });
  }
  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
  }

  add() {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '450px',
      data: { add: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  edit(userId: any) {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '450px',
      data: { add: false, userId }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'app-form',
  templateUrl: './form/form.component.html',
  styleUrls: ['./form/form.component.sass']
})
export class FormComponent implements OnInit {
  myForm: FormGroup;
  dataActualizar: any;
  constructor(
    public form: FormBuilder,
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private coreServices: CoreServices,
    private router: Router
  ) {
    this.myForm = this.form.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      poblacion: ['', [Validators.required]],
      cp: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
    });
  }
  get f() { return this.myForm.controls; }
  ngOnInit() {
    if (!this.data.add) {
      this.coreServices.getUser(this.data.userId).subscribe(response => {
        if (response.data) {
          let data = response.data;
          this.myForm.get('codigo').setValue(data.codigo);
          this.myForm.get('nombre').setValue(data.nombre);
          this.myForm.get('direccion').setValue(data.direccion);
          this.myForm.get('poblacion').setValue(data.poblacion);
          this.myForm.get('cp').setValue(data.cp);
          this.myForm.get('telefono').setValue(data.telefono);
          this.myForm.get('ciudad').setValue(data.ciudad);
        }
      })
    }
  }
  enviarInformacion() {
    // stop here if form is invalid
    if (this.myForm.invalid) {
      Object.keys(this.myForm.controls).forEach(controlKey => {
        this.myForm.controls[controlKey].markAsTouched();
      });
      return;
    }
    const formData = {
      nombre: this.myForm.get('nombre').value,
      codigo: this.myForm.get('codigo').value,
      cp: this.myForm.get('cp').value,
      poblacion: this.myForm.get('poblacion').value,
      ciudad: this.myForm.get('ciudad').value,
      direccion: this.myForm.get('direccion').value,
      telefono: this.myForm.get('telefono').value
    }

    if (this.data.add) {
      this.coreServices.saveUser(formData).subscribe(
        response => {
          if (response) {
            //alertify.success('Usuario creado correctamente');
            window.location.reload()
          } else {
            alertify.error(response['msg'])

          }

        }, error => {
          console.log(<any>error)
        });
    } else {
      this.coreServices.updateUser(formData, this.data.userId).subscribe(
        response => {
          if (response) {
            //alertify.success('Usuario creado correctamente');
            window.location.reload()
          } else {
            alertify.error(response['msg'])

          }

        }, error => {
          console.log(<any>error)
        });
    }


  }
}


