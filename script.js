document.addEventListener('DOMContentLoaded', () => {
        const video = document.getElementById('introVideo');
    const videoOverlay = document.getElementById('video-overlay');
    let fadeStartTime = 0;
    const fadeDuration = 300;

    video.addEventListener('timeupdate', function() {
        const timeLeft = video.duration - video.currentTime;
        if (timeLeft <= (fadeDuration / 300) && fadeStartTime === 0) {
            fadeStartTime = video.currentTime; 
        }

        if (fadeStartTime > 0) {
            const timeSinceFadeStart = video.currentTime - fadeStartTime;
            let opacity = 1 - (timeSinceFadeStart / (fadeDuration / 300)); 
            if (opacity < 0) {
                opacity = 0;
            }
            videoOverlay.style.opacity = opacity; // Setze die Opazität des Overlays

            // Wenn die Opazität 0 erreicht hat, verstecke das Overlay komplett
            if (opacity === 0) {
                videoOverlay.classList.add('hidden');
                // Optional: Video pausieren und zurückspulen, um Ressourcen zu sparen
                video.pause();
                video.currentTime = 0;
            }
        }
    });

    // Optional: Wenn das Video aus irgendeinem Grund nicht abspielen kann,
    // oder wenn es zu Ende ist und der timeupdate-Event nicht perfekt greift,
    // kannst du auch den 'ended' Event nutzen, um das Overlay zu entfernen.
    video.addEventListener('ended', function() {
        // Falls der timeupdate-Mechanismus das Overlay nicht komplett ausgeblendet hat,
        // sorge hier dafür, dass es verschwindet.
        if (!videoOverlay.classList.contains('hidden')) {
            videoOverlay.style.opacity = 0;
            videoOverlay.classList.add('hidden');
            // Optional: Nach einer kurzen Verzögerung das Element entfernen, wenn du es nicht mehr benötigst
            // setTimeout(() => {
            //     videoOverlay.remove();
            // }, 500); // Warte kurz, damit die CSS-Transition abgeschlossen werden kann
        }
    });

    // Optional: Füge eine Fallback-Logik hinzu, falls das Video nicht lädt
    video.addEventListener('error', function() {
        console.error('Fehler beim Laden des Videos.');
        videoOverlay.style.opacity = 0;
        videoOverlay.classList.add('hidden');
    });

    const clickableBoxes = document.querySelectorAll('.box[data-target]');
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const closeButton = document.querySelector('.close-button');
    const popupContent = document.querySelector('.popup-content');
    const logo = document.getElementById('logo');
    const l21DesignText = document.getElementById('l21-design');
    const body = document.body;
    let isCremeMode = true;
    const style = document.createElement('style');
    style.innerHTML = '.popup-hidden-content { display: none; }';
    document.head.appendChild(style);


    clickableBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const targetId = box.getAttribute('data-target');
            const hiddenContentElement = document.getElementById(targetId);

            if (hiddenContentElement) {
                popupText.innerHTML = hiddenContentElement.innerHTML;
            } else {
                popupText.textContent = 'No content found for this section.';
            }

            const popupColor = box.getAttribute('data-popup-color');
            const textColor = box.getAttribute('data-text-color');

            if (popupColor) {
                popupContent.style.background = popupColor;
            } else {
                popupContent.style.background = '';
            }

            if (textColor) {
                popupText.style.color = textColor;
                Array.from(popupText.children).forEach(child => {
                    child.style.color = textColor;
                });
                closeButton.style.color = textColor;
            } else {
                popupText.style.color = '#060606';
                Array.from(popupText.children).forEach(child => {
                    child.style.color = '#060606';
                });
                closeButton.style.color = '#fff';
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
                popupContent.scrollTop = 0;
                popupText.scrollTop = 0;
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
                popupContent.style.background = '';
                popupContent.style.removeProperty('transition');
                popupContent.style.removeProperty('background-color');
                popupText.style.removeProperty('color');
                Array.from(popupText.children).forEach(child => {
                    child.style.removeProperty('color');
                });
                closeButton.style.removeProperty('color');
                popupContent.removeEventListener('transitionend', handler);
                clickedBox.removeAttribute('data-current-open');
                popupContent.scrollTop = 0;
                popupText.scrollTop = 0;
            });
        } else {
            popup.style.display = 'none';
            popupContent.style.removeProperty('background-color');
            popupText.style.removeProperty('color');
            closeButton.style.removeProperty('color');
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
                    popupContent.style.removeProperty('background-color');
                    popupText.style.removeProperty('color');
                    Array.from(popupText.children).forEach(child => {
                        child.style.removeProperty('color');
                    });
                    closeButton.style.removeProperty('color');
                    popupContent.removeEventListener('transitionend', handler);
                    clickedBox.removeAttribute('data-current-open');
                    popupContent.scrollTop = 0;
                    popupText.scrollTop = 0;
                });
            } else {
                popup.style.display = 'none';
                popupContent.style.removeProperty('background-color');
                popupText.style.removeProperty('color');
                closeButton.style.removeProperty('color');
                popupContent.scrollTop = 0;
                popupText.scrollTop = 0;
            }
        }
    });

    popup.querySelector('.popup-content').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.classList.add('fullscreen-overlay');
    document.body.appendChild(fullscreenOverlay);
    popupText.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG' && event.target.closest('.image-grid')) {
            const imageUrl = event.target.src;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            fullscreenOverlay.innerHTML = '';
            fullscreenOverlay.appendChild(imgElement);
            fullscreenOverlay.style.display = 'flex';
        }
    });

    fullscreenOverlay.addEventListener('click', () => {
        fullscreenOverlay.style.display = 'none';
        fullscreenOverlay.innerHTML = '';
    });

    logo.addEventListener('click', () => {
        if (isCremeMode) {
            body.classList.remove('creme-bg');
            l21DesignText.src = 'L21design_weiß.png';
            logo.src = 'Logov2_weiß.png';
        } else {
            body.classList.add('creme-bg');
            l21DesignText.src = 'L21design_schwarz.png';
            logo.src = 'Logov2_schwarz.png';
        }
        isCremeMode = !isCremeMode;
    });
});