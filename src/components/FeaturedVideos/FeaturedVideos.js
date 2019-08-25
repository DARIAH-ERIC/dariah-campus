import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import clsx from 'clsx'

import VideoCard from 'components/VideoCard/VideoCard'

import LeadIn from 'elements/LeadIn/LeadIn'
import Section from 'elements/Section/Section'
import Title from 'elements/Title/Title'

import styles from './FeaturedVideos.module.css'

const FeaturedVideos = ({ className }) => {
  const data = useStaticQuery(graphql`
    query {
      videos: allFeaturedVideo {
        nodes {
          id
          image {
            image: childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          subtitle
          title
        }
      }
    }
  `)

  return (
    <Section className={clsx(styles.section, className)}>
      <Title>Why training and education?</Title>
      <LeadIn>
        Some thoughts on why training and education matter so much for a
        research infrastructure such as DARIAH
      </LeadIn>
      <div className={styles.container}>
        {data.videos.nodes.map(({ id, image, subtitle, title }) => (
          <VideoCard
            id={id}
            key={id}
            title={title}
            subtitle={subtitle}
            image={image && image.image}
          />
        ))}
      </div>
    </Section>
  )
}

export default FeaturedVideos
