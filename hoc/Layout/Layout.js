import Head from 'next/head'
import styles from './Layout.module.css'
import Link from 'next/link'

export const name = 'Andres SL'
export const siteTitle = 'IKEA Availability Check'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header>
        {home && (
          <div className={styles.link}>
            <Link href="/about/me">
              <a>About Me</a>
            </Link>
          </div>
        )}
        {!home && (
          <div className={styles.link}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>This is not an IKEA website. IKEA® is a registered trademark of Inter-IKEA Systems B.V. in the U.S. and other countries.</p>
      </footer>
    </div>
  )
}