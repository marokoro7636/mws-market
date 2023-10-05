import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth'

if (!getApps()?.length) {
    initializeApp();
}

export const adminDB = getFirestore()
export const adminAuth = getAuth()