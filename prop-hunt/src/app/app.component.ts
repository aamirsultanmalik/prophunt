import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from "./api.service";

declare var google : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'prop-hunt';
  lat: any;
  lng: any;
  zoom = 10;
  email:any
  houseList:any
  emailExists:boolean=true
  property: PropertyModel;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,private ngZone: NgZone , private _snackBar: MatSnackBar, private apiService: ApiService) 
    { 
      this.property= new PropertyModel();
    }

  ngOnInit() {
    this.lat = 51.678418;
    this.lng   = 7.809007;
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => { 
      // this.geoCoder = new google.maps.Geocoder;

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          debugger
          //get the place result
          const place  = autocomplete.getPlace();
          this.property.formatted_address= place.formatted_address;
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
        }); 
      });
    });
  }

  checkEmail(){
    debugger
    const apiUrl="http://localhost:3000/"+"checkEmail"
    let data = new Object( {email:this.property.email})
    this.apiService.Post(apiUrl,data).subscribe(res=>{
      if(res.length==0){
        this._snackBar.open("Email Not Found","",{
          duration:2000,
        });
      }else{
        this.emailExists=false;
      }
    });
  }

  submitData(){
    debugger;
  const apiUrl="http://localhost:3000/"+"insertProperty"
    this.property.house_list = this.houseList.split("\n");
    this.apiService.Post(apiUrl,this.property).subscribe(res=>{
      if(res){
        this._snackBar.open("data Saved Successfully","",{
          duration:2000,
        });
        this.property=new PropertyModel();
        this.houseList="";
        this.emailExists=true;
      }
    });
  }
  
}

export class PropertyModel {
  email: string;
  formatted_address: string;
  house_list:string[];
}
