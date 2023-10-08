import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavAppBar from "@/components/NavAppBar";
import NextAuthProvider from '@/providers/NextAuth'
import { Box } from '@mui/material';

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
                minHeight: "calc(100%)",
                backgroundColor: "#e0e0e3",
            }}>
                {/* <div className={inter.className}> */}
                <NextAuthProvider>
                    <NavAppBar />
                    <Box sx={{
                        width: "100%",
                        bgcolor: "#fff",
                        height: "64px",
                        // mt: "-64px",
                    }}>
                    </Box>
                    <Box maxWidth="xl" sx={{
                        display: "flex",
                        pt: 5,
                        minHeight: "calc(100% - 64px - 5 * 8px )",
                        bgcolor: "#fff",
                        mx: "auto",
                    }}
                    >
                        <Box flexGrow={1} 
                        >
                            {children}
                        </Box>
                    </Box>
                </NextAuthProvider>
                {/* </div> */}
            </body>
        </html>
    )
}
