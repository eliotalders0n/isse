import { extendTheme } from '@chakra-ui/react';

// Warm relationship coach color palette
const theme = extendTheme({
  colors: {
    warm: {
      50: '#FFF5F0',
      100: '#FFE8DB',
      200: '#FFD4BB',
      300: '#FFBC96',
      400: '#FFA071',
      500: '#FF8556',  // Primary warm coral
      600: '#F86D42',
      700: '#E55533',
      800: '#C9432A',
      900: '#A63522',
    },
    peach: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',  // Warm orange
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    rose: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      200: '#FECDD3',
      300: '#FDA4AF',
      400: '#FB7185',
      500: '#F43F5E',  // Warm pink
      600: '#E11D48',
      700: '#BE123C',
      800: '#9F1239',
      900: '#881337',
    },
    sand: {
      50: '#FAFAF9',
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917',
    },
  },
  fonts: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'warm.50',
        color: 'sand.800',
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
          bg: 'warm.500',
          color: 'white',
          _hover: {
            bg: 'warm.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'warm.700',
          },
        },
      },
      defaultProps: {
        colorScheme: 'warm',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          overflow: 'hidden',
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
