import { extendTheme } from '@chakra-ui/react'

const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
}

const colors = {
    brand: {
        50: '#f5f0ff',
        100: '#ead9ff',
        200: '#d7b8ff',
        300: '#c194ff',
        400: '#b27aff',
        500: '#a961ff',
        600: '#9747ff',
        700: '#8330ff',
        800: '#6d1be6',
        900: '#5a0fc7',
    },
    purple: {
        50: '#f5f0ff',
        100: '#ebe1ff',
        200: '#d5bfff',
        300: '#b794ff',
        400: '#a674ff',
        500: '#9557ff',
        600: '#8744ff',
        700: '#7433ff',
        800: '#6929e6',
        900: '#5a1db8',
    }
}

const semanticTokens = {
    colors: {
        'bg.default': {
            default: 'white',
            _dark: '#171923',
        },
        'bg.subtle': {
            default: '#ffffff',
            _dark: '#1A202C',
        },
        'bg.muted': {
            default: '#f5f5f7',
            _dark: '#1E2533',
        },
        'bg.hover': {
            default: '#f5f5f7',
            _dark: '#252D3D',
        },
        'bg.selected': {
            default: '#f0e7ff',
            _dark: '#2D3748',
        },
        'border.default': {
            default: '#e5e5e7',
            _dark: '#2D3748',
        },
        'border.subtle': {
            default: '#f5f5f7',
            _dark: '#252D3D',
        },
        'text.default': {
            default: '#1d1d1f',
            _dark: '#FFFFFF',
        },
        'text.muted': {
            default: '#6e6e73',
            _dark: '#E2E8F0',
        },
        'text.subtle': {
            default: '#86868b',
            _dark: '#CBD5E0',
        },
        'accent.default': {
            default: 'purple.500',
            _dark: '#C4B5FD',
        },
        'accent.emphasized': {
            default: 'purple.600',
            _dark: '#DDD6FE',
        },
        'accent.subtle': {
            default: 'purple.100',
            _dark: 'rgba(183, 148, 255, 0.15)',
        },
        'accent.muted': {
            default: 'purple.50',
            _dark: 'rgba(183, 148, 255, 0.08)',
        },
        'sidebar.bg': {
            default: '#ffffff',
            _dark: '#141821',
        },
        'sidebar.border': {
            default: '#e5e5e7',
            _dark: '#252D3D',
        },
    },
}

const components = {
    Button: {
        baseStyle: {
            fontWeight: 'medium',
            borderRadius: 'lg',
            transition: 'all 0.2s',
        },
        variants: {
            solid: (props) => ({
                bg: props.colorMode === 'light' ? 'purple.500' : 'purple.400',
                color: 'white',
                _hover: {
                    bg: props.colorMode === 'light' ? 'purple.600' : 'purple.300',
                    transform: 'translateY(-1px)',
                    _disabled: {
                        bg: props.colorMode === 'light' ? 'purple.500' : 'purple.400',
                    },
                },
                _active: {
                    bg: props.colorMode === 'light' ? 'purple.700' : 'purple.500',
                    transform: 'translateY(0)',
                },
            }),
            ghost: (props) => ({
                color: 'text.muted',
                bg: 'transparent',
                _hover: {
                    bg: 'bg.hover',
                    color: props.colorMode === 'light' ? 'purple.600' : 'purple.200',
                },
            }),
            outline: {
                borderColor: 'accent.default',
                color: 'accent.default',
                _hover: {
                    bg: 'accent.muted',
                },
            },
        },
    },
    Input: {
        variants: {
            outline: {
                field: {
                    bg: 'bg.default',
                    borderColor: 'border.default',
                    color: 'text.default',
                    _placeholder: {
                        color: 'text.subtle',
                    },
                    _hover: {
                        borderColor: 'border.subtle',
                    },
                    _focus: {
                        borderColor: 'accent.default',
                        boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                    },
                },
            },
            filled: {
                field: {
                    bg: 'bg.subtle',
                    color: 'text.default',
                    _placeholder: {
                        color: 'text.subtle',
                    },
                    _hover: {
                        bg: 'bg.muted',
                    },
                    _focus: {
                        bg: 'bg.default',
                        borderColor: 'accent.default',
                    },
                },
            },
        },
    },
    Link: {
        baseStyle: {
            color: 'accent.default',
            _hover: {
                textDecoration: 'none',
                color: 'accent.emphasized',
            },
        },
    },
    Text: {
        baseStyle: {
            color: 'text.default',
        },
    },
    Heading: {
        baseStyle: {
            color: 'text.default',
            letterSpacing: '-0.025em',
        },
    },
    Modal: {
        baseStyle: {
            dialog: {
                bg: 'bg.default',
                borderRadius: 'xl',
                borderWidth: '1px',
                borderColor: 'border.default',
            },
            header: {
                color: 'text.default',
                fontWeight: 'semibold',
                fontSize: 'xl',
                px: 6,
                pt: 6,
                pb: 4,
            },
            body: {
                color: 'text.default',
                px: 6,
                py: 4,
            },
            footer: {
                px: 6,
                py: 4,
            },
            closeButton: {
                color: 'text.muted',
                _hover: {
                    color: 'text.default',
                    bg: 'bg.hover',
                },
            },
            overlay: {
                bg: 'rgba(0, 0, 0, 0.7)',
            },
        },
    },
    Textarea: {
        variants: {
            outline: {
                bg: 'bg.default',
                borderColor: 'border.default',
                color: 'text.default',
                _placeholder: {
                    color: 'text.subtle',
                },
                _hover: {
                    borderColor: 'border.subtle',
                },
                _focus: {
                    borderColor: 'accent.default',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                },
            },
        },
    },
}

const styles = {
    global: {
        'html, body': {
            bg: 'bg.default',
            color: 'text.default',
            lineHeight: 1.5,
            minHeight: '100vh',
            _dark: {
                bg: '#171923',
            },
        },
        '#root': {
            minHeight: '100vh',
            bg: 'inherit',
        },
        body: {
            bg: 'bg.default',
            color: 'text.default',
            lineHeight: 1.5,
            fontWeight: 400,
        },
        'p, .chakra-text': {
            color: 'text.default',
            _dark: {
                color: '#E2E8F0',
            }
        },
        '.subtitle, .description': {
            color: 'text.muted',
            _dark: {
                color: '#E2E8F0 !important',
            }
        },
        // Community Insights specific styles
        '.insight-card': {
            bg: 'bg.subtle',
            borderWidth: '1px',
            borderColor: 'border.default',
            _dark: {
                bg: '#1E2533',  // Darker background
                borderColor: '#2D3748',
            }
        },
        '.insight-container': {
            bg: 'bg.default',
            _dark: {
                bg: '#171923',  // Base dark background
            }
        },
        '.insight-section': {
            bg: 'bg.subtle',
            _dark: {
                bg: '#1A202C',  // Slightly lighter than base
            }
        },
        '.frequency-banner': {
            _dark: {
                bg: '#2C1B47',  // Dark purple for frequency banners
                color: '#E9D8FD',
            }
        },
        '.query-box': {
            _dark: {
                bg: '#141821',  // Darker background for query boxes
                color: '#E2E8F0',
                borderColor: '#2D3748',
            }
        },
        '.insight-title': {
            color: 'text.default',
            fontWeight: 'semibold',
            _dark: {
                color: '#F7FAFC',
            }
        },
        '.insight-subtitle': {
            color: 'text.muted',
            _dark: {
                color: '#CBD5E0',
            }
        },
        '.insight-query': {
            bg: 'bg.muted',
            color: 'text.default',
            _dark: {
                bg: 'rgba(45, 55, 72, 0.5)',
                color: '#E2E8F0',
            }
        },
        '.insight-metric': {
            color: 'text.muted',
            _dark: {
                color: '#A0AEC0',
            }
        },
        '.insight-highlight': {
            color: 'accent.default',
            _dark: {
                color: '#B794F4',  // Brighter purple for highlights
            }
        },
        '.frequency-tag': {
            bg: 'accent.subtle',
            color: 'accent.default',
            _dark: {
                bg: 'rgba(183, 148, 244, 0.15)',
                color: '#B794F4',
            }
        }
    },
}

const theme = extendTheme({
    config,
    colors,
    semanticTokens,
    components,
    styles,
    fonts: {
        heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
})

export default theme 