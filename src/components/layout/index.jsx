import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'gatsby'
import favicon from '../../assets/images/favicon.ico'

import '../../assets/style/global.css'
import styles from './style.module.css'

const DefaultLayout = ({ children, site }) =>
  <div className={styles.layout}>
    {/* Helmet */}
    <Helmet>
      <title>{site.siteMetadata.title}</title>
      <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
    </Helmet>
    {/*Header*/}
    <div className={styles.header}>
      <div className={styles.title}>
        {site.siteMetadata.title}
      </div>
      <div className={styles.menu}>
        <Link to='/'>主页</Link>
        <Link to='/about'>关于</Link>
      </div>
    </div>
    {/*正文内容*/}
    {children}
    {/* footer */}
    <div className={styles.footer}>
      <div className={styles.contact}>
        <a href=''>Github</a>
        <a href=''>Twitter</a>
        <a href=''>Weibo</a>
      </div>
      <div className={styles.siteinfo}></div>
    </div>
  </div>

export default DefaultLayout
