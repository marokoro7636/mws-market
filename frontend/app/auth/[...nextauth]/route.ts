import NextAuth from "next-auth"
import SlackProvider from "next-auth/providers/slack"
import { FirestoreAdapter } from "@auth/firebase-adapter"

import { adminAuth } from "@/firebase-admin.config"
import { adminDB } from "@/firebase-admin.config"

const sha1 = (text: string): string => {
    const crypto = require('crypto');
    const shasum = crypto.createHash('sha1');
    shasum.update(text);
    return shasum.digest('hex');
}

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        SlackProvider({
            clientId: <string>process.env.SLACK_ID,
            clientSecret: <string>process.env.SLACK_SECRET
        })
    ],
    adapter: FirestoreAdapter(),
    session: {
        strategy: "jwt"
    },
    callbacks: {
        jwt: async ({ token, account }) => {
            // console.log({ token, account })
            if (account && account.id_token) {
                const access_token = sha1(`${Date.now()}` + account.id_token)
                const uid = token.sub
                token.access_token = access_token
                adminDB.collection("session2uid").doc(access_token).set({ uid: uid })
                const docRef = adminDB.collection("users").doc(uid as string)
                const userInfo = (await docRef.get()).data()
                if (userInfo && userInfo.access_token) {
                    adminDB.collection("session2uid").doc(userInfo.access_token).delete()
                }
                adminDB.collection("users").doc(uid as string).update({
                    access_token: access_token
                })
            }
            return token
        },
        session: async ({ session, token, user }) => {
            // console.log({ token, session, user })
            if (token && token.access_token === 'string') {
                session.access_token = token.access_token
            }
            return session
        }
    },
})

export { handler as GET, handler as POST }