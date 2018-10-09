import React from 'react'

class ImagePreview extends React.Component {
  componentDidMount() {
    const $image = document.querySelector('.gatsby-resp-image-image')
    console.log($image.length)
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
