import type { Config } from 'tailwindcss';
import { slate, blue, blueDark, slateDark, pink } from '@radix-ui/colors';

const customaccent = {
  base: blue.blue1,
  bgSubtle: blue.blue2,
  bg: blue.blue3,
  bgHover: blue.blue4,
  bgActive: blue.blue5,
  line: blue.blue6,
  border: blue.blue7,
  borderHover: blue.blue8,
  solid: blue.blue9,
  solidHover: blue.blue10,
  text: blue.blue11,
  textContrast: blue.blue12
};

const customsecondary = {
  base: pink.pink1,
  bgSubtle: pink.pink2,
  bg: pink.pink3,
  bgHover: pink.pink4,
  bgActive: pink.pink5,
  line: pink.pink6,
  border: pink.pink7,
  borderHover: pink.pink8,
  solid: pink.pink9,
  solidHover: pink.pink10,
  text: pink.pink11,
  textContrast: pink.pink12
};

const neutral = {
  base: slate.slate1,
  bgSubtle: slate.slate2,
  bg: slate.slate3,
  bgHover: slate.slate4,
  bgActive: slate.slate5,
  line: slate.slate6,
  border: slate.slate7,
  borderHover: slate.slate8,
  solid: slate.slate9,
  solidHover: slate.slate10,
  text: slate.slate11,
  textContrast: slate.slate12
};

const darkAccent = {
  base: blueDark.blue1,
  bgSubtle: blueDark.blue2,
  bg: blueDark.blue3,
  bgHover: blueDark.blue4,
  bgActive: blueDark.blue5,
  line: blueDark.blue6,
  border: blueDark.blue7,
  borderHover: blueDark.blue8,
  solid: blueDark.blue9,
  solidHover: blueDark.blue10,
  text: blueDark.blue11,
  textContrast: blueDark.blue12
};
const darkNeutral = {
  base: slateDark.slate1,
  bgSubtle: slateDark.slate2,
  bg: slateDark.slate3,
  bgHover: slateDark.slate4,
  bgActive: slateDark.slate5,
  line: slateDark.slate6,
  border: slateDark.slate7,
  borderHover: slateDark.slate8,
  solid: slateDark.slate9,
  solidHover: slateDark.slate10,
  text: slateDark.slate11,
  textContrast: slateDark.slate12
};

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        customaccent,
        neutral,
        customsecondary,
        'dark-accent': darkAccent,
        'dark-neutral': darkNeutral
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' }
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' }
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
} satisfies Config;

export default config;
