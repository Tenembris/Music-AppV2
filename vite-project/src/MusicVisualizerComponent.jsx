import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Noise } from "noisejs";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import fontFile from "./fonts/helvetiker_regular.typeface.json";

const ThreeScene = ({ tempoBPM, loudness, averageValance }) => {
  const mountRef = useRef(null);
  const scene = useRef(new THREE.Scene()).current;
  const camera = useRef(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  ).current;
  const renderer = useRef(new THREE.WebGLRenderer({ antialias: true })).current;
  const sphere = useRef(null);
  const noise = new Noise();
  const bpm = 127; // Set your desired beats per minute

  useEffect(() => {
    scene.background = new THREE.Color("#000000");

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(100, 100, 100);
    scene.add(light);

    const sphereGeometry = new THREE.SphereGeometry(1, 25, 25);
    const sphereMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
    sphere.current = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere.current);

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 3;

    const loader = new FontLoader();
    loader.load(fontFile, function (font) {
      const textGeometry = new THREE.TextGeometry("Hello World!", {
        font: font,
        size: 1,
        height: 0.2,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-2, 0, 0);
      scene.add(textMesh);
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize, false);

    const animate = () => {
      if (!mountRef.current) return;
      requestAnimationFrame(animate);
      update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const update = () => {
    const beatsPerSecond = tempoBPM / 60;
    let multinoises = 0.1;
    // const valence2 = avarageValance;
    const valence2 = averageValance;

    // Adjust multinoises based on loudness
    if (loudness >= -60 && loudness <= -40) {
      multinoises = 0.1;
    } else if (loudness >= -40 && loudness <= -20) {
      multinoises = 0.15;
    } else if (loudness >= -20 && loudness <= 0) {
      multinoises = 0.22;
    }

    const time = performance.now() * 0.002;

    if (sphere.current && sphere.current.geometry) {
      const positionAttribute = sphere.current.geometry.attributes.position;
      const vertex = new THREE.Vector3();

      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);

        const perlinNoise =
          noise.perlin3(vertex.x * 1, vertex.y * 1, vertex.z * 1) * 2;
        const simplexNoise =
          noise.simplex3(vertex.x * 1, vertex.y * 1, vertex.z * 1) * 1.5;
        const sinusoidalNoise =
          Math.sin(
            beatsPerSecond * time +
              vertex.x * 1.5 +
              vertex.y * 1.5 +
              vertex.z * 2
          ) * 0.4;

        const noiseValue = perlinNoise + simplexNoise + sinusoidalNoise;
        const clampedNoiseValue = Math.min(Math.max(noiseValue, -0.5), 2);

        vertex.normalize().multiplyScalar(1 + multinoises * clampedNoiseValue);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      const t = time * 0.5;
      let colorIntensity = Math.sin(t) * 0.5 + 0.8;
      let darkFactor = 0.2;

      // Adjust color based on valence
      if (valence2 >= 0.1 && valence2 <= 0.4) {
        // Transition from blue to purple and black
        let blueToPurple = Math.sin(t) * 0.1 + 0.2; // Oscillates between 0 and 1
        sphere.current.material.color.setRGB(0, 0, blueToPurple);
      } else if (valence2 > 0.4 && valence2 <= 0.55) {
        // Transition from green to lighter green

        sphere.current.material.color.setRGB(
          0,
          colorIntensity * (darkFactor - 0.1),
          0
        );
      } else if (valence2 > 0.55 && valence2 <= 0.75) {
        // Transition from yellow to orange

        sphere.current.material.color.setRGB(colorIntensity * darkFactor, 0, 0);
      } else if (valence2 > 0.75 && valence2 <= 1) {
        // Glow in all colors
        let hue = time * 0.03; // Cycles through hues
        let rainbowColor = new THREE.Color().setHSL(hue, 1, 0.5);
        sphere.current.material.color = rainbowColor;
      }

      positionAttribute.needsUpdate = true;
      sphere.current.geometry.computeVertexNormals();
    }
  };

  return <div ref={mountRef} />;
};

export default ThreeScene;
