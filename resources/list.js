const listItemSelectedClassName = 'list-item-selected';

function createClickHandler(clickHandler, htmlElement) {
    return () => {
        const selectedElements = document.getElementsByClassName(listItemSelectedClassName);
        for (const element of selectedElements) {
            element.classList.remove(listItemSelectedClassName);
        }
        htmlElement.classList.add(listItemSelectedClassName);
        clickHandler();
    };
}

export function createListItem(text, tooltip, clickHandler) {
    const retVal = document.createElement('div');
    retVal.classList.add('list-item-base');
    retVal.innerHTML = text;
    retVal.title = tooltip;
    retVal.onclick = createClickHandler(clickHandler, retVal);
    return retVal;
}

export function createListSeparator() {
    const retVal = document.createElement('div');
    retVal.classList.add('list-separator');
    return retVal;
}

export function applyListObjects(containerElement, listObjects) {
    containerElement.classList.add('list-container');
    for (const listObject of listObjects) {
        containerElement.appendChild(listObject);
    }
}
