import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OpenDoorDto } from '../model/open-door-manager';


@Injectable({
  providedIn: 'root'
})
export class OpenDoorService {
  private urlBase: string = environment.urlBase;

  constructor(private http: HttpClient) { }

  

  public validateUser(formData: FormData): Observable<any>{
    return this.http.post(`${this.urlBase}/validate-face-image`, formData);
  }

  public closeDoor(openDoorDto: OpenDoorDto): Observable<any> {
    return this.http.post(`${this.urlBase}/close-door`, openDoorDto);
  }

  public openDoor(openDoorDto: OpenDoorDto): Observable<any> {
    return this.http.post(`${this.urlBase}/open-door`, openDoorDto);
  }
}
