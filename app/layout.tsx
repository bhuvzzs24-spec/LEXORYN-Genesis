import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'LEXORYN — The Alien Dynasty',description:'The planet where intelligence became civilization. Explore an ancient Vaelori-led civilization, native Myr institutions and human minority communities in3186.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
