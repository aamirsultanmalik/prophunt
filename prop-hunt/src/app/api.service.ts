import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  Post(apiUrl: string, data?: any): Observable<any> {
    //use this Header to send token.
    const headers = new HttpHeaders({
      "Content-Type": "application/JSON",
    });
    return this.http.post(apiUrl, data).pipe(
      map((Response) => Response),
      catchError((error) => {
        this._snackBar.open("Some Error Occured, Please Try Again", "Error", {
          duration: 2000,
        });
        return throwError(error);
      })
    );
  }
}
