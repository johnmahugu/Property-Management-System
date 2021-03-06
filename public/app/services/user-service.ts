import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../models/user-model'

@Injectable()
export class UserService{
    constructor(private http: Http){

    }

    getAll(){
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: string){

    }

    getByFacebookAuthToken(facebookAuthToken: string){
        return this.http.post('/api/getUserByFacebookAuthToken', {facebookAuthToken}, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User){
        return this.http.post('/api/users', user, this.jwt()).map((response: Response) => response.json());
    }

    changeImage(user: User, imgUrl: string) {
        user.imgUrl = imgUrl;
        return this.http.post('/api/change-image', user, this.jwt()).map((response: Response) => response.json());
    }

    addTask(username: string, task: any) {
        return this.http.post('/api/addTask', {username, task}, this.jwt()).map((response: Response) => response.json());
    }

    private jwt() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}