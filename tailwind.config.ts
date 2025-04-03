import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
				xs: '400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				green: {
					DEFAULT: 'hsl(var(--green) / <alpha-value>)',
					foreground: 'hsl(var(--green-foreground) / <alpha-value>)',
					border: 'hsl(var(--green-border) / <alpha-value>)'
				},
				badgegreen: {
					DEFAULT: 'hsl(var(--badgegreen) / <alpha-value>)',
					foreground: 'hsl(var(--badgegreen-foreground) / <alpha-value>)'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
					border: 'hsl(var(--destructive-border) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				purple: {
					DEFAULT: 'hsl(var(--purple) / <alpha-value>)',
					foreground: 'hsl(var(--purple-foreground) / <alpha-value>)',
					border: 'hsl(var(--purple-border) / <alpha-value>)'
				},
				violet: {
					DEFAULT: 'hsl(var(--violet) / <alpha-value>)',
					foreground: 'hsl(var(--violet-foreground) / <alpha-value>)',
					border: 'hsl(var(--violet-border) / <alpha-value>)'
				},
				yellow: {
					DEFAULT: 'hsl(var(--yellow) / <alpha-value>)',
					foreground: 'hsl(var(--yellow-foreground) / <alpha-value>)',
					border: 'hsl(var(--yellow-border) / <alpha-value>)'
				},
				orange: {
					DEFAULT: 'hsl(var(--orange) / <alpha-value>)',
					foreground: 'hsl(var(--orange-foreground) / <alpha-value>)',
					border: 'hsl(var(--orange-border) / <alpha-value>)'
				},
				amber: {
					DEFAULT: 'hsl(var(--amber) / <alpha-value>)',
					foreground: 'hsl(var(--amber-foreground) / <alpha-value>)',
					border: 'hsl(var(--amber-border) / <alpha-value>)'
				},
				lime: {
					DEFAULT: 'hsl(var(--lime) / <alpha-value>)',
					foreground: 'hsl(var(--lime-foreground) / <alpha-value>)',
					border: 'hsl(var(--lime-border) / <alpha-value>)'
				},
				teal: {
					DEFAULT: 'hsl(var(--teal) / <alpha-value>)',
					foreground: 'hsl(var(--teal-foreground) / <alpha-value>)',
					border: 'hsl(var(--teal-border) / <alpha-value>)'
				},
				blue: {
					DEFAULT: 'hsl(var(--blue) / <alpha-value>)',
					foreground: 'hsl(var(--blue-foreground) / <alpha-value>)',
					border: 'hsl(var(--blue-border) / <alpha-value>)'
				},
				pink: {
					DEFAULT: 'hsl(var(--pink) / <alpha-value>)',
					foreground: 'hsl(var(--pink-foreground) / <alpha-value>)',
					border: 'hsl(var(--pink-border) / <alpha-value>)'
				},
				cyan: {
					DEFAULT: 'hsl(var(--cyan) / <alpha-value>)',
					foreground: 'hsl(var(--cyan-foreground) / <alpha-value>)',
					border: 'hsl(var(--cyan-border) / <alpha-value>)'
				},
				gray: {
					DEFAULT: 'hsl(var(--gray) / <alpha-value>)',
					foreground: 'hsl(var(--gray-foreground) / <alpha-value>)',
					border: 'hsl(var(--gray-border) / <alpha-value>)'
				},
				fuchsia: {
					DEFAULT: 'hsl(var(--fuchsia) / <alpha-value>)',
					foreground: 'hsl(var(--fuchsia-foreground) / <alpha-value>)',
					border: 'hsl(var(--fuchsia-border) / <alpha-value>)'
				},
				indigo: {
					DEFAULT: 'hsl(var(--indigo) / <alpha-value>)',
					foreground: 'hsl(var(--indigo-foreground) / <alpha-value>)',
					border: 'hsl(var(--indigo-border) / <alpha-value>)'
				},
				emerald: {
					DEFAULT: 'hsl(var(--emerald) / <alpha-value>)',
					foreground: 'hsl(var(--emerald-foreground) / <alpha-value>)',
					border: 'hsl(var(--emerald-border) / <alpha-value>)'
				},
				'soft-blue': '#D3E4FD',
				'approval-green': '#34C759',
				'reject-red': '#FF3B30',
				'neutral-gray': '#8E9196'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'subtle-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'subtle-pulse': 'subtle-pulse 2s ease-in-out infinite',
				'slide-in-right': 'slide-in-right 0.4s ease-out'
			}
		}
	}
};

export default config;
