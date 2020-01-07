import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';


export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class RegisterService {
  private userList: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;
  constructor(database: AngularFirestore) {
    this.userList = database.collection<User>('users');
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

  async attemptRegistration(user: User): Promise<boolean> {
    let goodRegistration = true;
    const docRef = this.userList.doc(user.username);
    const promise = docRef.get().toPromise().then((doc) => {
      if (doc.exists) {
        goodRegistration = false;
      } else {
        this.userList.doc(user.username).set(user);
      }
    });
    await promise;
    return goodRegistration;
  }
}

