import {Component} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import {FacebookService, FacebookLoginResponse, FacebookInitParams} from '../../node_modules/ng2-facebook-sdk/dist/ng2-facebook-sdk.js';
import {User} from '../models/user-model'
import { UserService } from '../services/user-service';
import {CondominiumService} from '../services/condominium-service'
import {ApartmentService} from '../services/apartment-service'

declare var $:JQueryStatic;

@Component({
    selector: 'app',
    templateUrl: 'app/home/home.component.html',
    styles: [`
        .pointer-mouse {
            cursor: pointer;
        }
    `]
})

export class HomeComponent{
    isLogged: boolean = false;
    isManager: boolean = false;
    username: string;
    user: User;
    newImgUrl: string;
    apartments: any;
    condominium: any;
    showApartment: boolean = false;
    showingApartment: any;

    constructor(private userService: UserService, 
                private fb: FacebookService,
                private route: ActivatedRoute,
                private router: Router,
                private condominiumService:CondominiumService,
                private apartmentService:ApartmentService){
        if(localStorage.getItem('currentUser') != undefined){
            this.isLogged = true;
        }else{
            this.isLogged = false;
        }
        console.log(localStorage.getItem('currentUser'));

        let fbParams: FacebookInitParams = {
                                   appId: '1064731376969661',
                                   xfbml: true,
                                   version: 'v2.6'
                                   };
        this.fb.init(fbParams);

        this.newImgUrl = '';
    }
    onApartmentTableClick(index: any){
        this.showingApartment = this.apartments[index];
        this.showApartment = true;
    }

    returnApartmentPage(){
        this.showApartment = false;
    }
    
    ngAfterViewInit(){
        this.apartments = [];
            this.condominiumService.getByProperties(this.user).subscribe(
                data => {
                    for(let i = 0; i < data.apartments.length; i++){
                        this.apartmentService.getByProperties(data.apartments[i]).subscribe(
                            data => {
                                console.log(data);
                                this.apartments.push(data);
                            },
                            err => {
                                console.log("Cannot get apartment");
                            }
                        );
                    }
                    this.condominium = data;
                },
                err => {
                    console.log("Error in home get condominium");
                }
            );
    }
    ngOnInit(){
        console.log("OnInit");
        if(localStorage.getItem('currentUser')){
            this.isLogged = true;
            this.user = JSON.parse(localStorage.getItem('currentUser'));
            this.isManager = this.user.manager;
            this.username = this.user.username;
            var activeEl = 0;
            //Setting defalt image
            this.user.imgUrl = this.user.imgUrl || 'https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg';

            $(function() {
                var items = $('.btn-nav');
                $( items[activeEl] ).addClass('active');
                $( ".btn-nav" ).click(function() {
                    $( items[activeEl] ).removeClass('active');
                    $( this ).addClass('active');
                    activeEl = $( ".btn-nav" ).index( this );
                });
            });
            console.log("LOADED");
        }else{
            this.isLogged = false;
        }
    }

    ngOnChange(){
        console.log("OnChange");
        if(localStorage.getItem('currentUser')){
            this.isLogged = true;
        }else{
            this.isLogged = false;
        }
    }

    uploadImageClick() {
        this.userService.changeImage(this.user, this.newImgUrl)
            .subscribe(
            (newUser: User) => {
                    console.log('Upload Image')
                    console.log(newUser)
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    this.user.imgUrl = newUser.imgUrl;
                    this.newImgUrl = '';
                },
                error => {
                    console.log("Upload error");
                    console.log(error);
                    //this.alertService.error(error);
                    //this.loading = false;
                });
    }

    logout(){
        console.log("Test");
        localStorage.removeItem('currentUser');
        this.isLogged = false;
    }

    facebookLoginClick(): void {
        this.fb.login().then(
            (response: FacebookLoginResponse) => {
                console.log("Facebook response");
                console.log(response)

                if(response.status === 'connected') {
                    localStorage.setItem('facebookAuthToken', response.authResponse.userID);
                    this.router.navigateByUrl('/login/facebook')
                }
            },
            (error: any) => {
            }
        );
    }
}
