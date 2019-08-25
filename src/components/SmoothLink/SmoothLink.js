import React from 'react'

import Link from 'components/Link/Link'

const SmoothLink = ({ onClick, ...rest }) => (
  <Link
    {...rest}
    onClick={() => {
      const dest = props.href || props.to

      if (dest.startsWith('#')) {
        const element = document.getElementById(dest.slice(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }

      onClick()
    }}
  />
)

export default SmoothLink
