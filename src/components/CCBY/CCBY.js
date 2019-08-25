import React from 'react'

// import { ReactComponent as BY } from 'assets/by.svg'
// import { ReactComponent as CC } from 'assets/cc.svg'
import by from 'assets/by.svg'
import cc from 'assets/cc.svg'

const CCBY = () => (
  <div style={{ display: 'flex' }}>
    <img src={cc} alt="" style={{ width: '50%' }} />
    <img src={by} alt="" style={{ width: '50%' }} />
  </div>
)

export default CCBY
