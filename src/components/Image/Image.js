import React from 'react'
import GatsbyImage from 'gatsby-image'

// This is needed for the `object-fit-images` polyfill for IE11
const Image = ({ objFit = 'cover', objPosition = '50% 50%', ...rest }) => (
  <GatsbyImage
    {...rest}
    imgStyle={{
      ...rest.imgStyle,
      objectFit: objFit,
      objectPosition: objPosition,
      fontFamily: `"object-fit: ${objFit}; object-position: ${objPosition}"`,
    }}
  />
)

export default Image
