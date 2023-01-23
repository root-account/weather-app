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
  public weather_msg = "";
  public weather_bg_image = "";
  
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


    this.viewTimeWeather(0, 'day');;

    console.log(this.data_sample);
    console.log(this.weather_data);
    console.log(this.selected_location);
    console.log(this.selected_weather);

    this.weather_data.forEach((element:any) => {
        console.log(element);
    });

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


  // When clicking to view specific time
  viewTimeWeather(index:any, type:any){

    if(type == "day"){
      this.selected_weather = this.weather_data[index];
      index = 0;
    }

    // SET background images based in different conditions
    if(this.selected_weather[index].weather[0].main == "Clear"){
      this.weather_bg_image = 'url(../assets/clear.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Drizzle"){
      this.weather_bg_image = 'url(../assets/drizzle.jpeg)';
    }else if(this.selected_weather[index].weather[0].main == "Rain"){
      this.weather_bg_image = 'url(../assets/rain.jpeg)';
    }else if(this.selected_weather[index].weather[0].main == "Clouds"){
      this.weather_bg_image = 'url(../assets/clouds.jpeg)';
    }else if(this.selected_weather[index].weather[0].main == "Thunderstorm"){
      this.weather_bg_image = 'url(../assets/thunder.jpeg)';
    }else if(this.selected_weather[index].weather[0].main == "Snow"){
      this.weather_bg_image = 'url(../assets/snow.webp)';
    }else if(this.selected_weather[index].weather[0].main == "Mist"){
      this.weather_bg_image = 'url(../assets/mist.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Smoke"){
      this.weather_bg_image = 'url(../assets/smoke.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Haze"){
      this.weather_bg_image = 'url(../assets/haze.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Dust"){
      this.weather_bg_image = 'url(../assets/dust.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Fog"){
      this.weather_bg_image = 'url(../assets/fog.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Sand"){
      this.weather_bg_image = 'url(../assets/sand.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Dust"){
      this.weather_bg_image = 'url(../assets/dust.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Ash"){
      this.weather_bg_image = 'url(../assets/ash.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Squall"){
      this.weather_bg_image = 'url(../assets/squall.jpg)';
    }else if(this.selected_weather[index].weather[0].main == "Tornado"){
      this.weather_bg_image = 'url(../assets/tornado.jpg)';
    }else{
      this.weather_bg_image = '';
    }

    this.weather_summary = {
      'temp': `${this.convertTemparature(this.selected_weather[index].main.temp)} °${this.temp_unit}`,
      'temp_kelvin':this.selected_weather[index].main.temp,
      'date': this.selected_weather[index].date,
      'time': this.selected_weather[index].time,
      'weekday': this.selected_weather[index].weekday,
      'humidity': this.selected_weather[index].main.humidity,
      'wind': `${this.selected_weather[index].wind.speed} km\h`,
      'location': this.location,
      'desc': this.selected_weather[index].weather[0].description,
      'icon': `http://openweathermap.org/img/wn/${this.selected_weather[index].weather[0].icon}@2x.png`,
    }
  }

  // Convert temperature
  convertTemparature(kelvinVal:number){
    let temperature:number;

    if(this.temp_unit == "C"){
      temperature = kelvinVal - 273.15;

      if(temperature < 15){
        this.weather_msg = "It's about to get cold, maybe you should grap a jacket.";
      }else if(temperature > 25){
        this.weather_msg = "It's about to get really hot, remember to drink lots of water.";
      }else{
        this.weather_msg = "";
      }

      console.log(temperature);
      
    }else if(this.temp_unit == "F"){
      temperature = (kelvinVal-273.15)*9/5+32;
    }else{
      temperature = kelvinVal;
    }

    return temperature.toFixed(1);
  }

  // Switch temparature unit
  switchTempUnit(unit:any){
    if(unit == "C"){
      this.temp_unit = "C";
    }else if(unit == "F"){
      this.temp_unit = "F";
    }
    
    this.weather_summary.temp = `${this.convertTemparature(this.weather_summary.temp_kelvin)} °${this.temp_unit}`;
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
      
      this.viewTimeWeather(0, 'day');

      },error: error => {

        alert("Something went wrong");
        console.log(error);
        
      }

    }); //end subscribe get all
  }

}
