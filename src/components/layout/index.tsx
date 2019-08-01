import React from 'react'
import Helmet from 'react-helmet'
import { Link, useStaticQuery, graphql } from 'gatsby'
import favicon from '../../assets/images/favicon.ico'

import '../../assets/style/global.css'
import '../../assets/style/style.css'
import 'prismjs/themes/prism-coy.css'

import styles from './layout.module.scss'

interface SiteMetaType {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

const DefaultLayout: React.FC = ({ children }) => {
  const data: SiteMetaType = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <div className={styles.layout} >
    {/* Helmet */}
    <Helmet>
      <title>{data.site.siteMetadata.title}</title>
      <link rel='icon' type='image/png' href={favicon} sizes='16x16' />
    </Helmet>
    {/*Header*/}
    <div className={styles.header}>
      <div className={styles.title}>
        {data.site.siteMetadata.title}
      </div>
      <div className={styles.menu}>
        <Link to='/'>主页</Link>
        <Link
          to='/about'
          title='I Love You a Thousands Times'
        >
          WHO AM I?
        </Link>
      </div>
    </div>
    {/*正文内容*/}
    {children}
    {/* footer */}
    <div className={styles.footer}>
      <div className={styles.contact}>
        <a
          href='https://github.com/BetaMee'
          target='_blank'
          rel='noopener noreferrer'
        >
          Github
        </a>
        <a
          href='https://twitter.com/gongxq'
          target='_blank'
          rel='noopener noreferrer'
        >
          Twitter
        </a>
        <a
          href='https://weibo.com/2909438360'
          target='_blank'
          rel='noopener noreferrer'
        >
          Weibo
        </a>
        <a
          href='https://www.instagram.com/gongxq95'
          target='_blank'
          rel='noopener noreferrer'
        >
          Instagram
        </a>
      </div>
      <div className={styles.siteInfo}>
        Copyright © 橡树上 2019
      </div>
    </div>
  </div>
  )
}

export default DefaultLayout
