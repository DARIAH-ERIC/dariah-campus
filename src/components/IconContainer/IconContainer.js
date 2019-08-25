import React from 'react'

const IconContainer = ({ children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      position: 'relative',
    }}
  >
    {children}
  </div>
)

export default IconContainer
