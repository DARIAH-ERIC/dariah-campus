import React from 'react'

import Head from 'components/Head/Head'
import Hero from 'components/Hero/Hero'
import TagCloud from 'components/TagCloud/TagCloud'

import Page from 'elements/Page/Page'
import Container from 'elements/Container/Container'

import StudyImage from 'assets/hero/study.svg'

const TagsTemplate = () => (
  <Page>
    <Head title="Topics" />
    <Hero
      title="Interested in particular topics?"
      subtitle="Browse learning resources based on their topic"
      image={StudyImage}
    />

    <Container size="small">
      <TagCloud />
    </Container>
  </Page>
)

export default TagsTemplate
