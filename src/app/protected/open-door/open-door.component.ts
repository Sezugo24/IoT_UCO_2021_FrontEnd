import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OpenDoorService } from './shared/service/open-door.service';
import { Profile } from '../../auth/services/profile';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { OpenDoorDto } from './shared/model/open-door-manager';

@Component({
  selector: 'app-open-door',
  templateUrl: './open-door.component.html',
  styleUrls: ['./open-door.component.css']
})
export class OpenDoorComponent implements OnInit {

  public openDoorForm!: FormGroup;
  public profile$!: Observable<Profile>;
  public pinPattern = "[0-9]{4}";
  public validateFace = true;


  constructor(private FormBuilder: FormBuilder,
              private doorService: OpenDoorService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.profile$ = this.authService.validarToken();
    this.openDoorForm = this.FormBuilder.group({
      image: ['', Validators.required],
      pin: ['', [Validators.required, Validators.pattern(this.pinPattern)]]
    })

  }


  public permisoVista(role:any){
    if (role == 'MANAGER'){
        return true;
    }
    else if (role == 'POWER_USER'){
      return true;
    }
    else{
      return false;
      
    }
  }

  


  public notFount(role: any){
    if(role == 'USER'){
      return true
    }
    else if(role == 'WATCHMAN'){
      return true
    }
    else{
      return false
    }

  }



  public nowOpenDoor():void {
    if(this.openDoorForm.valid){
      console.log('genial')
    }
  }




  public onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.openDoorForm.get('profile')?.setValue(file);
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('pin', this.openDoorForm.get('pin')?.value);
      console.log(formData);
      this.doorService.validateUser(formData).subscribe(res => {
        Swal.fire({
          title: '<p class="fuente size-fuente" style="color: #80d8ff"><small>Cara reconocida correctamente</small></p>',
          html: '<p class="fuente size-fuente" style="color: #ffffff"><small>Ya tienes acceso a la puerta.</small></p>',
          icon: 'success',
          confirmButtonColor: '#00e17b',
          background: '#212121',
          confirmButtonText: '<a class="fuente">Ok</a>'
        });
        this.validateFace = false;
      }, () => {
        this.validateFace = true;
        Swal.fire({
          title: '<p class="fuente size-fuente" style="color: #80d8ff"><small>La imagen cargada no coincide con su cara</small></p>',
          html: '<p class="fuente size-fuente" style="color: #ffffff"><small>Intentelo de nuevo o contacte al administrador.</small></p>',
          icon: 'error',
          confirmButtonColor: '#00e17b',
          background: '#212121',
          confirmButtonText: '<a class="fuente">Ok</a>'
        });
      });
    }   
  }

  public closeDoor() {
    const openDoorDto: OpenDoorDto = {
      pin: this.openDoorForm.get('pin')?.value
    }
    this.doorService.closeDoor(openDoorDto).subscribe(() => {
      Swal.fire({
        title: '<p class="fuente size-fuente" style="color: #80d8ff"><small>Puerta cerrada correctamente</small></p>',
        html: '<p class="fuente size-fuente" style="color: #ffffff"><small>Tus pertenencias están a salvo.</small></p>',
        icon: 'success',
        confirmButtonColor: '#00e17b',
        background: '#212121',
        confirmButtonText: '<a class="fuente">Ok</a>'
      });
    });
  }

  public openDoor() {
    const openDoorDto: OpenDoorDto = {
      pin: this.openDoorForm.get('pin')?.value
    }
    this.doorService.openDoor(openDoorDto).subscribe(() => {
      Swal.fire({
        title: '<p class="fuente size-fuente" style="color: #80d8ff"><small>Puerta abierta correctamente</small></p>',
        html: '<p class="fuente size-fuente" style="color: #ffffff"><small>Ya puedes acceder.</small></p>',
        icon: 'success',
        confirmButtonColor: '#00e17b',
        background: '#212121',
        confirmButtonText: '<a class="fuente">Ok</a>'
      });
    }, err => {
      Swal.fire({
        title: '<p class="fuente size-fuente" style="color: #80d8ff"><small>Hubo un error</small></p>',
        html: `<p class="fuente size-fuente" style="color: #ffffff"><small>${err.error.message}</small></p>`,
        icon: 'error',
        confirmButtonColor: '#00e17b',
        background: '#212121',
        confirmButtonText: '<a class="fuente">Ok</a>'
      });
    });
  }
}
