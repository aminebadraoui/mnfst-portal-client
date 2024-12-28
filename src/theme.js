import { extendTheme } from '@chakra-ui/react'

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
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
        50: '#f9f6fe',
        100: '#e9defa',
        200: '#d3bef5',
        300: '#b794f4',
        400: '#a961ff',
        500: '#9747ff',
        600: '#8330ff',
        700: '#6b24d6',
        800: '#5a1db8',
        900: '#4a1795',
    },
}

const fonts = {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
}

const components = {
    Button: {
        baseStyle: {
            fontWeight: 'semibold',
            borderRadius: 'lg',
        },
        variants: {
            solid: {
                bg: 'brand.500',
                color: 'white',
                _hover: {
                    bg: 'brand.600',
                    _disabled: {
                        bg: 'brand.500',
                    },
                },
                _active: {
                    bg: 'brand.700',
                },
            },
            outline: {
                borderColor: 'brand.500',
                color: 'brand.500',
                _hover: {
                    bg: 'brand.50',
                },
            },
            ghost: {
                color: 'gray.600',
                _hover: {
                    bg: 'brand.50',
                },
            },
        },
    },
    Input: {
        variants: {
            filled: {
                field: {
                    bg: 'gray.50',
                    _hover: {
                        bg: 'gray.100',
                    },
                    _focus: {
                        bg: 'white',
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    },
                },
            },
            outline: {
                field: {
                    borderColor: 'gray.200',
                    _focus: {
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    },
                },
            },
        },
    },
    Link: {
        baseStyle: {
            color: 'brand.500',
            _hover: {
                color: 'brand.600',
                textDecoration: 'none',
            },
        },
    },
    Heading: {
        baseStyle: {
            color: 'gray.800',
            _dark: {
                color: 'white',
            },
        },
    },
}

const styles = {
    global: (props) => ({
        body: {
            bg: props.colorMode === 'light' ? 'gray.50' : 'gray.900',
        },
    }),
}

const theme = extendTheme({
    config,
    colors,
    fonts,
    components,
    styles,
})

export default theme 