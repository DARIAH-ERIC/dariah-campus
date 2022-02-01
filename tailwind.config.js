/* @ts-expect-error Missing module declaration. */
const colors = require('tailwindcss/colors')

const config = {
  content: ['src/**/*.@(ts|tsx)'],
  theme: {
    extend: {
      strokeWidth: {
        3: '3',
      },
      boxShadow: {
        sm: 'rgba(0, 0, 0, 0.08) 0px 2px 8px 0px',
        md: 'rgba(0, 0, 0, 0.08) 0px 5px 15px 0px',
        lg: 'rgba(0, 0, 0, 0.12) 0px 10px 35px 0px',
      },
      colors: {
        error: colors.red,
        neutral: {
          ...colors.neutral,
          150: '#ebecee',
        },
        primary: {
          600: '#006699',
          700: '#005580',
        },
        secondary: {
          800: '#2c3547',
        },
        event: {
          violet1: '#1e396c',
          violet2: '#0870ac',
          orange: '#ed6f59',
          pink1: '#d5d8dc',
          pink2: '#eaecee',
          gray: '#f8f9f9',
          darkgray: '#2c3547',
          red: '#de1f4e',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '4.5xl': [px(40), { lineHeight: 1 }],
      },
      gridTemplateColumns: {
        'content-layout': '1fr 720px 1fr',
        'cards-layout': 'repeat(auto-fill, minmax(320px, 1fr))',
        content: '1fr 80ch 1fr',
      },
      maxWidth: {
        /** Character units `ch` change with font size, we just want a fixed width container. */
        '80ch': '720px',
      },
      padding: {
        '10vmin': '10vmin',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      typography(/** @type {(key: string) => string} */ theme) {
        return {
          DEFAULT: {
            css: {
              maxWidth: 'none',
              /** Don't add quotes around `blockquote`. */
              'blockquote p:first-of-type::before': null,
              'blockquote p:last-of-type::after': null,
              /** Don't add backticks around inline `code`. */
              'code::before': null,
              'code::after': null,
              'overflow-wrap': 'break-word',
              a: {
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  borderRadius: theme('borderRadius.DEFAULT'),
                  color: theme('colors.primary.600'),
                  boxShadow: `white 0px 0px 0px 2px, ${theme(
                    'colors.primary.600',
                  )} 0px 0px 0px 5px`,
                },
              },
              pre: {
                /** Match `poimandres` theme. */
                backgroundColor: '#1b1e28',
              },
              strong: {
                color: 'inherit',
              },
              h2: {
                fontSize: theme('fontSize.2xl')[0],
                fontWeight: theme('fontWeight.bold'),
              },
              h3: {
                fontSize: theme('fontSize.xl')[0],
                fontWeight: theme('fontWeight.bold'),
              },
              h4: {
                fontSize: theme('fontSize.lg')[0],
                fontWeight: theme('fontWeight.bold'),
              },
              h5: {
                fontSize: theme('fontSize.base')[0],
                fontWeight: theme('fontWeight.bold'),
              },
              h6: {
                fontSize: theme('fontSize.base')[0],
                fontStyle: 'italic',
              },
              '.no-list': {
                listStyle: 'none',
                paddingLeft: 0,
              },
              '.no-list p': {
                marginTop: '0.5em',
                marginBottom: '0.5em',
              },
            },
          },
        }
      },
    },
    screens: {
      '2xs': '360px',
      xs: '480px',
      sm: '640px',
      md: '840px',
      lg: '1048px',
      xl: '1280px',
      '2xl': '1440px',
      'event-md': '55.125em',
      'event-lg': '63.25em',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    /* @ts-expect-error Missing module declaration. */
    require('@tailwindcss/typography'),
    /** @ts-expect-error Missing module declaration. */
    require('@tailwindcss/aspect-ratio'),
  ],
}

/** @type {(px: number) => string} */
function px(pixel) {
  return `${pixel / 16}rem`
}

module.exports = config
