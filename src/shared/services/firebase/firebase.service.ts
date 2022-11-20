import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class FirebaseService {
    public firebase;
    constructor() {
        this.firebase = admin;
    }
    initialize() {
        admin.initializeApp({
            credential: admin.credential.cert('./firebase.json')
        })
    }
    async generateCookie(token: string, expiresIn: number): Promise<string> {
        const cookie = await admin.auth().createSessionCookie(token,{expiresIn: expiresIn});
        return cookie;
    }
    async retriveUserByToken(token: string): Promise<DecodedIdToken> {
        const user = await admin.auth().verifyIdToken(token,true);
        return user;
    }
    async validateToken(token: string) {
        const user = await admin.auth().verifySessionCookie(token,true);
        return user;
    }
}
