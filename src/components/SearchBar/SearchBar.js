import React from 'react'
import algoliasearch from 'algoliasearch/lite'
import {
  InstantSearch,
  Configure,
  connectAutoComplete,
} from 'react-instantsearch-dom'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'
import { Location } from '@reach/router'
import clsx from 'clsx'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

import '@reach/combobox/styles.css'
import styles from './SearchBar.module.css'

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_API_KEY
)

const AutoComplete = ({
  basePath,
  className,
  navigate,
  hits: searchResults,
  refine: setSearchTerm,
  currentRefinement: searchTerm,
  inputRef,
}) => (
  <Combobox
    className={clsx(styles.searchBar, className)}
    onSelect={item => {
      const matchedPost = searchResults.find(post => post.title === item)
      if (matchedPost && matchedPost.slug) {
        setSearchTerm('')
        navigate(createPath(basePath, matchedPost.slug))
      }
    }}
  >
    <ComboboxInput
      aria-label="Search"
      className={styles.searchBarInput}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="Search..."
      ref={inputRef}
      selectOnClick
      type="search"
      value={searchTerm}
    />
    <ComboboxPopover className={styles.searchPopover}>
      <ComboboxList
        aria-label="Search"
        persistSelection
        className={styles.searchResults}
      >
        {searchResults.map(post => (
          <ComboboxOption
            key={post.objectID}
            value={post.title}
            className={styles.searchResult}
          />
        ))}
      </ComboboxList>
    </ComboboxPopover>
  </Combobox>
)

const AlgoliaSearchBar = connectAutoComplete(AutoComplete)

const SearchBar = ({ className }, ref) => {
  const basePath = getBasePath('post')

  return (
    <Location>
      {({ navigate }) => (
        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.ALGOLIA_INDEX_NAME}
        >
          <Configure hitsPerPage={5} />
          <AlgoliaSearchBar
            basePath={basePath}
            className={className}
            navigate={navigate}
            inputRef={ref}
          />
        </InstantSearch>
      )}
    </Location>
  )
}

export default React.forwardRef(SearchBar)
