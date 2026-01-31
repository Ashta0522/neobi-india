import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'raven': {
          'base': '#0F0F17',
          'dark': '#1a1a24',
          'accent': '#9333EA',
          'peach': '#FF6B6B',
          'amber': '#FFB347',
        },
        'agents': {
          'orchestrator': '#9333EA',
          'simulation': '#06B6D4',
          'decision': '#10B981',
          'operations': '#F97316',
          'coach': '#14B8A6',
          'innovation': '#FACC15',
          'growth': '#EC4899',
          'learning': '#84CC16',
        }
      },
      backdropBlur: {
        'xl': 'blur(20px)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 107, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(255, 107, 107, 0)' },
        }
      },
      transitionTimingFunction: {
        'raven': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'gradient-peach': 'linear-gradient(135deg, #FF6B6B, #FFB347)',
        'gradient-raven': 'linear-gradient(135deg, #0F0F17, #1a1a24)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
