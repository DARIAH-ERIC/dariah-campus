import React from 'react'
// import { graphql, useStaticQuery } from 'gatsby'
import clsx from 'clsx'

// import Image from 'components/Image/Image'

import Container from 'elements/Container/Container'

import styles from './Hero.module.css'

const Hero = ({ className, image, subtitle, title }) => {
  // const { heroImages } = useStaticQuery(graphql`
  //   query {
  //     heroImages: allFile(filter: { relativeDirectory: { eq: "hero" } }) {
  //       nodes {
  //         base
  //         image: childImageSharp {
  //           fluid(maxWidth: 1200) {
  //             ...GatsbyImageSharpFluid_withWebp
  //           }
  //         }
  //         publicURL
  //       }
  //     }
  //   }
  // `)

  return (
    <Container size="medium" className={clsx(styles.hero, className)}>
      {image && <img className={styles.heroImage} src={image} alt="" />}
      <h1 className={styles.heroTitle}>{title}</h1>
      <h2 className={styles.heroSubtitle}>{subtitle}</h2>
    </Container>
  )
}

export default Hero
