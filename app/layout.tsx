import '@radix-ui/themes/styles.css';
import './globals.css';

import { Theme } from '@radix-ui/themes';

import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

const inter = Roboto({
    weight: '400',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' className={inter.className}>
            <body>
                <Theme accentColor='violet'>
                    <main className=''>{children}</main>
                </Theme>
            </body>
        </html>
    );
}
