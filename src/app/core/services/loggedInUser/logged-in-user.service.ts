import { Injectable } from '@angular/core';
import { IUser } from '../../classes/user.class';
import { Subject } from 'rxjs';
import { NavigationService } from '../navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedInUserService {
  $loggedInUserUpdated = new Subject<any>();
  $languageChanged = new Subject<any>();
  loggedInUser: IUser = null;
  listNavItems: any[] = [];
  public flags = [
    { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es', abbreviation: 'esp' },
    { name: 'Inglés', image: 'assets/images/flags/en.svg', lang: 'en', abbreviation: 'eng' },
    { name: 'Francés', image: 'assets/images/flags/fr.svg', lang: 'fr', abbreviation: 'fra' },
  ];

  constructor(private navigationService: NavigationService) {
    const data = localStorage.getItem('user');
    if (data) {
      this.loggedInUser = JSON.parse(data);
    }
  }

  public setNewProfile(profile) {
    let dataValue = JSON.parse(localStorage.getItem('user'));
    dataValue.profile = Object.assign(dataValue.profile, profile);
    localStorage.setItem('user', JSON.stringify(dataValue));
    this.loggedInUser = dataValue;
    this.$loggedInUserUpdated.next(this.loggedInUser);
  }

  public getLanguage() {
    return JSON.parse(localStorage.getItem('language'));
  }

  public getLoggedInUser(): any {
    let data = JSON.parse(localStorage.getItem('user'));
    data = data ? data.profile : null;
    return data;
  }
  public getTokenOfUser(): any {
    let data = JSON.parse(localStorage.getItem('user'));
    data = data ? data.Authorization : null;
    return data;
  }

  public setLoggedInUser(user: any) {
    this.loggedInUser = user;
  }

  public updateUserProfile(user) {
    let dataString: string;
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    const tempdata = this.loggedInUser ? this.loggedInUser : {};
    if (user) {
      this.loggedInUser = Object.assign(tempdata, user);
    } else {
      this.loggedInUser = null;
    }
    dataString = JSON.stringify(this.loggedInUser);
    localStorage.setItem('user', dataString);
    this.$loggedInUserUpdated.next(this.loggedInUser);
  }

  public isAdminUser() { return true;
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    user.roles.map((item) => {
      if (item.type === 'Admin') {
        flag = true;
        return true;
      }
    });
    return flag;
  }


  public getlaguages() {
    return this.flags;
  }
}
