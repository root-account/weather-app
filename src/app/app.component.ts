import { Component, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

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

  public weather_data:any = [];
  public selected_weather:any = [];
  public weather_summary:any = [];
  public selected_location:any = data_sample.city;

  public temp_unit = "C";
  public location = "Johannesburg";
  
  constructor(
    private _weather_data_service: WeatherDataService,
    private datePipe: DatePipe
  ){ }

  ngOnInit(): void {
    
    // this.getAllWeatherData();

    /*** 
     *  SIMUMATED DATA TO AVOID CALLING API
     * 
    */
    // Compile data properly into new array with needed information
    this.data_sample.list.forEach((item:any) => {
      this.weather_data.push({
        'dateTime':item.dt_txt,
        'date':this.datePipe.transform(item.dt_txt, 'd MMMM y'),
        'time':this.datePipe.transform(item.dt_txt, 'h:mm a'),
        'weekday':this.datePipe.transform(item.dt_txt, 'EEEE'),
        'main':item.main,
        'weather': item.weather,
        'wind':item.wind,
        'clouds': item.clouds
      })

    });
      
    this.weather_data = this.groupBy(this.weather_data, 'date');

    // Convert object to array to loop in html
    this.weather_data = Object.values(this.weather_data);
    this.selected_weather = this.weather_data[0];


    this.viewDayWeather(0);

    // console.log(this.data_sample);
    // console.log(this.weather_data);
    // console.log(this.selected_location);
    // console.log(this.selected_weather);

    // this.weather_data.forEach((element:any) => {
    //     console.log(element);
    // });

    /**
     * END
     */

  };


  

  // Group data by date (Array by key)
  groupBy:any = (array:any, key:any) => {
    // Return the end result
    return array.reduce((result:any, currentValue:any) => {
      // this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
           
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };


  viewDayWeather(index:any){

    this.selected_weather = this.weather_data[index];   
    this.weather_summary = {
      'temp':`${this.convertTemparature(this.selected_weather[0].main.temp)} °${this.temp_unit}`,
      'date': this.selected_weather[0].date,
      'time': this.selected_weather[0].time,
      'weekday': this.selected_weather[0].weekday,
      'humidity': this.selected_weather[0].main.humidity,
      'wind': `${this.selected_weather[0].wind.speed} km\h`,
      'location': this.location,
      'desc': this.selected_weather[0].weather[0].description,
    }
  }

  viewTimeWeather(index:any){
    this.weather_summary = {
      'temp': `${this.convertTemparature(this.selected_weather[index].main.temp)} °${this.temp_unit}`,
      'date': this.selected_weather[index].date,
      'time': this.selected_weather[index].time,
      'weekday': this.selected_weather[index].weekday,
      'humidity': this.selected_weather[index].main.humidity,
      'wind': `${this.selected_weather[index].wind.speed} km\h`,
      'location': this.location,
      'desc': this.selected_weather[index].weather[0].description,
    }
  }

  // Convert temperature
  convertTemparature(kelvinVal:number){
    let temperature:number;

    if(this.temp_unit == "C"){
      temperature = kelvinVal - 273.15;
    }else if(this.temp_unit == "F"){
      temperature = (kelvinVal-273.15)*9/5+32;
    }else{
      temperature = kelvinVal;
    }

    return temperature.toFixed(1);
  }


  // Get all Weather Data
  getAllWeatherData(){
    this._weather_data_service.getAllWeather(this.location).subscribe({
      next: (data:any) => {
      
      this.selected_location = data.city;
      
      // Compile data properly into new array with needed information
      data.list.forEach((item:any) => {
        this.weather_data.push({
          'dateTime':item.dt_txt,
          'date':this.datePipe.transform(item.dt_txt, 'yyyy-MM-dd'),
          'time':this.datePipe.transform(item.dt_txt, 'h:mm a'),
          'weekday':this.datePipe.transform(item.dt_txt, 'EEEE'),
          'main':item.main,
          'weather': item.weather,
          'wind':item.wind,
          'clouds': item.clouds
        })

      });
        
      this.weather_data = this.groupBy(this.weather_data, 'date');

      // Convert object to array to loop in html
      this.weather_data = Object.values(this.weather_data);

      // Select the first weather and set as selected
      this.selected_weather = this.weather_data[0][0];      

      },error: error => {

        alert("Something went wrong");
        console.log(error);
        
      }

    }); //end subscribe get all
  }

}
