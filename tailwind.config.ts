import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display:     ['var(--font-cinzel)', 'serif'],
        displayDeco: ['var(--font-cinzel-deco)', 'serif'],
        body:        ['var(--font-garamond)', 'serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#c9a84c',
          bright:  '#f0d080',
          dim:     '#7a6030',
        },
        ink: '#050608',
        parchment: '#e8d9b0',
      },
    },
  },
  plugins: [],
}

export default config
