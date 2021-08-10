import { components } from '@/mdx/components'
import type { MdxContentProps } from '@/mdx/runMdxSync'
import { useMdx } from '@/mdx/useMdx'

export interface MdxProps {
  code: string
  components?: MdxContentProps['components']
}

/**
 * Renders pre-compiled mdx content.
 */
export function Mdx(props: MdxProps): JSX.Element {
  const { MdxContent, metadata } = useMdx(props.code)

  return (
    <MdxContent
      {...metadata}
      components={{ ...components, ...props.components }}
    />
  )
}
