const scene = new THREE.Scene();

      
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Add OrbitControls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;

        // Define planets with multiple textures
        const planets = [
            {
                
                description: "Deforestation",
                textures: [
                    '1.png',
                    'texture.jpg',
                    'deforestation3.jpg'
                ],
                currentTextureIndex: 0,
                detailedInfo: "Deforestation is the large-scale removal of forests, which leads to habitat loss, reduced biodiversity, and increased carbon emissions."
            },
            {
                color: 0x0000ff,
                description: "Ocean Pollution",
                textures: [
                    'oceanpollute.jpg',
                    'ocean2.jpg',
                    'ocean3.jpg'
                ],
                currentTextureIndex: 0,
                detailedInfo: "Ocean pollution severely impacts marine ecosystems through plastic waste, chemical runoff, and oil spills."
            },
            {
                color: 0xff0000,
                description: "Wildfire",
                textures: [
                    'wildfire.jpg',
                    'wildfire2.jpg',
                    'wildfire3.jpg'
                ],
                currentTextureIndex: 0,
                detailedInfo: "Wildfires are increasingly destructive due to climate change and drought conditions."
            },
            {
                color: 0xffff00,
                description: "Air Pollution",
                textures: [
                    'air.jpg',
                    'air2.jpg',
                    'air3.jpg'
                ],
                currentTextureIndex: 0,
                detailedInfo: "Air pollution affects billions globally through smog, particulate matter, and greenhouse gases."
            }
        ];

        let currentPlanetIndex = 0;

        // Create sphere
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        let material = new THREE.MeshPhongMaterial({ color: planets[currentPlanetIndex].color });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Set camera position
        camera.position.z = 5;

        // Create texture loader
        const textureLoader = new THREE.TextureLoader();

        // Create glow effect
        const glowGeometry = new THREE.TorusGeometry(1.2, 0.07, 16, 100);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        glowSphere.visible = false;
        scene.add(glowSphere);

        // Function to change texture
        function changeTexture(direction) {
            const planet = planets[currentPlanetIndex];
            if (!planet.textures || planet.textures.length <= 1) return;

            if (direction === 'next') {
                planet.currentTextureIndex = (planet.currentTextureIndex + 1) % planet.textures.length;
            } else {
                planet.currentTextureIndex = (planet.currentTextureIndex - 1 + planet.textures.length) % planet.textures.length;
            }

            textureLoader.load(planet.textures[planet.currentTextureIndex], (texture) => {
                sphere.material.map = texture;
                sphere.material.needsUpdate = true;
            });
        }

        // Function to update planet
        function updatePlanet(index) {
            const planet = planets[index];
            if (planet.textures && planet.textures.length > 0) {
                textureLoader.load(planet.textures[planet.currentTextureIndex], (texture) => {
                    sphere.material.map = texture;
                    sphere.material.needsUpdate = true;
                });
            } else {
                sphere.material.color.setHex(planet.color);
            }
            
            document.getElementById("info").innerText = planet.description;
            document.getElementById("planetTitle").innerText = planet.description;
            document.getElementById("dialogContent").innerHTML = planet.detailedInfo;
            
            const dialogBox = document.querySelector('.game-dialog');
            dialogBox.style.transform = 'translateX(-50%) scale(1.05)';
            setTimeout(() => {
                dialogBox.style.transform = 'translateX(-50%) scale(1)';
            }, 200);
        }

        // Mouse interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(sphere);
            
            if (intersects.length > 0) {
                glowSphere.visible = true;
                glowSphere.position.copy(sphere.position);
            } else {
                glowSphere.visible = false;
            }
        }

        window.addEventListener('mousemove', onMouseMove);

        // Button event listeners
        document.getElementById("leftButton").addEventListener("click", () => {
            currentPlanetIndex = (currentPlanetIndex - 1 + planets.length) % planets.length;
            updatePlanet(currentPlanetIndex);
        });

        document.getElementById("rightButton").addEventListener("click", () => {
            currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
            updatePlanet(currentPlanetIndex);
        });

        document.getElementById("prevTexture").addEventListener("click", () => {
            changeTexture('prev');
        });

        document.getElementById("nextTexture").addEventListener("click", () => {
            changeTexture('next');
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        // Create star field
        function createStarField() {
            const starGeometry = new THREE.BufferGeometry();
            const starCount = 1500;
            const starPositions = new Float32Array(starCount * 3);
            
            for (let i = 0; i < starCount * 3; i++) {
                starPositions[i] = (Math.random() - 0.5) * 50;
            }

            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            
            const starMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.1
            });

            const starField = new THREE.Points(starGeometry, starMaterial);
            scene.add(starField);
        }

        createStarField();

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            sphere.rotation.y += 0.0002;
            glowSphere.lookAt(camera.position);
            controls.update();
            renderer.render(scene, camera);
        }

        // Initialize the scene
        updatePlanet(currentPlanetIndex);
        animate();