import { MapsAPILoader } from '@agm/core';
import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from "./api.service";
import { DialogComponent } from './dialog/dialog.component';

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
  emailExists:boolean=true;
  emailError:boolean=false;
  allowHouse:boolean=false;
  showSpinner:boolean=false;
  property: PropertyModel;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,private ngZone: NgZone , private _snackBar: MatSnackBar, private apiService: ApiService
    ,public dialog: MatDialog) 
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
          let splitted= this.property.formatted_address.split(" ");
          if(_isNumberValue(splitted[0])){
            this.allowHouse=false;
          }else{
            this.allowHouse=true;
          }
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
    const apiUrl="https://prop-hunt.herokuapp.com/"+"checkEmail"
    let data = new Object( {email:this.property.email})
    this.showSpinner=true;
    this.apiService.Post(apiUrl,data).subscribe(res=>{
      this.showSpinner=false;
      if(res.length==0){
        this.emailError=true;
        this.emailExists=true;
        // this._snackBar.open("Email Not Found","",{
        //   duration:2000,
        // });
      }else{
        this.emailExists=false;
        this.emailError=false;
        setTimeout(()=>{ // this will make the execution after the above boolean has changed
          this.searchElementRef.nativeElement.focus();
        },0);  
        this.searchElementRef.nativeElement.focus();
      }
    });
  }

  submitDataOnEnter(){
    debugger;
  const apiUrl="https://prop-hunt.herokuapp.com/"+"insertProperty"
    this.property.house_list = this.houseList.split("\n");
    let tempList= [];
    tempList.push(this.property.house_list[this.property.house_list.length-2]);
    this.property.house_list= tempList;
    this.showSpinner=true;
    this.apiService.Post(apiUrl,this.property).subscribe(res=>{
      this.showSpinner=false;
      if(res){
        // this.dialog.open(DialogComponent,{ width: '250px'});
        this._snackBar.open("data Saved Successfully","",{
          duration:2000,
        });
        // this.searchElementRef.nativeElement.value='';
        // this.property=new PropertyModel();
        // this.houseList="";
        // this.emailExists=true;
      }
    });
  }
  submitData(){
    debugger;
  const apiUrl="https://prop-hunt.herokuapp.com/"+"insertProperty"
    this.property.house_list = this.houseList.split("\n");
    this.showSpinner=true;
    this.apiService.Post(apiUrl,this.property).subscribe(res=>{
      this.showSpinner=false;
      if(res){
        this.dialog.open(DialogComponent,{ width: '250px'});
        // this._snackBar.open("data Saved Successfully","",{
        //   duration:2000,
        // });
        this.searchElementRef.nativeElement.value='';
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
