import React from 'react'

class ImagePreview extends React.Component {
  componentDidMount() {
    this.$imageNodes = document.querySelectorAll('.gatsby-resp-image-image')
    console.log($imageNodes)
    // 监听图片点击事件
    this.$imageNodes.forEach(node => {
      node.addEventListener('click', e => {
        e.preventDefault()
        console.log('ddd')
      },false)
    })
  }
  componentWillMount() {
    // 取消事件监听
    this.$imageNodes.forEach(node => {
      node.removeEventListener('click')
    })
  }
  render() {
    return (
      <div>
        hello
      </div>   
    )
  }
}

export default ImagePreview
