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

// Audio elements
const audioElements = {
    "Deforestation": document.getElementById("deforestationAudio"),
    "Ocean Pollution": document.getElementById("oceanPollutionAudio"),
    "Wildfire": document.getElementById("wildfireAudio"),
    "Air Pollution": document.getElementById("airPollutionAudio")
};

const yearMap = ["1990", "2000", "2010", "2015"];
const yearSlider = document.getElementById('yearSlider');
const yearLabel = document.getElementById('yearLabel');


const styles = `
.slider-labels-container {
    position: relative;
    width: 100%;
    height: 40px;
    margin-top: 20px;
}

.slider-label {
    position: absolute;
    transform: translate(-50%, 0);
    font-size: 12px;
    color: #00ba9e;
    cursor: pointer;
    text-align: center;
    transition: color 0.3s ease;
}

.slider-label:hover {
    color: #00ba9e;
}

.slider {
    margin-bottom: 10px;
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


// Define planets with multiple textures and texture information
const planets = [
    {
        description: "Deforestation",
        textures: ['texture.jpg', "deforestation_photos/1.png", "deforestation_photos/2.png", "deforestation_photos/3.png", "deforestation_photos/4.png"],
        textureInfo: [
            {
                title: "Current Status ",
                content: "Current global deforestation rates show we're losing an area of forest equivalent to 27 soccer fields every minute.",
                description: "Green Area shows Increase in Forest Area, Red shows Loss, Black Shows No Data "
            },
            {
                title: "1990",
                content: "Historical satellite imagery reveals the dramatic change in forest cover over the past decades.",
                description: "Historical comparison of forest coverage (1990-2020)"
            },
            {
                title: "2000",
                content: "Predictive models suggest that without intervention, we could lose up to 30% more forest cover by 2050.",
                description: "Projected forest loss visualization"
            },
            {
                title: "2010",
                content: "Detailed analysis of deforestation impacts on specific regions and their ecosystems.",
                description: "Regional deforestation impact assessment"
            },
            {
                title: "2015",
                content: "Visualization of global reforestation projects and their progress in combating deforestation.",
                description: "Global reforestation initiatives"
            }
        ],
        currentTextureIndex: 0,
        sliderTheme: "deforestation",
        detailedInfo: "Deforestation is the large-scale removal of forests, leading to habitat loss and increased carbon emissions."
    },
    {
        description: "Ocean Pollution",
        textures: ['pollution_images/1.jpg', 'pollution_images/2.png', 'pollution_images/3.png'],
        textureInfo: [
            {
                title: "Plastic Pollution Crisis",
                content: "Over 8 million tons of plastic enter our oceans annually, forming massive garbage patches across major ocean gyres.",
                description: "Visualization of major ocean garbage patches"
            },
            {
                title: "Plastic In Ocean",
                content: "Industrial runoff and chemical pollutants create dead zones in our oceans, affecting thousands of marine species.",
                description: "Plastic waste emitted to the ocean per capita, 2019"
            },
            {
                title: "Clean Drinking Water ",
                content: "Safely managed drinking water services are defined as an improved drinking water source that is located on premises, available when needed and free from faecal and priority chemical contamination.",
                description: "This map shows the availability of clean drinking water."
            }
        ],
        currentTextureIndex: 0,
        sliderTheme: "ocean",
        detailedInfo: "Ocean pollution severely impacts marine ecosystems through plastic waste, chemical runoff, and oil spills."
    },
    {
        description: "Wildfire",
        textures: ['wildfire/1.png', 'wildfire/2.png', 'wildfire/3.png', 'wildfire/4.png', 'wildfire/5.png',"'wildfire/6.png'"],
        textureInfo: [
            {
                title: "2012",
                content: "Real-time satellite data reveals unprecedented scale of wildfires across multiple continents.",
                description: "Current global wildfire hotspots"
            },
            {
                title: "2014",
                content: "Analysis shows a 300% increase in extreme fire weather days in the past two decades.",
                description: "Two-decade wildfire trend analysis"
            },
            {
                title: "2016",
                content: "Climate models predict a 50% increase in high-risk fire days by 2050 in vulnerable regions.",
                description: "Future fire risk projection map"
            },
            {
                title: "2018",
                content: "Wildfires are transforming entire ecosystems, with some forests at risk of permanent conversion to shrubland.",
                description: "Ecosystem transformation assessment"
            },
            {
                title: "2020",
                content: "Advanced fire management techniques and community preparation efforts are crucial for wildfire resilience.",
                description: "Fire prevention and management systems"
            },
            {
                title: "2024",
                content: "Advanced fire management techniques and community preparation efforts are crucial for wildfire resilience.",
                description: "Fire prevention and management systems"
            }
        ],
        currentTextureIndex: 0,
        sliderTheme: "wildfire",
        detailedInfo: "Wildfires are increasingly destructive due to climate change and drought conditions."
    },
    {
        description: "Air Pollution",
        textures: ['air.jpg', 'air2.jpg', 'air3.jpg', 'air4.jpg', 'air5.jpg'],
        textureInfo: [
            {
                title: "Global Air Quality Index",
                content: "90% of the world's population breathes air exceeding WHO pollution guidelines.",
                description: "Real-time global air quality measurements"
            },
            {
                title: "Emission Sources",
                content: "Industrial facilities and urban centers produce 70% of global air pollutants.",
                description: "Major pollution source distribution"
            },
            {
                title: "Health Impact Assessment",
                content: "Air pollution causes 7 million premature deaths annually, with highest impact in developing regions.",
                description: "Global health impact visualization"
            },
            {
                title: "Atmospheric Transport",
                content: "Pollution patterns show how air quality issues cross national boundaries and affect distant regions.",
                description: "Air pollutant transport patterns"
            },
            {
                title: "Clean Air Solutions",
                content: "Cities implementing strict emission controls have seen up to 50% reduction in harmful pollutants.",
                description: "Successful air quality initiatives"
            }
        ],
        currentTextureIndex: 0,
        sliderTheme: "air",
        detailedInfo: "Air pollution affects billions globally through smog, particulate matter, and greenhouse gases."
    }
];
let currentPlanetIndex = 0;
let isAnimating = false;
let currentAudio = null;

// Audio control functions
function playAudio(planetName) {
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Play the new audio
    const audio = audioElements[planetName];
    if (audio) {
        audio.play();
        currentAudio = audio;
    }
}




let start = new Date().getTime();

const originPosition = { x: 0, y: 0 };

const last = {
  starTimestamp: start,
  starPosition: originPosition,
  mousePosition: originPosition
}

const config = {
  starAnimationDuration: 1500,
  minimumTimeBetweenStars: 250,
  minimumDistanceBetweenStars: 75,
  glowDuration: 75,
  maximumGlowPointSpacing: 10,
  colors: ["249 146 253", "252 254 255"],
  sizes: ["1.4rem", "1rem", "0.6rem"],
  animations: ["fall-1", "fall-2", "fall-3"]
}

let count = 0;
  
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      selectRandom = items => items[rand(0, items.length - 1)];

const withUnit = (value, unit) => `${value}${unit}`,
      px = value => withUnit(value, "px"),
      ms = value => withUnit(value, "ms");

const calcDistance = (a, b) => {
  const diffX = b.x - a.x,
        diffY = b.y - a.y;
  
  return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
}

const calcElapsedTime = (start, end) => end - start;

const appendElement = element => document.body.appendChild(element),
      removeElement = (element, delay) => setTimeout(() => document.body.removeChild(element), delay);

const createStar = position => {
  const star = document.createElement("span"),
        color = selectRandom(config.colors);
  
  star.className = "star fa-solid fa-sparkle";
  
  star.style.left = px(position.x);
  star.style.top = px(position.y);
  star.style.fontSize = selectRandom(config.sizes);
  star.style.color = `rgb(${color})`;
  star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
  star.style.animationName = config.animations[count++ % 3];
  star.style.starAnimationDuration = ms(config.starAnimationDuration);
  
  appendElement(star);

  removeElement(star, config.starAnimationDuration);
}

const createGlowPoint = position => {
  const glow = document.createElement("div");
  
  glow.className = "glow-point";
  
  glow.style.left = px(position.x);
  glow.style.top = px(position.y);
  
  appendElement(glow)
  
  removeElement(glow, config.glowDuration);
}

const determinePointQuantity = distance => Math.max(
  Math.floor(distance / config.maximumGlowPointSpacing),
  1
);

/* --  

The following is an explanation for the "createGlow" function below:

I didn't cover this in my video, but I ran into an issue where moving the mouse really quickly caused gaps in the glow effect. Kind of like this:

*   *       *       *    *      *    🖱️

instead of:

*************************************🖱️

To solve this I sort of "backfilled" some additional glow points by evenly spacing them in between the current point and the last one. I found this approach to be more visually pleasing than one glow point spanning the whole gap.

The "quantity" of points is based on the config property "maximumGlowPointSpacing".

My best explanation for why this is happening is due to the mousemove event only firing every so often. I also don't think this fix was totally necessary, but it annoyed me that it was happening so I took on the challenge of trying to fix it.

-- */
const createGlow = (last, current) => {
  const distance = calcDistance(last, current),
        quantity = determinePointQuantity(distance);
  
  const dx = (current.x - last.x) / quantity,
        dy = (current.y - last.y) / quantity;
  
  Array.from(Array(quantity)).forEach((_, index) => { 
    const x = last.x + dx * index, 
          y = last.y + dy * index;
    
    createGlowPoint({ x, y });
  });
}

const updateLastStar = position => {
  last.starTimestamp = new Date().getTime();

  last.starPosition = position;
}

const updateLastMousePosition = position => last.mousePosition = position;

const adjustLastMousePosition = position => {
  if(last.mousePosition.x === 0 && last.mousePosition.y === 0) {
    last.mousePosition = position;
  }
};
const handleOnMove = e => {
  const mousePosition = { x: e.clientX, y: e.clientY }
  
  adjustLastMousePosition(mousePosition);
  
  const now = new Date().getTime(),
        hasMovedFarEnough = calcDistance(last.starPosition, mousePosition) >= config.minimumDistanceBetweenStars,
        hasBeenLongEnough = calcElapsedTime(last.starTimestamp, now) > config.minimumTimeBetweenStars;
  
  if(hasMovedFarEnough || hasBeenLongEnough) {
    createStar(mousePosition);
    
    updateLastStar(mousePosition);
  }
  
  createGlow(last.mousePosition, mousePosition);
  
  updateLastMousePosition(mousePosition);
}

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);

document.body.onmouseleave = () => updateLastMousePosition(originPosition);

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

// Add event listeners for audio
document.getElementById("info").addEventListener("mouseenter", () => {
    playAudio(planets[currentPlanetIndex].description);
});

document.getElementById("info").addEventListener("mouseleave", stopAudio);

document.getElementById("planetTitle").addEventListener("mouseenter", () => {
    playAudio(planets[currentPlanetIndex].description);
});

document.getElementById("planetTitle").addEventListener("mouseleave", stopAudio);

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

// Set camera initial position
camera.position.set(0, 0, 5);

// Create texture loader
const textureLoader = new THREE.TextureLoader();

// Add glow effect
const glowGeometry = new THREE.TorusGeometry(1.2, 0.07, 16, 100);
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
});
const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
glowSphere.visible = false;
scene.add(glowSphere);

// Texture Info Popup Functions
function showTexturePopup(planetIndex, textureIndex) {
    const planet = planets[planetIndex];
    const textureInfo = planet.textureInfo[textureIndex];
    
    document.getElementById('textureTitle').textContent = textureInfo.title;
    document.getElementById('textureContent').textContent = textureInfo.content;
    document.getElementById('textureIndicator').textContent = 
        `Map ${textureIndex + 1} of ${planet.textures.length}`;
    
    document.getElementById('textureInfoPopup').classList.add('active');
}

function closeTexturePopup() {
    document.getElementById('textureInfoPopup').classList.remove('active');
}

// Smooth transition between planets
function smoothTransition(nextPlanetIndex, direction) {
    if (isAnimating) return;

    isAnimating = true;
    stopAudio(); // Stop audio during transition
    
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(0, 0, 5);

    const distance = 5;
    const offset = direction === 'right' ? distance : -distance;
    endPos.x += offset;

    let t = 0;
    const duration = 1;
    function animateTransition() {
        t += 0.02;

        if (t <= 1) {
            camera.position.lerpVectors(startPos, endPos, t);
            camera.lookAt(sphere.position);
            requestAnimationFrame(animateTransition);
        } else {
            currentPlanetIndex = nextPlanetIndex;
            updatePlanet(currentPlanetIndex);
            camera.position.set(0, 0, 5);
            isAnimating = false;
        }
    }

    animateTransition();
}

// Function to update the planet
function updatePlanet(index) {
    stopAudio();
    
    const planet = planets[index];
    textureLoader.load(planet.textures[planet.currentTextureIndex], (texture) => {
        sphere.material.map = texture;
        sphere.material.needsUpdate = true;
    });

    document.getElementById("info").innerText = planet.description;
    document.getElementById("planetTitle").innerText = planet.description;
    document.getElementById("dialogContent").innerHTML = planet.detailedInfo;
    
    updateSliderForPlanet(index);
    showTexturePopup(index, planet.currentTextureIndex);
}





// Function to change the texture of the current planet
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
        
        showTexturePopup(currentPlanetIndex, planet.currentTextureIndex);
    });
}

// Mouse interaction for glow effect
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
    const nextIndex = (currentPlanetIndex - 1 + planets.length) % planets.length;
    smoothTransition(nextIndex, 'left');
});

document.getElementById("rightButton").addEventListener("click", () => {
    const nextIndex = (currentPlanetIndex + 1) % planets.length;
    smoothTransition(nextIndex, 'right');
});

const textureSlider = document.getElementById('textureSlider');
        const sliderLabels = document.getElementById('sliderLabels');
        const currentTextureLabel = document.getElementById('currentTextureLabel');
        const textureDescription = document.getElementById('textureDescription');
        const planetInfo = document.getElementById('planetInfo');

        function updateSliderForPlanet(planetIndex) {
            const planet = planets[planetIndex];
            const numTextures = planet.textures.length;

            // Update slider attributes
            textureSlider.min = 0;
            textureSlider.max = numTextures - 1;
            textureSlider.value = planet.currentTextureIndex;

            // Update slider theme
            textureSlider.className = `slider ${planet.sliderTheme}`;

            // Update labels
            sliderLabels.innerHTML = '';
            for (let i = 0; i < numTextures; i++) {
                const label = document.createElement('span');
                label.textContent = planet.textureInfo[i].title;
                sliderLabels.appendChild(label);
            }

            // Update planet info and texture details
            planetInfo.textContent = planet.description;
            updateTextureInfo(planet, planet.currentTextureIndex);
        }

        function updateTextureInfo(planet, textureIndex) {
            const textureInfo = planet.textureInfo[textureIndex];
            currentTextureLabel.textContent = `Map ${textureIndex + 1}/${planet.textures.length}`;
            textureDescription.textContent = textureInfo.description;
        }

        textureSlider.addEventListener('input', () => {
            const planet = planets[currentPlanetIndex];
            const newTextureIndex = parseInt(textureSlider.value);
            
            if (newTextureIndex !== planet.currentTextureIndex) {
                planet.currentTextureIndex = newTextureIndex;
                textureLoader.load(planet.textures[newTextureIndex], (texture) => {
                    sphere.material.map = texture;
                    sphere.material.needsUpdate = true;
                    showTexturePopup(currentPlanetIndex, newTextureIndex);
                });
                
                updateTextureInfo(planet, newTextureIndex);
            }
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

updatePlanet(currentPlanetIndex);
animate();
