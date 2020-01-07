import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../login/login.service';


export interface Password {
    passwordName: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})

/**
 * This service connects to the firestore database
 * and accesses the collection of passwords associated with the
 * logged in user. Also provides method allowing for the
 * adding, editing, and deletion of these passwords
 */
export class PasswordService {
    private passwordList: AngularFirestoreCollection<Password>;
    private passwords: Observable<Password[]>;
    private user: User;



    constructor(private database: AngularFirestore) {}

    /**
     * This methods creates a connection to the firestore database. It accessed the sub-collection of passwords
     * that are associated with the user. This is in a method as opposed to the constructor as it needs to be called
     * when a new user logs in.
     */
    private createConnection() {
        this.passwordList = this.database.collection<User>('users').doc(this.user.username).collection<Password>('passwords');
        this.passwords = this.passwordList.snapshotChanges().pipe(
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
     * Sets the currently logged in user for the
     * password service to use. Calls the create
     * connection method to subscribe to the users
     * collection of passwords
     *
     * @param user The currently logged in user
     */
    setUser(user: User) {
        this.user = user;
        if (user !== null) {
            this.createConnection();
        }
    }

    /**
     * Retrieves all the passwords associated with the user
     * and returns them as a Promise that contains an array
     * of Passwords
     */
    async getPasswords(): Promise<Password[]> {
        const list: Password[] = [];
        await this.passwordList.get().toPromise().then((snapshot) => {
            snapshot.forEach((doc) => {
                list.push(doc.data() as Password);
            });
        });
        return list;
    }

    /**
     * Attempts tp update a given passwords document with a new password field.
     * This method first ensures that the password document exists
     *
     * @param password The password to be updates. Contains the new password within its
     * password field
     */
    async attemptUpdatePassword(password: Password) {
        let goodPassword = true;
        const docRef = this.passwordList.doc(password.passwordName);
        const promise = docRef.get().toPromise().then((doc) => {
            if (doc.exists) {
                if ((doc.data()as Password).passwordName === password.passwordName) {
                    this.passwordList.doc(password.passwordName).set(password);
                    goodPassword = true;
                } else {
                    goodPassword = false;
                }
            } else {
                goodPassword = false;
            }
        });
        await promise;
        return goodPassword;
    }

    /**
     * Removes a password from the users collection of password documents
     *
     * @param password The password to be deleted
     */
    async deletePassword(password: Password) {
        await this.passwordList.doc(password.passwordName).delete();
    }

    /**
     * Attempts to save a new password document to the users collection of
     * documents. First checks that the document doesnt already exist.
     * Returns a Promise containing a boolean that represents the success
     * or failure of the attempted password save.
     *
     * @param password The password to be saved
     */
    async attemptPasswordSave(password: Password): Promise<boolean> {
        let goodPassword = true;
        const docRef = this.passwordList.doc(password.passwordName);
        const promise = docRef.get().toPromise().then((doc) => {
            if (doc.exists) {
                goodPassword = false;
            } else {
                goodPassword = true;
                this.passwordList.doc(password.passwordName).set(password);
            }
        });
        await promise;
        return goodPassword;
    }

    /**
     * Removes all passwords associated with a the logged in user.
     * This is used when deleting an account as sub-collections
     * are not automatically deleted.
     */
    async deleteAllPasswords() {
        const list = this.getPasswords();
        list.then((result) => {
            for (const pass of result) {
                this.passwordList.doc(pass.passwordName).delete();
            }
        });
    }
}

