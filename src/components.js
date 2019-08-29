import React from 'react'

import CTA from 'components/CTA/CTA'
import CodeBlock from 'components/CodeBlock/CodeBlock'
import IFrame from 'components/IFrame/IFrame'
import Link from 'components/Link/Link'
import VideoCard from 'components/VideoCard/VideoCard'
import Youtube from 'components/Youtube/Youtube'

import Blockquote from 'elements/Blockquote/Blockquote'
import Collapsible from 'elements/Collapsible/Collapsible'
import Container from 'elements/Container/Container'
import Flex from 'elements/Flex/Flex'
import Grid from 'elements/Grid/Grid'
import Heading from 'elements/Heading/Heading'
import LeadIn from 'elements/LeadIn/LeadIn'
import List from 'elements/List/List'
import Panel from 'elements/Panel/Panel'
import Paragraph from 'elements/Paragraph/Paragraph'
import Section from 'elements/Section/Section'
import Title from 'elements/Title/Title'
import Table from 'elements/Table/Table'

const components = {
  a: Link,
  blockquote: Blockquote,
  CallToAction: CTA,
  code: CodeBlock,
  Collapsible,
  Container,
  CTA,
  Flex,
  Grid,
  h1: Title,
  h2: LeadIn,
  h3: props => <Heading level="2" {...props} />,
  h4: props => <Heading level="3" {...props} />,
  h5: props => <Heading level="4" {...props} />,
  h6: props => <Heading level="5" {...props} />,
  IFrame,
  ol: props => <List ordered {...props} />,
  Panel,
  p: Paragraph,
  Section,
  ul: props => <List {...props} />,
  VideoCard,
  // wrapper: props => props.children,
  Youtube,
  table: Table,
}

export default components
