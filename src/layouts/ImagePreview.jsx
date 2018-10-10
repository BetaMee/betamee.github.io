import React from 'react'
import styled from 'styled-components'

// 响应式media函数
import media from '../utils/mediaquery'

const PopupContianer = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;
`

const ImageContainer = styled.div`
  width: 60%;
  height: 70%;
  ${media.desktop`
    width: 60%;
    height: 70%;
  `}
  ${media.tablet`
    width: 80%;
    height: 60%;
  `}
  ${media.phone`
    width: 90%;
    height: 40%;
  `}
`

const Image = styled.img`
  background-repeat: no-repeat;
  border-radius: 4px;
  box-shadow: inset 0px 0px 0px 400px white;
  object-fit: cover;
  width: 100%;
  height: 100%;
`

const Description = styled.div`
  color: #ffffff;
  text-align: center;
`
class ImagePreview extends React.Component {
  state = {
    isOpenImagePreview: false,
    imageUrl: '',
    description: ''
  }
  componentDidMount() {
    this.$imageNodes = document.querySelectorAll('.gatsby-resp-image-image')
    // 监听图片点击事件
    this.$imageNodes.forEach(node => {
      node.addEventListener('click', e => {
        e.preventDefault()
        const $target = e.target
        const $imageUrl = $target.currentSrc
        console.log(e)
        this.setState({
          imageUrl: $imageUrl,
          isOpenImagePreview: true,
          description: $target.alt
        })
      },false)
    })
  }
  handleCloseImagePreview = () => {
    this.setState({
      imageUrl: '',
      isOpenImagePreview: false,
      description: ''
    })
  }
  componentWillUnmount() {
    // 取消事件监听
    this.$imageNodes.forEach(node => {
      node.removeEventListener('click')
    })
  }
  render() {
    const {
      isOpenImagePreview,
      imageUrl,
      description
    } = this.state

    return (isOpenImagePreview && (
      <PopupContianer
        onClick={this.handleCloseImagePreview}
      >
        <ImageContainer>
          <Image src={imageUrl} />
          <Description>{description}</Description>
        </ImageContainer>
      </PopupContianer>
    ))
  }
}

export default ImagePreview
