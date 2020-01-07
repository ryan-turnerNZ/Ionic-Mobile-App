import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PasswordService} from '../passwords/password.service';


/**
 * This object represents the user and stores their name and password
 */
export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

/**
 * This service allows a user to login/logout of their account
 */
export class LoginService {

  private userList: AngularFirestoreCollection<User>;
  private readonly users: Observable<User[]>;
  private loggedInUser: User = null;

  /**
   * This constructor creates a connection to the firestore database.
   *
   * @param database The Firestore database
   * @param passwordService The password service associated with the user
   */
  constructor(database: AngularFirestore, private passwordService: PasswordService) {
    // Connects to the collection where users ar e stored
    this.userList = database.collection<User>('users');

    // This nested function creates a snapshot of all user documents in the collection
    this.users = this.userList.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );
  }


  /**
   * Returns the logged in user
   */
  getLoggedInUser() {
    return this.loggedInUser;
  }

  /**
   * This method attempts to log a user into the application.
   * It checks that a document with the users username as an ID
   * is present in the collection of users in the database
   *
   * @param user The user attempting to be logged in
   */
  async loginUser(user: User) {
    const docRef = this.userList.doc(user.username);
    const promise = docRef.get().toPromise().then((doc) => {
      if (doc.exists && (doc.data() as User).password === user.password) {
        this.loggedInUser = user;
        this.passwordService.setUser(this.loggedInUser);
      } else {
        this.loggedInUser = null;
      }
    });
    await promise;
  }

  /**
   * Removes the reference to the logged in user, effectively logging them out
   * also informs the password service that the user is no longer logged in
   */
  logoutUser() {
    this.passwordService.setUser(null);
    this.loggedInUser = null;
  }

  /**
   * Attempts to change a users password to a new value.
   * Checks that the users document is present in the collection before updating the
   * password value in that document
   *
   * @param user User attemtping to change their password
   * @param newPassword The password they are trying to change to
   */
  async attemptChangeDetails(user: User, newPassword: string) {
    const docRef = this.userList.doc(user.username);
    const promise = docRef.get().toPromise().then((doc) => {
      if (doc.exists && (doc.data() as User).password === user.password) {
        this.userList.doc(user.username).update({
          password: newPassword
        });
      }
    });
    await promise;
  }

  /**
   * Deletes all passwords associate with the User with the
   * password service then deletes the user from the
   * collection of users
   */
  async deleteUser() {
    this.passwordService.deleteAllPasswords();
    const docRef = this.userList.doc(this.loggedInUser.username);
    const promise = docRef.get().toPromise().then((doc) => {
      docRef.delete();
    });
    await promise;
  }
}

