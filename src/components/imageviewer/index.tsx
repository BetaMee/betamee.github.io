import React, { useEffect } from 'react'

import styles from './viewer.module.scss'
import closeSVG from '../../assets/images/close.svg'

interface IProps {
  imageUrl: string,
  description: string,
  closeViewer: () => void
}

const ImageViewer: React.FC<IProps> = ({ imageUrl, description, closeViewer }) => {
  // 记录当前滚动高度
  const scrollTop = document.documentElement.scrollTop;
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollTop}px`
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.documentElement.scrollTo(0, scrollTop)
    };
  }, [])
  return (
    <div className={styles.viewer}>
      <div className={styles.container}>
        <img src={imageUrl} className={styles.img}/>
        <div className={styles.des}>{description}</div>
        <span
          onClick={closeViewer}
          className={styles.icon}
        >
          <img src={closeSVG}/>
        </span>
      </div>
    </div>
  )
}

export default ImageViewer
