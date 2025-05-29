document.addEventListener('DOMContentLoaded', () => {
    const clickableBoxes = document.querySelectorAll('.box[data-content]');
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const closeButton = document.querySelector('.close-button');

    clickableBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const content = box.getAttribute('data-content');
            popupText.textContent = content;
            popup.style.display = 'flex'; // Zeigt das Popup an
        });
    });

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none'; // Versteckt das Popup
    });

    // Schließt das Popup, wenn außerhalb des Inhalts geklickt wird
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Verhindert das Schließen des Popups bei Klick im Inhalt selbst
    popup.querySelector('.popup-content').addEventListener('click', (event) => {
        event.stopPropagation();
    });
});