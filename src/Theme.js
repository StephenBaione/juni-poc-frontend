import { createTheme, colors } from "@mui/material";

const theme = createTheme({
    // mode: 'dark',
    palette: {
        // primary: {
        //     main: '#F0EAD6',
        // },

        // current color scheme
        pinkGradient: {
            main: 'linear-gradient(#7a3cb6, #bf5e94)',
        },
        background: {
            main: '#242728',
            secondary: 'rgba(48, 48, 48, 0.7)',
        },
        scrollbar: {
            main: '#868686'
        },
        dropShadow: {
            main: 'rgba(0, 0, 0, 0.32)'
        },

        // component specific
        ListItem: {
            textSecondary: '#F0EAD6'
        },
        flowBuilder: {
            buttonBackground: '#7a3cb6',
        },

        // screen and window specific
        avatarScreen: {
            background: 'linear-gradient(#6f36bc, #dc6c84)',
            speakBackground: '#222222',
            label: '#777777'
        },
        chatWindow: {
            background: '#212121',
        }
    },
});

export default theme;