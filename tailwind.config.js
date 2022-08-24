module.exports = {
    content: ["./src/**/*.{html,js}", "index.html", "detail.html"],
    darkMode: 'class',
    theme: {
        extend: { 
            fontFamily: {
                'nunito': ["'Nunito Sans'", 'sans-serif'],
            },
            keyframes: {
                'dropdown': {
                    '0%' : { opacity: 0.5 },
                    '100%' : { opacity: 1 }, 
                },
            },
            animation: {
                'dropdown' : 'dropdown 850ms',
            },
            colors: {
                'dark-mode-element' : 'hsl(209, 23%, 22%)',
                'dark-mode-background' : 'hsl(207, 26%, 17%)',
                'light-mode-text' : 'hsl(200, 15%, 8%)'
            },
        },
    },
    plugins: [],
}