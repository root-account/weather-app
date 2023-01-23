import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { catchError, tap, map, retry, mergeMap, retryWhen  } from 'rxjs/operators'; 
import {  throwError, of, pipe, range, timer, zip  } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {

  private base_url = "http://api.openweathermap.org/data/2.5";

  private api_key = "369eec43839edb457bcd10bae170b463";
  private location = "Cape town";
  private weather_forecast_url = "";
 
  constructor(private _http: HttpClient) {} 

  // Get all weather
  getAllWeather(location:any): Observable<any []> { 

    // Check if latitude and longitude a supplied otherwise use the default ones 
    location ? this.location = location : location = this.location;

    // Construct the api call url based on the provide information
    this.weather_forecast_url = this.base_url+"/forecast?q="+location+"&appid="+this.api_key;
    
    let weather_data:any = this._http.get<any>(this.weather_forecast_url).pipe(this.backoff(3, 1000), catchError(this.handleError));

    return weather_data;
  }

  // Error handling
  handleError(error: HttpErrorResponse) {
    let errorMessage:any = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      // errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = {'status': error.status, 'message': error.message};
      // `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

  // Exponential backoff retry
  backoff(maxTries: number, delay: number) {
    return pipe(
      retryWhen(attempts =>
        zip(range(1, maxTries+1), attempts).pipe(
          mergeMap(([i, err]) => (i > maxTries) ? throwError(err) : of(i)),
          map(i => i * i),
          mergeMap(v => timer(v * delay)),
        ),
      ),
    );
  }


}
