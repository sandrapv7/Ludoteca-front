import { HttpClient,  HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Client } from './model/Client';
import { CLIENT_DATA } from './model/mock-clients';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>('http://localhost:8080/clients');
  }

  saveClient(client: Client): Observable<Client> {
    let url = 'http://localhost:8080/clients';
    if (client.id != null) url += '/'+ client.id;

    return this.http.put<Client>(url, client).pipe(
      catchError(this.handleError)
    );
  }

  deleteClient(idClient : number): Observable<any> {
    return this.http.delete('http://localhost:8080/clients/'+ idClient);
  
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error);
  }


}
