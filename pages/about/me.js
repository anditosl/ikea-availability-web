import Head from 'next/head'
import Link from 'next/link'
import Layout, { name, siteTitle } from '../../hoc/Layout/Layout'
import utilStyles from '../../styles/utils.module.css'
import styles from './me.module.css'

export default function AboutMe() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <header className={styles.header}>
        <>
          <Link href="/">
            <a>
              <img
                src="/images/profile.jpeg"
                className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                alt={name}
              />
            </a>
          </Link>
          <h2 className={utilStyles.headingLg}>
            <Link href="/">
              <a className={utilStyles.colorInherit}>{name}</a>
            </Link>
          </h2>
        </>
      </header>
      <section className={utilStyles.headingMd}>
        <p>Hello, I'm <b>Andres</b>. I'm a software engineer with experience in fullstack web development using JavaScript.</p>
      </section>
    </Layout>
  )
}