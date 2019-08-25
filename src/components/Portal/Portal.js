import ReactDOM from 'react-dom'

const Portal = ({ children }) => {
  if (typeof document !== 'undefined') {
    return ReactDOM.createPortal(children, document.getElementById('overlay'))
  }
  return null
}

export default Portal
