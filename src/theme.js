import { extendTheme } from '@chakra-ui/react';

// Duo-tone black & white with dark purple accents
const theme = extendTheme({
  colors: {
    dark: {
      50: '#F5F5F5',   // Very light gray (for subtle backgrounds on white)
      100: '#E0E0E0',  // Light gray
      200: '#BDBDBD',  // Medium-light gray
      300: '#9E9E9E',  // Medium gray
      400: '#757575',  // Medium-dark gray
      500: '#616161',  // Dark gray
      600: '#424242',  // Darker gray
      700: '#303030',  // Very dark gray
      800: '#1A1A1A',  // Near black
      900: '#0A0A0A',  // Background near-black
    },
    accent: {
      50: '#F5F3FF',   // Very light purple (for subtle backgrounds)
      100: '#EDE9FE',  // Light purple
      200: '#DDD6FE',  // Medium-light purple
      300: '#C4B5FD',  // Medium purple
      400: '#A78BFA',  // Medium-bright purple
      500: '#8B5CF6',  // Bright purple
      600: '#5B21B6',  // Deep purple (primary accent)
      700: '#4C1D95',  // Darker purple
      800: '#3B1A75',  // Very dark purple
      900: '#2E1065',  // Deepest purple
    },
    light: {
      50: '#FFFFFF',   // Pure white (card backgrounds)
      100: '#FAFAFA',  // Off-white
      200: '#F5F5F5',  // Very light gray
    },
    // Legacy aliases for backwards compatibility (mapped to new colors)
    warm: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#5B21B6',  // Maps to accent
      700: '#4C1D95',
      800: '#3B1A75',
      900: '#2E1065',
    },
    peach: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#5B21B6',  // Maps to accent
      700: '#4C1D95',
      800: '#3B1A75',
      900: '#2E1065',
    },
    rose: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#5B21B6',  // Maps to accent
      700: '#4C1D95',
      800: '#3B1A75',
      900: '#2E1065',
    },
    sand: {
      50: '#F5F5F5',
      100: '#E0E0E0',
      200: '#BDBDBD',
      300: '#9E9E9E',
      400: '#757575',
      500: '#616161',
      600: '#424242',
      700: '#303030',
      800: '#1A1A1A',
      900: '#0A0A0A',  // Maps to dark
    },
  },
  fonts: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'dark.900',
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'full',
      },
      variants: {
        solid: {
          bg: 'accent.600',
          color: 'white',
          _hover: {
            bg: 'accent.700',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'accent.800',
          },
        },
      },
      defaultProps: {
        colorScheme: 'purple',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          overflow: 'hidden',
          bg: 'white',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
        fontWeight: '600',
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
