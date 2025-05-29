document.addEventListener('DOMContentLoaded', () => {
    // Select boxes that have a data-target attribute
    const clickableBoxes = document.querySelectorAll('.box[data-target]');
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const closeButton = document.querySelector('.close-button');
    const popupContent = document.querySelector('.popup-content');

    // Add a CSS class to hide the hidden content divs
    const style = document.createElement('style');
    style.innerHTML = '.popup-hidden-content { display: none; }';
    document.head.appendChild(style);


    clickableBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const targetId = box.getAttribute('data-target');
            const hiddenContentElement = document.getElementById(targetId);

            if (hiddenContentElement) {
                // Use innerHTML to preserve any HTML formatting within the hidden content
                popupText.innerHTML = hiddenContentElement.innerHTML;
            } else {
                popupText.textContent = 'No content found for this section.';
            }

            // Get the color from the data-popup-color attribute
            const popupColor = box.getAttribute('data-popup-color');

            // Apply the new background color to the popup content
            // If data-popup-color is not set, it will default to a fallback or inherit
            if (popupColor) {
                popupContent.style.backgroundColor = popupColor;
            } else {
                // Fallback color if data-popup-color is not defined for a box
                popupContent.style.backgroundColor = `rgba(0, 0, 0, 0.8)`;
            }

            const boxRect = box.getBoundingClientRect();

            popupContent.style.left = `${boxRect.left}px`;
            popupContent.style.top = `${boxRect.top}px`;
            popupContent.style.width = `${boxRect.width}px`;
            popupContent.style.height = `${boxRect.height}px`;
            popupContent.style.opacity = '0';

            popup.style.display = 'flex';

            requestAnimationFrame(() => {
                popupContent.style.transition = 'all 0.4s ease-out';
                popupContent.style.left = '50%';
                popupContent.style.top = '50%';
                popupContent.style.width = '80vw';
                popupContent.style.maxWidth = '600px';
                popupContent.style.height = 'auto';
                popupContent.style.transform = 'translate(-50%, -50%)';
                popupContent.style.opacity = '1';
            });

            // Store the currently opened box
            const previouslyOpenedBox = document.querySelector('.box[data-current-open="true"]');
            if (previouslyOpenedBox) {
                previouslyOpenedBox.removeAttribute('data-current-open');
            }
            box.setAttribute('data-current-open', 'true');
        });
    });

    closeButton.addEventListener('click', () => {
        const clickedBox = document.querySelector('.box[data-target][data-current-open="true"]');

        if (clickedBox) {
            const boxRect = clickedBox.getBoundingClientRect();

            popupContent.style.transition = 'all 0.3s ease-in';
            popupContent.style.left = `${boxRect.left}px`;
            popupContent.style.top = `${boxRect.top}px`;
            popupContent.style.width = `${boxRect.width}px`;
            popupContent.style.height = `${boxRect.height}px`;
            popupContent.style.opacity = '0';
            popupContent.style.transform = 'translate(0, 0)';

            popupContent.addEventListener('transitionend', function handler() {
                popup.style.display = 'none';
                popupContent.style.removeProperty('transition');
                // Reset background color when closing to avoid affecting next popup if it's not colored
                popupContent.style.removeProperty('background-color');
                popupContent.removeEventListener('transitionend', handler);
                clickedBox.removeAttribute('data-current-open');
            });
        } else {
            popup.style.display = 'none';
            popupContent.style.removeProperty('background-color');
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            const clickedBox = document.querySelector('.box[data-target][data-current-open="true"]');

            if (clickedBox) {
                const boxRect = clickedBox.getBoundingClientRect();

                popupContent.style.transition = 'all 0.3s ease-in';
                popupContent.style.left = `${boxRect.left}px`;
                popupContent.style.top = `${boxRect.top}px`;
                popupContent.style.width = `${boxRect.width}px`;
                popupContent.style.height = `${boxRect.height}px`;
                popupContent.style.opacity = '0';
                popupContent.style.transform = 'translate(0, 0)';

                popupContent.addEventListener('transitionend', function handler() {
                    popup.style.display = 'none';
                    popupContent.style.removeProperty('transition');
                    // Reset background color when closing
                    popupContent.style.removeProperty('background-color');
                    popupContent.removeEventListener('transitionend', handler);
                    clickedBox.removeAttribute('data-current-open');
                });
            } else {
                popup.style.display = 'none';
                popupContent.style.removeProperty('background-color');
            }
        }
    });

    popup.querySelector('.popup-content').addEventListener('click', (event) => {
        event.stopPropagation();
    });
});