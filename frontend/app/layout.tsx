import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavAppBar from "@/components/NavAppBar";
import NextAuthProvider from '@/providers/NextAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'MWSCup Market',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Gemunu+Libre&family=Ubuntu+Mono&display=swap" rel="stylesheet" />
            </head>
            <body style={{
                height: "calc(100% - 64px)",
            }}>
                {/* <div className={inter.className}> */}
                <NextAuthProvider>
                    <NavAppBar />
                    {children}
                </NextAuthProvider>
                {/* </div> */}
            </body>
        </html>
    )
}
