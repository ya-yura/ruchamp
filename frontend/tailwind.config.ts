import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        neutralForeground1Rest: '#242424',
        neutralForeground3Rest: '#616161',
        neutralForeground3: '#ADADAD',
        NeutralBackground4Rest: '#F0F0F0',
        NeutralStroke1Rest: '#666666',
        NeutralStroke2Rest: '#E0E0E0',
        NeutralStroke3Rest: '#3D3D3D',
        NeutralGrayColor1: '#071623',
        ColorsGrey26: '#424242',
        ColorsGrey14: '#242424',
        ColorsGrey98: '#FAFAFA',
        Grey100: '#0A0A0A',
        Grey101: '#B6B6B6',
        Grey102: '#888888',
        pistachio: '#8AC285',
        orange: '#FCD483',
        purple: '#7567D7',
        darkRed: '#582025',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          mainAccent: '#0F6CBD',
          background: '#0A0A0A',
          almostBlack: '#090707',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          background: '#292929',
          backgroundDark: '#000000',
          hoverGray: '#4A4A4A',
        },
        text: {
          muted: '#616161',
          mutedLight: '#D6D6D6',
          mutedCard: '#999999',
        },
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      boxShadow: {
        basic: '0 5px 36px 0 rgba(0, 0, 0, 0.08)',
        input: '0 1px 0 0 lightgray',
        inputFocused: '0 1.5px 0 0 rgba(15,108,189,1)',
        cardShadow: '0 5px 30px 0 rgba(0, 0, 0, 0.5)',
        darkCardHover: '0 5px 36px 0 rgba(15, 108, 189, 0.5)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      dropShadow: {
        contrastText: '0 1px 5px rgba(0, 0, 0, 0.9)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@xpd/tailwind-3dtransforms'),
  ],
} satisfies Config;

export default config;
