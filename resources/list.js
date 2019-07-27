const listItemSelectedClassName = 'list-item-selected';

export class ListCreator {
    constructor(cssPrefix) {
        this.cssPrefix = cssPrefix;
        this.elements = [];
    }
    
    addItem(text, tooltip, clickHandler) {
        const retVal = document.createElement('button');
        retVal.classList.add(this.cssPrefix + 'list-item-base');
        retVal.textContent = text;
        retVal.title = tooltip;
        retVal.onclick = this.createSelectionClickHandler(clickHandler, retVal);
        this.elements.push(retVal);
    }
    
    addSeparator() {
        const retVal = document.createElement('div');
        retVal.classList.add(this.cssPrefix + 'list-separator');
        this.elements.push(retVal);
    }
    
    applyToElement(containerElement) {
        for (const listObject of this.elements) {
            containerElement.appendChild(listObject);
        }
    }

    createSelectionClickHandler(clickHandler, htmlElement) {
        return () => {
            for (const element of this.elements) {
                element.classList.remove(this.cssPrefix + listItemSelectedClassName);
            }
            htmlElement.classList.add(this.cssPrefix + listItemSelectedClassName);
            clickHandler();
        };
    }
}