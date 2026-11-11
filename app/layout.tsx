import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'LEXORYN — The Living Intelligence Planet',description:'The planet where intelligence became civilization. A cinematic interactive expedition through an original world in the year 3186.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
