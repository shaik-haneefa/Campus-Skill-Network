import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Hero3DVisual = () => {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050713, 0.045);

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 7.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported, graceful fallback will be used.', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    container.appendChild(renderer.domElement);

    // Root Group for all 3D scene elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Cinematic Lighting Setup (Blue, Purple, Cyan)
    const ambientLight = new THREE.AmbientLight(0x2563eb, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cyan / Bright Blue accent light
    const cyanLight = new THREE.PointLight(0x38bdf8, 4.5, 18);
    cyanLight.position.set(3.5, 3, 2);
    scene.add(cyanLight);

    // Purple / Violet rim light
    const purpleLight = new THREE.PointLight(0x7c3aed, 4, 16);
    purpleLight.position.set(-4, -1, 3);
    scene.add(purpleLight);

    // Deep Blue fill light
    const blueLight = new THREE.PointLight(0x1d4ed8, 3.5, 16);
    blueLight.position.set(2, -3, 1);
    scene.add(blueLight);

    // 3. Perspective Ground Grid & Holographic Floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x3b82f6, 0x15102b);
    gridHelper.position.y = -2.2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // 4. Procedural Dynamic Canvas Screen for 3D Laptop
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 320;
    const ctx = screenCanvas.getContext('2d');
    if (ctx) {
      const bgGrad = ctx.createLinearGradient(0, 0, 512, 320);
      bgGrad.addColorStop(0, '#050713');
      bgGrad.addColorStop(0.5, '#0b1024');
      bgGrad.addColorStop(1, '#15102b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 512, 320);

      // Top IDE bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 28);
      // Window control dots
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(20, 14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(36, 14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(52, 14, 5, 0, Math.PI * 2);
      ctx.fill();

      // Title
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('⚡ CampusSkill.network // Live Mentor Matrix', 75, 19);

      // Code text
      ctx.font = '13px monospace';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('import { CampusPeer, SkillGraph } from "@campus/core";', 25, 62);

      ctx.fillStyle = '#818cf8';
      ctx.fillText('const mentorship = await CampusPeer.match({', 25, 90);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('  domain: "Full-Stack & AI Engineering",', 45, 114);
      ctx.fillStyle = '#c7d2fe';
      ctx.fillText('  verification: "Official College Peer",', 45, 138);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('  location: "Library Commons, Zone 2",', 45, 162);
      ctx.fillStyle = '#818cf8';
      ctx.fillText('});', 25, 186);

      // Live match confirmation badge
      ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(25, 215, 460, 75, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('✓ Peer Mentorship Session Active • 1-on-1', 45, 245);
      ctx.font = '12px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('⭐ 4.9 Rating • 100% Campus Verified', 45, 268);
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;

    // 5. 3D Digital Learning Workstation
    const workstationGroup = new THREE.Group();

    // 3D Laptop
    const laptopGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(2.6, 0.09, 1.8);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.2,
    });
    const laptopBase = new THREE.Mesh(baseGeo, metalMat);
    laptopBase.position.y = 0.045;
    laptopBase.castShadow = true;
    laptopBase.receiveShadow = true;
    laptopGroup.add(laptopBase);

    // Keyboard & Trackpad
    const keyboardGeo = new THREE.BoxGeometry(2.35, 0.02, 1.05);
    const keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x050713,
      roughness: 0.6,
    });
    const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
    keyboard.position.set(0, 0.095, -0.15);
    laptopGroup.add(keyboard);

    const trackpadGeo = new THREE.BoxGeometry(0.85, 0.01, 0.5);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3,
    });
    const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpad.position.set(0, 0.096, 0.55);
    laptopGroup.add(trackpad);

    // Screen Lid
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.09, -0.88);

    const lidGeo = new THREE.BoxGeometry(2.6, 1.65, 0.07);
    const lid = new THREE.Mesh(lidGeo, metalMat);
    lid.position.set(0, 0.825, 0);
    lid.castShadow = true;
    screenGroup.add(lid);

    const displayGeo = new THREE.PlaneGeometry(2.46, 1.52);
    const displayMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissive: 0x2563eb,
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.1,
    });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 0.825, 0.038);
    screenGroup.add(display);

    screenGroup.rotation.x = -Math.PI * 0.14;
    laptopGroup.add(screenGroup);

    workstationGroup.add(laptopGroup);

    // 6. Floating 3D Graduation Cap (Academic / Student Identity)
    const capGroup = new THREE.Group();
    const capTopGeo = new THREE.BoxGeometry(1.1, 0.045, 1.1);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x0b1024,
      roughness: 0.3,
      metalness: 0.5,
    });
    const capTop = new THREE.Mesh(capTopGeo, capMat);
    capTop.rotation.y = Math.PI * 0.25;
    capGroup.add(capTop);

    const capSkullGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.32, 32);
    const capSkull = new THREE.Mesh(capSkullGeo, capMat);
    capSkull.position.y = -0.18;
    capGroup.add(capSkull);

    // Cyan / Purple Tassel
    const tasselMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.5,
    });
    const tasselButton = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), tasselMat);
    tasselButton.position.y = 0.035;
    capGroup.add(tasselButton);

    const tasselLine = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8), tasselMat);
    tasselLine.position.set(0.35, -0.18, 0.35);
    tasselLine.rotation.z = -Math.PI * 0.25;
    capGroup.add(tasselLine);

    capGroup.position.set(1.9, 1.1, 0.5);
    capGroup.rotation.set(-0.25, 0.35, 0.1);
    workstationGroup.add(capGroup);

    // 7. Floating 3D Knowledge Books Stack (Blue, Purple, Cyan, Navy)
    const bookGroup = new THREE.Group();
    const bookColors = [0x2563eb, 0x7c3aed, 0x38bdf8, 0x1d4ed8];
    for (let i = 0; i < 4; i++) {
      const bGeo = new THREE.BoxGeometry(1.1, 0.14, 0.85);
      const bMat = new THREE.MeshStandardMaterial({
        color: bookColors[i],
        roughness: 0.3,
        metalness: 0.5,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(0, i * 0.15, 0);
      bMesh.rotation.y = (i - 1.5) * 0.14;
      bMesh.castShadow = true;

      const pageGeo = new THREE.BoxGeometry(1.05, 0.12, 0.8);
      const pageMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      const pages = new THREE.Mesh(pageGeo, pageMat);
      pages.position.set(0.02, i * 0.15, 0);
      pages.rotation.y = (i - 1.5) * 0.14;

      bookGroup.add(pages);
      bookGroup.add(bMesh);
    }
    bookGroup.position.set(-2.0, -0.6, 0.6);
    bookGroup.rotation.set(0.12, 0.45, -0.08);
    workstationGroup.add(bookGroup);

    // 8. Cybernetic Orbital Rings around the workstation (Blue and Purple)
    const ringGeo1 = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75,
    });
    const orbitRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    orbitRing1.rotation.x = Math.PI * 0.45;
    orbitRing1.rotation.y = Math.PI * 0.12;
    workstationGroup.add(orbitRing1);

    const ringGeo2 = new THREE.TorusGeometry(2.2, 0.016, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65,
    });
    const orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    orbitRing2.rotation.x = -Math.PI * 0.38;
    orbitRing2.rotation.y = -Math.PI * 0.22;
    workstationGroup.add(orbitRing2);

    // 9. Orbiting 3D Skill Polyhedra (Blue, Cyan, Purple)
    const skillNodes = [];
    const nodeColors = [0x2563eb, 0x38bdf8, 0x7c3aed, 0x60a5fa, 0xa78bfa, 0x3b82f6];
    for (let i = 0; i < 6; i++) {
      let geo;
      if (i % 3 === 0) {
        geo = new THREE.IcosahedronGeometry(0.18, 0);
      } else if (i % 3 === 1) {
        geo = new THREE.DodecahedronGeometry(0.16, 0);
      } else {
        geo = new THREE.SphereGeometry(0.14, 24, 24);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: nodeColors[i],
        emissive: nodeColors[i],
        emissiveIntensity: 0.85,
        roughness: 0.1,
        metalness: 0.9,
      });
      const nodeMesh = new THREE.Mesh(geo, mat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.4 + (i % 2) * 0.6;
      nodeMesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.6,
        Math.sin(angle) * radius
      );
      workstationGroup.add(nodeMesh);
      skillNodes.push({
        mesh: nodeMesh,
        angle,
        radius,
        speed: 0.007 + i * 0.002,
        rotSpeed: 0.02 + i * 0.01,
        yOffset: i,
      });
    }

    // Position workstation dynamically in the 3D space
    workstationGroup.position.set(2.4, 0.2, -0.5);
    workstationGroup.rotation.y = -Math.PI * 0.16;
    workstationGroup.rotation.x = Math.PI * 0.06;
    mainGroup.add(workstationGroup);

    // 10. Floating Peer-to-Peer Network Constellation Lines
    const networkPoints = [];
    const lineCount = 30;
    for (let i = 0; i < lineCount; i++) {
      networkPoints.push(
        new THREE.Vector3(
          (Math.random() - 0.4) * 14,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2
        )
      );
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(networkPoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const networkLines = new THREE.Line(lineGeo, lineMat);
    scene.add(networkLines);

    // 11. Immersive Full-Screen Particle Cosmos (Blue, Cyan, Purple, White)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colBlue = new THREE.Color(0x3b82f6);
    const colCyan = new THREE.Color(0x38bdf8);
    const colPurple = new THREE.Color(0x7c3aed);
    const colLightBlue = new THREE.Color(0x60a5fa);
    const colWhite = new THREE.Color(0xf8fafc);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const r = Math.random();
      const col = r < 0.4 ? colBlue : r < 0.65 ? colCyan : r < 0.85 ? colPurple : r < 0.95 ? colLightBlue : colWhite;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // 12. Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) - 0.5;
      const y = (event.clientY / window.innerHeight) - 0.5;
      targetX = x * 0.9;
      targetY = y * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 13. Smart Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      camera.aspect = w / h;

      if (w < 768) {
        // Mobile view: centered workstation positioned lower
        camera.position.set(0, 0.8, 9.2);
        workstationGroup.position.set(0, -1.2, -1);
        workstationGroup.scale.set(0.72, 0.72, 0.72);
      } else if (w < 1024) {
        // Tablet view
        camera.position.set(0, 1.2, 8.2);
        workstationGroup.position.set(1.4, -0.2, -0.8);
        workstationGroup.scale.set(0.85, 0.85, 0.85);
      } else {
        // Desktop view
        camera.position.set(0, 1.5, 7.5);
        workstationGroup.position.set(2.4, 0.2, -0.5);
        workstationGroup.scale.set(1, 1, 1);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    setIsLoaded(true);

    // 14. Animation Render Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        mouseX += (targetX - mouseX) * 0.04;
        mouseY += (targetY - mouseY) * 0.04;

        camera.position.x = mouseX * 1.5;
        camera.position.y = (width < 768 ? 0.8 : 1.5) - mouseY * 1.0;
        camera.lookAt(width < 768 ? 0 : 0.8, 0, 0);

        workstationGroup.position.y = (width < 768 ? -1.2 : 0.2) + Math.sin(elapsedTime * 1.1) * 0.1;
        workstationGroup.rotation.y = -Math.PI * 0.16 + mouseX * 0.4;
        workstationGroup.rotation.x = Math.PI * 0.06 + mouseY * 0.3;

        capGroup.position.y = 1.1 + Math.sin(elapsedTime * 1.5 + 1) * 0.08;
        capGroup.rotation.y = 0.35 + Math.sin(elapsedTime * 0.7) * 0.15;

        bookGroup.position.y = -0.6 + Math.cos(elapsedTime * 1.3) * 0.05;

        orbitRing1.rotation.z = elapsedTime * 0.18;
        orbitRing2.rotation.z = -elapsedTime * 0.22;

        skillNodes.forEach((node) => {
          node.angle += node.speed;
          node.mesh.position.x = Math.cos(node.angle) * node.radius;
          node.mesh.position.z = Math.sin(node.angle) * node.radius;
          node.mesh.position.y = Math.sin(node.angle * 2 + node.yOffset) * 0.5;
          node.mesh.rotation.x += node.rotSpeed;
          node.mesh.rotation.y += node.rotSpeed;
        });

        particleField.rotation.y = elapsedTime * 0.025;
        particleField.rotation.x = elapsedTime * 0.015;
        networkLines.rotation.y = -elapsedTime * 0.015;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      if (renderer) {
        renderer.dispose();
      }
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 overflow-hidden ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default Hero3DVisual;
