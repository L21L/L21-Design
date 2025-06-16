
    // Importiere die notwendigen Three.js Module
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Für die Steuerung des Modells


        
document.addEventListener('DOMContentLoaded', () => {
        const video = document.getElementById('introVideo');
    const videoOverlay = document.getElementById('video-overlay');
    // Selektiere alle 3D-Modell Buttons
    const view3DButtons = document.querySelectorAll('.view-3d-button');
    console.log('view3DButtons gefunden:', view3DButtons); // Dieser Log ist neu
    console.log('Anzahl der gefundenen .view-3d-button Elemente:', view3DButtons.length); // Dieser Log sollte bereits da sein
    // Selektiere das 3D-Modal Element
    const modal3D = document.querySelector('.modal-3d');
    // Selektiere das Element, das den 3D-Inhalt hosten wird
    const modal3DContent = document.querySelector('.modal-3d-content');

        let scene, camera, renderer, model, controls;

        function isSmallScreen() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    if (isSmallScreen()) {
        // Wenn es ein kleiner Bildschirm ist, verstecke das Video-Overlay sofort
        videoOverlay.style.display = 'none';
        // Optional: Video pausieren und zurückspulen, um Ressourcen zu sparen
        video.pause();
        video.currentTime = 0;
    }
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

    document.body.addEventListener('click', (event) => {
    console.log('Klick auf Body:', event.target);
}, true); // Verwende true für den Capturing-Phase

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

    // Funktion zum Initialisieren der Three.js Szene
    function init3DScene(modelPath) {
        // Aufräumen der vorherigen Szene, falls vorhanden
        if (scene) {
            scene.traverse(object => {
                if (!object.isMesh) return;
                object.geometry.dispose();
                if (object.material.isMaterial) {
                    cleanMaterial(object.material);
                } else {
                    for (const material of object.material) cleanMaterial(material);
                }
            });
            renderer.dispose();
            renderer.domElement.remove();
        }

        // Szene erstellen
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2c2c2c); // Hintergrundfarbe des Modals

        // Kamera erstellen
        camera = new THREE.PerspectiveCamera(75, modal3DContent.clientWidth / modal3DContent.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 5); // Anfangsposition der Kamera

        // Renderer erstellen
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(modal3DContent.clientWidth, modal3DContent.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        modal3DContent.appendChild(renderer.domElement);

        // Beleuchtung hinzufügen
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Weiches Umgebungslicht
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Direktionales Licht
        directionalLight.position.set(0, 10, 10);
        scene.add(directionalLight);

        // OrbitControls hinzufügen (ermöglicht Drehen, Zoomen, Verschieben mit der Maus)
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Ermöglicht ein "sanfteres" Gefühl
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 50;

        // GLTF-Loader initialisieren und Modell laden
        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            model = gltf.scene;
            // Skaliere das Modell, falls es zu groß oder zu klein ist.
            // Dies ist oft notwendig, um es in den Viewport zu passen.
            // Du musst diesen Wert eventuell anpassen.
            model.scale.set(1, 1, 1);
            scene.add(model);

            // Optional: Modell zentrieren und Kamera anpassen
            const bbox = new THREE.Box3().setFromObject(model);
            const center = bbox.getCenter(new THREE.Vector3());
            const size = bbox.getSize(new THREE.Vector3());

            // Modell so verschieben, dass es im Ursprung zentriert ist
            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);

            // Kamera neu positionieren, um das gesamte Modell zu sehen
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.2; // Etwas extra Abstand

            camera.position.z = cameraZ;
            camera.position.y = size.y / 2; // Eventuell anpassen, um es vertikal zu zentrieren
            camera.lookAt(0, 0, 0); // Schaut auf den Ursprung
            controls.update(); // Wichtig, damit die Controls die neue Kameraposition übernehmen

        }, undefined, (error) => {
            console.error('An error occurred while loading the 3D model:', error);
        });

        // Animations-Loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update(); // Nur notwendig, wenn damping an ist
            renderer.render(scene, camera);
        }
        animate();

        // Handle window resize
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        if (camera && renderer && modal3D.style.display === 'flex') { // Nur anpassen, wenn das Modal sichtbar ist
            camera.aspect = modal3DContent.clientWidth / modal3DContent.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(modal3DContent.clientWidth, modal3DContent.clientHeight);
        }
    }

    // Funktion zum Aufräumen von Materialien
    function cleanMaterial(material) {
        if (material.map) material.map.dispose();
        if (material.lightMap) material.lightMap.dispose();
        if (material.bumpMap) material.bumpMap.dispose();
        if (material.normalMap) material.normalMap.dispose();
        if (material.specularMap) material.specularMap.dispose();
        if (material.envMap) material.envMap.dispose();
        if (material.alphaMap) material.alphaMap.dispose();
        if (material.aoMap) material.aoMap.dispose();
        if (material.displacementMap) material.displacementMap.dispose();
        if (material.emissiveMap) material.emissiveMap.dispose();
        if (material.metalnessMap) material.metalnessMap.dispose();
        if (material.roughnessMap) material.roughnessMap.dispose();
        if (material.clearcoatMap) material.clearcoatMap.dispose();
        if (material.clearcoatNormalMap) material.clearcoatNormalMap.dispose();
        if (material.clearcoatRoughnessMap) material.clearcoatRoughnessMap.dispose();
        if (material.iridescenceMap) material.iridescenceMap.dispose();
        if (material.transmissionMap) material.transmissionMap.dispose();
        if (material.thicknessMap) material.thicknessMap.dispose();
        material.dispose();
    }


// In script.js, um Zeile 396
view3DButtons.forEach(button => {
    // ÄNDERUNG: Reduziere den Event-Listener auf das absolute Minimum für den Test
    button.addEventListener('click', (event) => {
        console.log('!!!!!!! 3D-Modell Button WIRKLICH geklickt !!!!!!!'); // Neuer, auffälliger Log
        alert('Button wurde geklickt!'); // Eine sichtbare Bestätigung, die sofort angezeigt wird
        event.preventDefault(); // Verhindert jegliches Standardverhalten des Buttons
        event.stopPropagation(); // Stoppt die Event-Propagation sofort, um andere Listener auszuschließen
    });

    // WICHTIG: Kommentieren Sie hier *alles andere* aus, was innerhalb dieses
    // 'click'-Callbacks stand, um mögliche Nebenwirkungen auszuschließen.
    /*
    const modelPath = button.dataset.modelPath;
    if (modelPath) {
        modal3D.style.display = 'flex';
        init3DScene(modelPath);
    } else {
        console.warn('Kein model-path Attribut für diesen 3D-Button gefunden.');
    }
    */
});

    // Event Listener, um das 3D-Modal zu schließen, wenn außerhalb des Inhalts geklickt wird
    console.log('modal3D vor addEventListener:', modal3D);
console.log('modal3DContent vor addEventListener:', modal3DContent);
modal3D.addEventListener('click', (event) => { // Zeile 415
    event.stopPropagation();
});
    modal3D.addEventListener('click', (event) => {
        if (event.target === modal3D) {
            modal3D.style.display = 'none'; // Verstecke das 3D-Modal
            // Optional: Hier könntest du die Three.js Szene aufräumen, um Speicher freizugeben.
            // Die init3DScene-Funktion macht dies bereits beim erneuten Laden eines Modells.
            // Wenn du das Modal komplett leeren möchtest, wenn es geschlossen wird:
            if (renderer) {
                renderer.dispose();
                renderer.domElement.remove();
                scene = null;
                camera = null;
                renderer = null;
                model = null;
                controls = null;
                window.removeEventListener('resize', onWindowResize); // Listener entfernen
            }
        }
    });

    // Event Listener, um zu verhindern, dass Klicks innerhalb des modal-3d-content das Modal schließen
    modal3DContent.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Füge einen Schließen-Button hinzu (optional, aber empfohlen für gute UX)
    // Du müsstest diesen Button auch in deinem HTML im .modal-3d-content hinzufügen.
    // Beispiel: <span class="close-button-3d">&times;</span>
    const closeButton3D = document.querySelector('.close-button-3d');
    if (closeButton3D) {
        closeButton3D.addEventListener('click', () => {
            modal3D.style.display = 'none';
            if (renderer) {
                renderer.dispose();
                renderer.domElement.remove();
                scene = null;
                camera = null;
                renderer = null;
                model = null;
                controls = null;
                window.removeEventListener('resize', onWindowResize);
            }
        });
    }
});