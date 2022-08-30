import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import DocusaurusImageUrl from '@site/static/img/logo.svg'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import { MuiTelInput } from 'mui-tel-input'

import styles from './index.module.css'

import '../css/index.css'

const HomepageHeader = () => {
  const { siteConfig } = useDocusaurusContext()
  const [phoneValue, setPhoneValue] = React.useState<string>('+33123456789')

  const handleChange = (newPhoneValue: string) => {
    setPhoneValue(newPhoneValue)
  }

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <DocusaurusImageUrl width={100} height={100} />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className={clsx('hero__subtitle', styles.subtitle)}>
          A phone number input designed for the React library{' '}
          <Link target="_blank" href="https://mui.com">
            MUI
          </Link>{' '}
          built with{' '}
          <Link
            target="_blank"
            href="https://www.npmjs.com/package/libphonenumber-js"
          >
            libphonenumber-js
          </Link>
          .
        </p>
        <MuiTelInput value={phoneValue} onChange={handleChange} />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}

const Home = () => {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout description={siteConfig.tagline}>
      <HomepageHeader />
    </Layout>
  )
}

export default Home
