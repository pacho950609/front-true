import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NavbarL } from '../components/navbar';
import { UserProvider } from '../context/userContext';


function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <>
     <UserProvider>
        <NavbarL/>
        <Component {...pageProps} />
     </UserProvider>
    </>
  )
}

export default MyApp
