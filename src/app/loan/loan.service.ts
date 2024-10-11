import { Injectable } from '@angular/core';
import { HttpClient,   HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { Loan } from './model/Loan';
import {LOAN_DATA} from './model/mock-loans';
import { Pageable } from '../core/model/page/Pageable';
import { LoanPage } from './model/LoanPage';
import { catchError } from 'rxjs/operators';
import { LoanSearchDto } from './model/LoanSearchDto';



@Injectable({
  providedIn: 'root'
})

export class LoanService {
  constructor(
    private http: HttpClient,
  ) { }


  findLoans(loanSearchDto: LoanSearchDto, idGame?: number, idClient?: number, date?: Date): Observable<LoanPage> {
      return this.http.post<LoanPage>(this.composeFindUrl(idGame,idClient, date), loanSearchDto).pipe(
        catchError(this.handleError)
      );
  }

  saveLoan(loan: Loan): Observable<Loan> {
      let url = 'http://localhost:8080/loan';
      return this.http.put<Loan>(url, loan).pipe(
        catchError(this.handleError)
      );
    
  }

  deleteLoan(idLoan : number): Observable<any> {
    return this.http.delete('http://localhost:8080/loan/'+ idLoan);
  
  }

  private composeFindUrl(gameId?: number, clientId?: number, date?: Date) : string {
    let params = '';
    
    if (gameId!= null) {
      params += 'idGame='+ gameId;
    }
    
    if (clientId != null) {
      if (params != '') params += "&";
      params += "idClient="+clientId;
    }

    if (date != null) {
      if (params != '') params += "&";
      let date2 = date.toDateString();
      params += "date="+ date2;
    }
    
    let url = 'http://localhost:8080/loan'

    if (params == '') return url;
    
    else {
      return url + '?'+params;
    }
    
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error);
  }

}


