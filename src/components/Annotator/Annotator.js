import { useEffect } from 'react'

const clientSrc = 'https://hypothes.is/embed.js'
const cdnUrl = 'https://cdn.hypothes.is/'

const Annotator = ({ children }) => {
  useEffect(() => {
    const hypothesis = document.createElement('script')
    hypothesis.src = clientSrc
    hypothesis.async = true
    hypothesis.defer = true

    document.head.appendChild(hypothesis)

    return () => {
      const client = document.querySelector(
        'link[type="application/annotator+html"]'
      )
      if (client) {
        client.dispatchEvent(new Event('destroy'))
      }

      ;[
        ...document.head.querySelectorAll(
          `link[type^="application/annotator"]`
        ),
      ].forEach(el => document.head.removeChild(el))
      ;[...document.head.querySelectorAll(`link[href^="${cdnUrl}"]`)].forEach(
        el => document.head.removeChild(el)
      )
      ;[...document.head.querySelectorAll(`script[src^="${cdnUrl}"]`)].forEach(
        el => document.head.removeChild(el)
      )
    }
  }, [])

  return children
}

export default Annotator
