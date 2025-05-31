document.addEventListener('DOMContentLoaded', () => {
    // Select boxes that have a data-target attribute
    const clickableBoxes = document.querySelectorAll('.box[data-target]');
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const closeButton = document.querySelector('.close-button');
    const popupContent = document.querySelector('.popup-content');

    // Elemente für die Logo-Funktion
    const logo = document.getElementById('logo');
    const l21DesignText = document.getElementById('l21-design');
    const body = document.body;

    // Zustand, um den aktuellen Stil zu verfolgen
    let isCremeMode = true; // Changed this to true for default creme mode

    // Add a CSS class to hide the hidden content divs
    const style = document.createElement('style');
    style.innerHTML = '.popup-hidden-content { display: none; }';
    document.head.appendChild(style);

    // Apply the initial creme mode styles on load
    body.classList.add('creme-bg'); // Apply creme background initially
    l21DesignText.style.color = '#000000'; // Black text for creme mode
    logo.src = 'Logo_schwarz.png'; // Black logo for creme mode


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
                popupContent.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dunkelgrau als Fallback
            }

            // Apply the text color to the popup text
            if (textColor) {
                popupText.style.color = textColor;
                // Auch für die Kinder des popupText-Elements
                Array.from(popupText.children).forEach(child => {
                    child.style.color = textColor;
                });
                // Setze die Farbe des Schließen-Buttons basierend auf der Textfarbe
                closeButton.style.color = textColor;
            } else {
                popupText.style.color = '#060606'; // Dunkelgrau als Fallback
                Array.from(popupText.children).forEach(child => {
                    child.style.color = '#060606';
                });
                // Setze die Farbe des Schließen-Buttons auf den Standard
                closeButton.style.color = '#fff'; // Standardmäßig weiß für den Close-Button
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

                // Reset scroll position when popup is opened
                popupContent.scrollTop = 0; // For the scrollable content within popupContent
                popupText.scrollTop = 0;    // If popupText itself has a scrollbar
            });

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
                popupContent.style.removeProperty('background-color');
                popupText.style.removeProperty('color');
                Array.from(popupText.children).forEach(child => {
                    child.style.removeProperty('color');
                });
                // Setze die Farbe des Schließen-Buttons auf den Standard zurück
                closeButton.style.removeProperty('color');
                popupContent.removeEventListener('transitionend', handler);
                clickedBox.removeAttribute('data-current-open');

                // Reset scroll position when popup is closed
                popupContent.scrollTop = 0;
                popupText.scrollTop = 0;
            });
        } else {
            popup.style.display = 'none';
            popupContent.style.removeProperty('background-color');
            popupText.style.removeProperty('color');
            // Setze die Farbe des Schließen-Buttons auf den Standard zurück
            closeButton.style.removeProperty('color');
            // Reset scroll position even if no clickedBox
            popupContent.scrollTop = 0;
            popupText.scrollTop = 0;
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
                    // Setze die Farbe des Schließen-Buttons auf den Standard zurück
                    closeButton.style.removeProperty('color');
                    popupContent.removeEventListener('transitionend', handler);
                    clickedBox.removeAttribute('data-current-open');
                    // Reset scroll position when popup is closed by clicking outside
                    popupContent.scrollTop = 0;
                    popupText.scrollTop = 0;
                });
            } else {
                popup.style.display = 'none';
                popupContent.style.removeProperty('background-color');
                popupText.style.removeProperty('color');
                // Setze die Farbe des Schließen-Buttons auf den Standard zurück
                closeButton.style.removeProperty('color');
                // Reset scroll position even if no clickedBox
                popupContent.scrollTop = 0;
                popupText.scrollTop = 0;
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

    // --- NEUER CODE FÜR LOGO-KLICK ---
    logo.addEventListener('click', () => {
        if (isCremeMode) {
            // Wechsel zurück zum dunklen Modus
            body.classList.remove('creme-bg');
            l21DesignText.style.color = 'rgb(240, 231, 231)'; // Ursprüngliche Farbe
            logo.src = 'Logo_weiß.png'; // Ursprüngliches Logo
        } else {
            // Wechsel zum cremefarbenen Modus
            body.classList.add('creme-bg');
            l21DesignText.style.color = '#000000'; // Schwarze Schrift
            logo.src = 'Logo_schwarz.png'; // Neues Logo (du musst diese Datei hinzufügen)
        }
        isCremeMode = !isCremeMode; // Zustand umschalten
    });
});