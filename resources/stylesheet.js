let light = true;

function toggleColor() {
    light = !light;
    for (const stylesheet of document.styleSheets) {
        switch (stylesheet.title) {
        case 'light':
            stylesheet.disabled = !light;
            break;
        case 'dark':
            stylesheet.disabled = light;
            break;
        }
    }
}

export function attachColorChangeHandler(element) {
    element.onclick = toggleColor;
}