import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';

@Injectable({
    providedIn: 'root'
})
export class CoreServices {
    API_URL = GLOBAL.url;
    constructor(
        private http: HttpClient
    ) { }
     getUsers(): Observable<any> {
        const href = this.API_URL + 'user/';
        const requestUrl = `${href}`;
        return this.http.get<any>(requestUrl);
    }

    saveUser(user: any): Observable<any> {
        console.log('user :>> ', user);
        const href = this.API_URL + 'user/create';
        const requestUrl = `${href}`;
        return this.http.post<any>(requestUrl, user);
    }

    deleteUser(user: any): Observable<any> {
        const href = this.API_URL + 'user/';
        const requestUrl = `${href}`;
        return this.http.delete<any>(requestUrl, user);
    }

    getUser(user: any): Observable<any> {
        const href = this.API_URL + 'user/'+user;
        const requestUrl = `${href}`;
        return this.http.get<any>(requestUrl);
    }

    updateUser(user:any, userId:any){
        console.log('user :>> ', user);
        const href = this.API_URL + 'user/edit/'+userId;
        const requestUrl = `${href}`;
        return this.http.put<any>(requestUrl, user);
    }
}
