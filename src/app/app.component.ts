import { Component, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// services
import {WeatherDataService} from '../services/weather-data.service';

// Import some constants
import { data_sample } from '../shared/constants'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'weather-app';

  public data_sample = data_sample;

  public weather_data:any = [];
  public selected_weather:any = [];
  public weather_summary:any = [];

  public temp_unit = "C";
  public location = "Cape Town";
  public weather_msg = "";
  public weather_bg_image = "";

  public errors_msg:string = "";
  public has_errors:boolean = false;
  public still_loading:boolean = false;


  locationForm = new FormGroup({
    locationName: new FormControl(this.location),
  });

  constructor(
    private _weather_data_service: WeatherDataService,
    private datePipe: DatePipe,
  ){ }
  

  /************************
   * INIT
   *************************/
  ngOnInit(): void {
    
    this.getAllWeatherData(this.location);

    // Load data again every 20 minutes
    interval(20000 * 60).subscribe(x => {
      this.getAllWeatherData(this.location);
    });

  };

  /************************
    * Change location
  ************************/
  changeLocation(){
      this.location = this.locationForm.value.locationName;
    if(this.locationForm.value.locationName == ""){
      alert("Enter a location")
    }else{
      this.getAllWeatherData(this.location);
    }
  }

  /**************************************
    * Group data by date (Array by key)
  ****************************************/
  groupBy:any = (array:any, key:any) => {
    // Return the end result
    return array.reduce((result:any, currentValue:any) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
           
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };


  /***************************************
    * When clicking to view specific time
  ****************************************/
  viewTimeWeather(index:any, type:any){

    let time_of_day:any;
    // Check if user is clicking on day weather or time weather
    if(type == "day"){
      this.selected_weather = this.weather_data[index];
      index = 0;
    }
    console.log(this.selected_weather);
    
    if(this.selected_weather[index].sys.pod == "n"){
      time_of_day = "night";
    }else{
      time_of_day = "day";
    }
    
    // SET background images based in different conditions
    if(this.selected_weather[index].weather[0].main == "Clear"){
      this.weather_bg_image = `url(../assets/${time_of_day}/clear.jpeg)`;
    }else if(this.selected_weather[index].weather[0].main == "Drizzle"){
      this.weather_bg_image = `url(../assets/drizzle.jpeg)`;
    }else if(this.selected_weather[index].weather[0].main == "Rain"){
      this.weather_bg_image = `url(../assets/${time_of_day}/rain.jpeg)`;
    }else if(this.selected_weather[index].weather[0].main == "Clouds"){
      this.weather_bg_image = `url(../assets/${time_of_day}/clouds.jpeg)`;
    }else if(this.selected_weather[index].weather[0].main == "Thunderstorm"){
      this.weather_bg_image = `url(../assets/${time_of_day}/thunder.jpeg)`;
    }else if(this.selected_weather[index].weather[0].main == "Snow"){
      this.weather_bg_image = `url(../assets/${time_of_day}/snow.webp)`;
    }else if(this.selected_weather[index].weather[0].main == "Mist"){
      this.weather_bg_image = `url(../assets/${time_of_day}/mist.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Smoke"){
      this.weather_bg_image = `url(../assets/${time_of_day}/smoke.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Haze"){
      this.weather_bg_image = `url(../assets/${time_of_day}/haze.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Dust"){
      this.weather_bg_image = `url(../assets/${time_of_day}/dust.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Fog"){
      this.weather_bg_image = `url(../assets/${time_of_day}/fog.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Sand"){
      this.weather_bg_image = `url(../assets/${time_of_day}/sand.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Dust"){
      this.weather_bg_image = `url(../assets/${time_of_day}/dust.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Ash"){
      this.weather_bg_image = `url(../assets/${time_of_day}/ash.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Squall"){
      this.weather_bg_image = `url(../assets/${time_of_day}/squall.jpg)`;
    }else if(this.selected_weather[index].weather[0].main == "Tornado"){
      this.weather_bg_image = `url(../assets/${time_of_day}/tornado.jpg)`;
    }else{
      this.weather_bg_image = '';
    }

    this.weather_summary = {
      'temp': `${this.convertTemparature(this.selected_weather[index].main.temp)} ??${this.temp_unit}`,
      'temp_kelvin':this.selected_weather[index].main.temp,
      'date': this.selected_weather[index].date,
      'time': this.selected_weather[index].time,
      'weekday': this.selected_weather[index].weekday,
      'humidity': this.selected_weather[index].main.humidity,
      'wind': `${(this.selected_weather[index].wind.speed * 3.6).toFixed(1)} km\h`,
      'location': this.location,
      'desc': this.selected_weather[index].weather[0].description,
      'icon': `http://openweathermap.org/img/wn/${this.selected_weather[index].weather[0].icon}@2x.png`,
    }
  }

  /************************
    * Convert temperature
  ************************/
  convertTemparature(kelvinVal:number){
    let temperature:number;

    if(this.temp_unit == "C"){
      temperature = kelvinVal - 273.15;

      if(temperature < 15){
        this.weather_msg = "It's about to get cold, maybe you should grab a jacket.";
      }else if(temperature > 25){
        this.weather_msg = "It's about to get really hot, remember to drink lots of water.";
      }else{
        this.weather_msg = "";
      }
    }else if(this.temp_unit == "F"){
      temperature = (kelvinVal-273.15)*9/5+32;
    }else{
      temperature = kelvinVal;
    }

    return temperature.toFixed(1);
  }

  /************************
    * Switch temparature unit
  ************************/
  switchTempUnit(unit:any){
    if(unit == "C"){
      this.temp_unit = "C";
    }else if(unit == "F"){
      this.temp_unit = "F";
    }
    
    this.weather_summary.temp = `${this.convertTemparature(this.weather_summary.temp_kelvin)} ??${this.temp_unit}`;
  }


  /*********************** 
  // Recall API on try again
  ************************/
  refreshPage(location:any){
    this.getAllWeatherData(location);
    this.location = location;

    this.locationForm.setValue({
      locationName: location,
    });
  }

  
  /*********************** 
  // Get all Weather Data
  ************************/
  getAllWeatherData(location:any){
    this.has_errors = false;
    this.errors_msg = "";
    this.still_loading = true;
    
    this.weather_data = [];
    this.selected_weather = []; 

    this._weather_data_service.getAllWeather(location).subscribe({
      next: (data:any) => {
      
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
          'clouds': item.clouds,
          'sys': item.sys
        })

      });
      
      // Group data by date
      this.weather_data = this.groupBy(this.weather_data, 'date');

      // Convert object to array to loop in html
      this.weather_data = Object.values(this.weather_data);

      // Select the first weather and set as selected
      this.selected_weather = this.weather_data[0][0];    
      
      this.viewTimeWeather(0, 'day');

      this.has_errors = false;
      this.errors_msg = "";
      this.still_loading = false;

      },error: error => {

        this.has_errors = true;
        this.errors_msg = "Something went wrong, please try again. If the error persist contact support on mekgwele@gmail.com";
        this.still_loading = false;

        if(error.status == "404"){
          this.errors_msg = "No data found for your search."
        }
        
      }

    }); //end subscribe get all
  }

    // WEATHERE DATA SIMULATION
  // weatherData(){
  //    /*** 
  //    *  SIMUMATED DATA TO AVOID CALLING API
  //    *  Must comment out for production
  //   */
  //   // Compile data properly into new array with needed information
  //   this.data_sample.list.forEach((item:any) => {
  //     this.weather_data.push({
  //       'dateTime':item.dt_txt,
  //       'date':this.datePipe.transform(item.dt_txt, 'd MMMM y'),
  //       'time':this.datePipe.transform(item.dt_txt, 'h:mm a'),
  //       'weekday':this.datePipe.transform(item.dt_txt, 'EEEE'),
  //       'main':item.main,
  //       'weather': item.weather,
  //       'wind':item.wind,
  //       'clouds': item.clouds
  //     })

  //   });
      
  //   this.weather_data = this.groupBy(this.weather_data, 'date');

  //   // Convert object to array to loop in html
  //   this.weather_data = Object.values(this.weather_data);
  //   this.selected_weather = this.weather_data[0];


  //   this.viewTimeWeather(0, 'day');;

  //   console.log(this.data_sample);
  //   console.log(this.weather_data);
  //   console.log(this.selected_weather);

  //   this.weather_data.forEach((element:any) => {
  //       console.log(element);
  //   });

  //   /**
  //    * END
  //    */
  // }

}
