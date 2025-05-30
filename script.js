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
            // Get the text color from the data-text-color attribute
            const textColor = box.getAttribute('data-text-color');

            // Apply the background color to the popup content
            if (popupColor) {
                popupContent.style.backgroundColor = popupColor;
            } else {
                // Fallback color if data-popup-color is not defined for a box
                popupContent.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dunkelgrau als Fallback
            }

            // Apply the text color to the popup text
            if (textColor) {
                popupText.style.color = textColor;
                // Da popupText innerHTML enthält, müssen wir möglicherweise die Farbe auch direkt auf die Kinder anwenden
                // Dies ist eine robustere Methode, falls der Inhalt des Popups weitere Elemente wie Überschriften oder Absätze hat.
                Array.from(popupText.children).forEach(child => {
                    child.style.color = textColor;
                });
            } else {
                // Fallback text color for the popup
                popupText.style.color = '#060606'; // Dunkelgrau als Fallback
                Array.from(popupText.children).forEach(child => {
                    child.style.color = '#060606';
                });
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
                // Entferne die inline gesetzte Hintergrundfarbe und Textfarbe, damit die CSS-Standardwerte wieder gelten
                popupContent.style.removeProperty('background-color');
                popupText.style.removeProperty('color');
                Array.from(popupText.children).forEach(child => {
                    child.style.removeProperty('color');
                });
                popupContent.removeEventListener('transitionend', handler);
                clickedBox.removeAttribute('data-current-open');
            });
        } else {
            popup.style.display = 'none';
            popupContent.style.removeProperty('background-color');
            popupText.style.removeProperty('color');
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
                    // Entferne die inline gesetzte Hintergrundfarbe und Textfarbe
                    popupContent.style.removeProperty('background-color');
                    popupText.style.removeProperty('color');
                    Array.from(popupText.children).forEach(child => {
                        child.style.removeProperty('color');
                    });
                    popupContent.removeEventListener('transitionend', handler);
                    clickedBox.removeAttribute('data-current-open');
                });
            } else {
                popup.style.display = 'none';
                popupContent.style.removeProperty('background-color');
                popupText.style.removeProperty('color');
            }
        }
    });

    popup.querySelector('.popup-content').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // --- NEUER CODE FÜR VOLLBILD-BILDER ---

    // Erstelle das Vollbild-Overlay-Element
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.classList.add('fullscreen-overlay');
    document.body.appendChild(fullscreenOverlay);

    // Event Listener für Klicks auf Bilder innerhalb des Popups
    popupText.addEventListener('click', (event) => {
        // Überprüfen, ob das geklickte Element ein Bild ist und im 'image-grid' ist
        if (event.target.tagName === 'IMG' && event.target.closest('.image-grid')) {
            const imageUrl = event.target.src;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;

            // Entferne alle vorherigen Kinder und füge das neue Bild hinzu
            fullscreenOverlay.innerHTML = '';
            fullscreenOverlay.appendChild(imgElement);
            fullscreenOverlay.style.display = 'flex'; // Zeigt das Overlay an
        }
    });

    // Event Listener zum Schließen des Vollbild-Overlays
    fullscreenOverlay.addEventListener('click', () => {
        fullscreenOverlay.style.display = 'none'; // Blendet das Overlay aus
        fullscreenOverlay.innerHTML = ''; // Entfernt das Bild aus dem Overlay
    });
});