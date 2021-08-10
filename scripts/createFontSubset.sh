#!/bin/sh

# subsetting with pyftsubset from https://github.com/fonttools/fonttools
# unicode ranges taken from https://fonts.googleapis.com/css2?family=Inter&display=swap
# helpful tips: https://markoskon.com/creating-font-subsets/

# latin
pyftsubset Inter.ttf --output-file="inter-var-latin.woff2" --flavor=woff2 --unicodes="U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"

# latin-ext
pyftsubset Inter.ttf --output-file="inter-var-latin-ext.woff2" --flavor=woff2 --unicodes="U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"
