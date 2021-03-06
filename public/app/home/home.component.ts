import { ChatService } from '../services/chat-service';
import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from '../../node_modules/ng2-facebook-sdk/dist/ng2-facebook-sdk.js';
import { User } from '../models/user-model'
import { UserService } from '../services/user-service';
import { CondominiumService } from '../services/condominium-service'
import { ApartmentService } from '../services/apartment-service'
import { ProtocolService } from '../services/protocol-service'
import {ManagerUnionService} from '../services/managerUnion-service'
import { AuthenticationService } from '../services/authentication-service';
import { AlertService} from '../services/alert-service';
import {ControlUnionService} from '../services/controlUnion-service'
import {TownshipMessageService} from '../services/townshipMessage-service'

declare var $: JQueryStatic;

@Component({
    selector: 'app',
    templateUrl: 'app/home/home.component.html',
    styles: [`
        .pointer-mouse {
            cursor: pointer;
        }
    `]
})

export class HomeComponent {
    isLogged: boolean = false;
    isManager: boolean = false;
    username: string;
    user: any;
    newImgUrl: string;
    apartments: any[];
    condominium: any;
    showApartment: boolean = false;
    showingApartment: any;
    protocols: any[];
    showProtocol: boolean = false;
    showingProtocol: any;
    showUnion: boolean = false;
    unionType: string;
    union: any;
    townshipMessages: any;

    constructor(private userService: UserService,
        private chatService: ChatService,
        private fb: FacebookService,
        private route: ActivatedRoute,
        private router: Router,
        private condominiumService: CondominiumService,
        private apartmentService: ApartmentService,
        private protocolService: ProtocolService,
        private managerUnionService: ManagerUnionService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private controlUnionService: ControlUnionService,
        private townshipMessageService: TownshipMessageService) {
            console.log(localStorage.getItem('currentUser'));
        if (localStorage.getItem('currentUser') != undefined) {
            this.isLogged = true;
            let userNow: User = JSON.parse(localStorage.getItem('currentUser'));
            this.authenticationService.login(userNow.username, userNow.password)
                .subscribe(
                data => {
                },
                error => {
                    console.log("From error");
                    this.alertService.error('Your cerdenials are not valid please log in again', true);
                    localStorage.removeItem('currentUser');
                    this.router.navigateByUrl('/login');
                });
        } else {
            this.isLogged = false;
        }

        let fbParams: FacebookInitParams = {
            appId: '1064731376969661',
            xfbml: true,
            version: 'v2.6'
        };
        this.fb.init(fbParams);

        this.newImgUrl = '';
    }
    loadTownshipMessages(){
        console.log("Township messages");
        this.townshipMessageService.getByProperties(this.user).subscribe(
            data => {
                console.log("Successfully get township messages");
                this.townshipMessages = data;
                console.log(this.townshipMessages);
            },
            err => {
                console.log("Cannot get township messages");
            }
        );
    }
    sendTownshipMessage(){
        let title = $("#townshipTitle").val();
        let content = $("#townshipMessage").val();
        $("#townshipTitle").val("");
        $("#townshipMessage").val("");

        let msg = {
            from: this.user,
            title: title,
            content: content
        }

        this.townshipMessageService.create(msg).subscribe(
            d => {
                console.log("create township message");
                console.log(d);
                this.townshipMessageService.getByProperties(this.user).subscribe(
                    data => {
                        console.log("Successfully get township messages");
                        this.townshipMessages = data;
                        console.log(this.townshipMessages);
                    },
                    err => {
                        console.log("Cannot get township messages");
                    }
                );
            },
            err => {
                console.log("Cannot create township message");
            }
        );
    }
    addMemberToControlUnion(){
        console.log("Add member to control union");
        let name = $('#memberControlName').val();
        let isAddedThisUser:any = false;

        if(this.union.leader != undefined && this.union.leader.username === name){
            isAddedThisUser = true;
        }
        for(let i = 0; i < this.union.members.length;i++){
            console.log(this.union.members[i]);
            if(this.union.members[i].username === name){
                isAddedThisUser = true;
            }
        }

        if(!isAddedThisUser){
            console.log("Search");
            let prop = {
                floatNumber: this.user.flatNumber,
                entrance: this.user.exitNumber,
                city: this.user.city,
                neighborhood: this.user.neighborhood
            };
            let member = {
                username: name
            };
            this.controlUnionService.addMemberToControlUnion(prop, member).subscribe(
                data => {
                    console.log("Successfully added memeber to controlUnion");
                    this.union = data;
                },
                err => {
                    console.log("Cannot add control to union");
                }
            );
        }
    }
    changeLeader(){
        let name = $('#leaderName').val();
        let isAddedThisUser:any = false;

        if(this.union.leader != undefined && this.union.leader.username === name){
            isAddedThisUser = true;
        }

        for(let i = 0; i < this.union.members.length;i++){
            if(this.union.members[i].username === name){
                isAddedThisUser = true;
            }
        }
        if(!isAddedThisUser){
            let prop = {
                floatNumber: this.user.flatNumber,
                entrance: this.user.exitNumber,
                city: this.user.city,
                neighborhood: this.user.neighborhood
            };
            let leader = {
                username: name
            };
            this.controlUnionService.changeLeaderName(prop, leader).subscribe(
                data => {
                    this.union = data;
                },
                err => {
                    console.log("Error change leader");
                }
            );
        }
    }
    onApartmentTableClick(index: any) {
        console.log("Apartment click");
        this.showingApartment = this.apartments[index];
        this.showApartment = true;
    }
    onProtocolTableClick(index: any) {
        this.showingProtocol = this.protocols[index];
        this.showProtocol = true;
    }
    onProtocolsClick() {
        this.protocolService.getByProperties(this.user).subscribe(
            data => {
                this.protocols = data;
                console.log("Protocols");
                console.log(this.protocols);
            },
            err => {
                console.log("Cannot get protocols");
            }
        );
    }
    onControlUnionClick(){
        this.showUnion = true;
        this.unionType = "control";
        let prop = {
            floatNumber: this.user.flatNumber,
            entrance: this.user.exitNumber,
            city: this.user.city,
            neighborhood: this.user.neighborhood
        };

        this.controlUnionService.getByProperties(prop).subscribe(
            data => {
                console.log("Get control union");
                console.log(data);
                this.union = data;
            },
            err => {
                let arr: any = [];
                let p = {
                    leader: {
                        username: 'Неизвестен'
                    },
                    members: arr,
                    floatNumber: this.user.flatNumber,
                    entrance: this.user.exitNumber,
                    city: this.user.city,
                    neighborhood: this.user.neighborhood
                };
                console.log("Error get ControlUnion");
                this.controlUnionService.create(p).subscribe(
                    data => {
                        console.log("Created control union");
                        console.log(data);
                        this.union = data;
                    },
                    err => {
                        console.log("Cannot create control union");
                    }
                );
            }
        );
    }
    changeCashier(){
        let name = $('#cashierName').val();
        let isAddedThisUser:any = false;

        if(this.union.manager != undefined && this.union.manager.username === name){
            isAddedThisUser = true;
        }

        if(this.union.cashier != undefined && this.union.cashier.username === name){
            isAddedThisUser = true;
        }

        for(let i = 0; i < this.union.members.length;i++){
            if(this.union.members[i].username === name){
                isAddedThisUser = true;
            }
        }
        if(!isAddedThisUser){
            let prop = {
                floatNumber: this.user.flatNumber,
                entrance: this.user.exitNumber,
                city: this.user.city,
                neighborhood: this.user.neighborhood
            };
            let cashier = {
                username: name
            };
            this.managerUnionService.changeCashierName(prop, cashier).subscribe(
                data => {
                    this.union = data;
                },
                err => {
                    console.log("Error change cashier");
                }
            );
        }
    }
    addMemberToManagerUnion(){
        let name = $('#memberName').val();
        let isAddedThisUser:any = false;

        if(this.union.manager != undefined && this.union.manager.username === name){
            isAddedThisUser = true;
        }

        if(this.union.cashier != undefined && this.union.cashier.username === name){
            isAddedThisUser = true;
        }

        for(let i = 0; i < this.union.members.length;i++){
            console.log(this.union.members[i]);
            if(this.union.members[i].username === name){
                isAddedThisUser = true;
            }
        }

        if(!isAddedThisUser){
            let prop = {
                floatNumber: this.user.flatNumber,
                entrance: this.user.exitNumber,
                city: this.user.city,
                neighborhood: this.user.neighborhood
            };
            let member = {
                username: name
            };
            this.managerUnionService.addMemberToManagerUnion(prop, member).subscribe(
                data => {
                    console.log("Successfully added memeber to managerUnion");
                    this.union = data;
                },
                err => {
                    console.log("Cannot add manager to union");
                }
            );
        }
    }
    onManagerUnionClick(){
        this.showUnion = true;
        this.unionType = "manager";
        let prop = {
            floatNumber: this.user.flatNumber,
            entrance: this.user.exitNumber,
            city: this.user.city,
            neighborhood: this.user.neighborhood
        };

        this.managerUnionService.getByProperties(prop).subscribe(
            data => {
                this.union = data;
            },
            err => {
                let arr: any = [];
                let p = {
                    cashier: {
                        username: 'Неизвестен'
                    },
                    manager: this.user,
                    members: arr,
                    floatNumber: this.user.flatNumber,
                    entrance: this.user.exitNumber,
                    city: this.user.city,
                    neighborhood: this.user.neighborhood
                };
                console.log("Error get managerUnion");
                this.managerUnionService.create(p).subscribe(
                    data => {
                        console.log("Created manager union");
                        this.union = data;
                    },
                    err => {
                        console.log("Cannot create manager union");
                    }
                );
            }
        );
    }
    returnUnionPage(){
        console.log("Exit union.");
        this.showUnion = false;
    }
    returnApartmentPage() {
        this.showApartment = false;
    }

    returnProtocolPage() {
        this.showProtocol = false;
    }

    ngAfterViewInit() {
        this.apartments = [];
        this.condominiumService.getByProperties(this.user).subscribe(
            data => {
                for (let i = 0; i < data.apartments.length; i++) {
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
        //setPopup();
    }
    ngOnInit() {
        console.log("OnInit");
        if (localStorage.getItem('currentUser')) {
            this.isLogged = true;
            this.user = JSON.parse(localStorage.getItem('currentUser'));
            this.isManager = this.user.manager;
            this.username = this.user.username;
            var activeEl = 0;
            //Setting defalt image
            this.user.imgUrl = this.user.imgUrl || 'https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg';

            $(function () {
                var items = $('.btn-nav');
                $(items[activeEl]).addClass('active');
                $(".btn-nav").click(function () {
                    $(items[activeEl]).removeClass('active');
                    $(this).addClass('active');
                    activeEl = $(".btn-nav").index(this);
                });
            });
            console.log("LOADED");
        } else {
            this.isLogged = false;
        }
    }

    ngOnChange() {
        console.log("OnChange");
        if (localStorage.getItem('currentUser')) {
            this.isLogged = true;
        } else {
            this.isLogged = false;
        }
    }

    uploadImageClick() {
        this.userService.changeImage(this.user, this.newImgUrl)
            .subscribe(
            (newUser: User) => {
                console.log('Upload Image')
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                this.user.imgUrl = newUser.imgUrl;
                this.newImgUrl = '';
                this.chatService.getOnlineUsers(newUser.username, newUser.imgUrl);
            },
            error => {
                console.log("Upload error");
                console.log(error);
                //this.alertService.error(error);
                //this.loading = false;
            });
    }

    logout() {
        console.log("Test");
        const username = JSON.parse(localStorage.getItem('currentUser')).username;
        localStorage.removeItem('currentUser');
        this.isLogged = false;
        this.chatService.logoutUser(username);
    }

    facebookLoginClick(): void {
        this.fb.login().then(
            (response: FacebookLoginResponse) => {
                console.log("Facebook response");
                console.log(response)

                if (response.status === 'connected') {
                    localStorage.setItem('facebookAuthToken', response.authResponse.userID);
                    this.router.navigateByUrl('/login/facebook')
                }
            },
            (error: any) => {
            }
        );
    }
    createProtocol() {
        let number = $("#login_username").val();
        let content = $("#login_password").val();
        let date = Date.now();
        var today: any = new Date();
        var dd: any = today.getDate();
        var mm: any = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '/' + mm + '/' + yyyy;

        console.log(number + " " + content + " " + today);
        $(".close").click();
        let properties = {
            number: number,
            content: content,
            date: today,
            floatNumber: this.user.flatNumber,
            entrance: this.user.exitNumber,
            city: this.user.city,
            neighborhood: this.user.neighborhood
        }

        Promise.resolve(this.protocolService.create(properties).subscribe(
            function (data: any) {
                console.log(data);
            },
            function (err: any) {
                console.log("Cannot create protocol");
            }
        )).then(() => {
            this.protocolService.getByProperties(this.user).subscribe(
                data => {
                    this.protocols = data;
                    console.log("Protocols");
                    console.log(this.protocols);
                },
                err => {
                    console.log("Cannot get protocols");
                }
            );
        });

    }
}
function setPopup() {
    var $formLogin = $('#login-form');
    var $formLost = $('#lost-form');
    var $formRegister = $('#register-form');
    var $divForms = $('#div-forms');
    var $modalAnimateTime = 300;
    var $msgAnimateTime = 150;
    var $msgShowTime = 2000;

    $('#login_register_btn').click(function () { modalAnimate($formLogin, $formRegister) });
    $('#register_login_btn').click(function () { modalAnimate($formRegister, $formLogin); });
    $('#login_lost_btn').click(function () { modalAnimate($formLogin, $formLost); });
    $('#lost_login_btn').click(function () { modalAnimate($formLost, $formLogin); });
    $('#lost_register_btn').click(function () { modalAnimate($formLost, $formRegister); });
    $('#register_lost_btn').click(function () { modalAnimate($formRegister, $formLost); });

    function modalAnimate($oldForm: any, $newForm: any) {
        var $oldH = $oldForm.height();
        var $newH = $newForm.height();
        $divForms.css("height", $oldH);
        $oldForm.fadeToggle($modalAnimateTime, function () {
            $divForms.animate({ height: $newH }, $modalAnimateTime, function () {
                $newForm.fadeToggle($modalAnimateTime);
            });
        });
    }

    function msgFade($msgId: any, $msgText: any) {
        $msgId.fadeOut($msgAnimateTime, function () {
            $(this).text($msgText).fadeIn($msgAnimateTime);
        });
    }

    function msgChange($divTag: any, $iconTag: any, $textTag: any, $divClass: any, $iconClass: any, $msgText: any) {
        var $msgOld = $divTag.text();
        msgFade($textTag, $msgText);
        $divTag.addClass($divClass);
        $iconTag.removeClass("glyphicon-chevron-right");
        $iconTag.addClass($iconClass + " " + $divClass);
        setTimeout(function () {
            msgFade($textTag, $msgOld);
            $divTag.removeClass($divClass);
            $iconTag.addClass("glyphicon-chevron-right");
            $iconTag.removeClass($iconClass + " " + $divClass);
        }, $msgShowTime);
    }
}
