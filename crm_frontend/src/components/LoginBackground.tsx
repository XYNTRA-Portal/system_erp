import { useEffect } from "react";
import { useRef } from "react";

export const LoginBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamically load Three.js if not present
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = initScene;
      document.head.appendChild(script);
    } else {
      initScene();
    }

    function initScene() {
      if (!containerRef.current) return;
      const THREE = window.THREE;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 6000;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#6366f1',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);
      camera.position.z = 3;

      // Mouse Move Effect
      let mouseX = 0;
      let mouseY = 0;
      const handleMouseMove = (event) => {
        mouseX = event.clientX - window.innerWidth / 2;
        mouseY = event.clientY - window.innerHeight / 2;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        
        // Dynamic rotation based on mouse
        particlesMesh.rotation.y += mouseX * 0.00002;
        particlesMesh.rotation.x += mouseY * 0.00002;
        
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
      };
    }
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none opacity-40 overflow-hidden" />;
};