import NextAuth from "next-auth"
import SlackProvider from "next-auth/providers/slack"
import CredentialsProvider from 'next-auth/providers/credentials';
import { FirestoreAdapter } from "@auth/firebase-adapter"

import { adminAuth } from "@/firebase-admin.config"
import { adminDB } from "@/firebase-admin.config"

const sha1 = (text: string): string => {
    const crypto = require('crypto');
    const shasum = crypto.createHash('sha1');
    shasum.update(text);
    return shasum.digest('hex');
}

const issueToken = async (uid: string, access_token: string) => {
    adminDB.collection("session2uid").doc(access_token).set({ uid: uid })
    const docRef = adminDB.collection("users").doc(uid as string)
    const userInfo = (await docRef.get()).data()
    if (userInfo && userInfo.access_token !== access_token) {
        adminDB.collection("session2uid").doc(userInfo.access_token).delete()
        adminDB.collection("users").doc(uid as string).update({
            access_token: access_token
        })
    }
}

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        SlackProvider({
            clientId: <string>process.env.SLACK_ID,
            clientSecret: <string>process.env.SLACK_SECRET
        }),
        CredentialsProvider({
            name: "TestLogin",
            credentials: {
                username: { label: "ユーザー名", type: "text", placeholder: "ユーザー名のみで試用できます" },
            },
            authorize: async (credentials, req) => {
                if (!credentials?.username) {
                    return null
                }
                const uid = "ANONIMOUS-" + sha1(credentials?.username)
                const user = (await adminDB.collection("users").doc(uid).get())
                const access_token = sha1(process.env.NEXTAUTH_SECRET + uid)
                const userInfo = {
                    id: uid,
                    name: credentials?.username,
                    email: "test@mws2023.pfpf.dev",
                    image: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${sha1(uid).slice(0, 10)}`,
                    access_token: access_token,
                }
                if (!user.exists) {
                    user.ref.set(userInfo)
                }
                return userInfo
            }
        }),
    ],
    adapter: FirestoreAdapter(),
    session: {
        strategy: "jwt"
    },
    callbacks: {
        jwt: async ({ token, account }) => {
            // console.log({ token, account })
            const uid = token.sub
            if (account?.provider === "slack") {
                const access_token = sha1(process.env.NEXTAUTH_SECRET as string + `${Date.now()}` + account?.id_token)
                token.access_token = access_token
                token.uid = uid
                issueToken(uid as string, access_token)
            }
            if (account?.provider === "credentials") {
                const access_token = sha1(process.env.NEXTAUTH_SECRET as string + uid)
                token.access_token = access_token
                token.uid = uid
                issueToken(uid as string, access_token)
            }
            return token
        },
        session: async ({ session, token, user }) => {
            if (token && token.access_token && token.uid) {
                session.access_token = token.access_token as string
                session.uid = token.uid as string
            }
            // console.log({ token, session, user })
            return session
        }
    },
})

export { handler as GET, handler as POST }