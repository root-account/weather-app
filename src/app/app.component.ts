import { Component, NgModule } from '@angular/core';

// services
import {WeatherDataService} from '../services/weather-data.service';

// Import some constants
import { data_sample } from '../shared/constants'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

//9c80c8aac29df6c2539bc04d38767669
export class AppComponent {
  title = 'weather-app';

  public data_sample = data_sample;

  constructor(
    private _weather_data_service: WeatherDataService,
  ){ }

  ngOnInit(): void {
    // this.getAllWeatherData();

    console.log(this.data_sample);
    
  };


  // Get all Weather Data
  getAllWeatherData(){
    this._weather_data_service.getAllWeather("Johannesburg").subscribe({
      next: data => {
        
        console.log(data);
        
        alert("Data received");
      },error: error => {
        
        alert("Something went wrong");
        console.log(error);
        
      }

    }); //end subscribe get all
  }

}
