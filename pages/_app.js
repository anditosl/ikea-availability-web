import '../styles/global.css'
import { DataContextProvider } from '../components/data.context'

export default function App({ Component, pageProps }) {
  return (
    <DataContextProvider>
      <Component {...pageProps} />
    </DataContextProvider>
  )
}