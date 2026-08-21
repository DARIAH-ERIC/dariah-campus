export const limit = 25;

/**
 * Typesense has no "all values" option, and caps a facet's values at whatever is asked for - so ask for far more than
 * the collection holds. This is a ceiling, not a size: it currently returns every one of the ~600 people, which costs
 * about 4kb gzipped over the previous cap of 250, while making the ~300 people beyond it findable at all. Note that a
 * truncated facet is indistinguishable from a complete one in the response, since `stats.total_values` is capped too
 * and `sampled` refers to something else. Should the corpus ever approach this number, the answer is typesense's
 * `facet_query`, which searches facet values server side, rather than a bigger number here.
 */
export const maxFacetValues = 10_000;

/**
 * A facet with more values than this offers a filter input. A shorter list fits in the popover without scrolling, where
 * scanning it is quicker than typing - there is nothing to search among two languages.
 */
export const maxUnfilteredFacetValues = 10;

export const cacheSearchResultsForSeconds = 60 * 60;
