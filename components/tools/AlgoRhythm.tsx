'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

import { ALGORITHMS, ALGORITHM_INFO, SortStep } from '@/lib/algorithms/SortingAlgorithms';
import { useAudioSynth } from '@/hooks/useAudioSynth';
import CustomSelect from '@/components/ui/CustomSelect';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function AlgoRhythm() {
    // --- STATE ---
    const [algoName, setAlgoName] = useState('Bubble Sort');
    const [arraySize, setArraySize] = useState(50);
    const [speed, setSpeed] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [stats, setStats] = useState({ comparisons: 0, swaps: 0, steps: 0 });

    const [array, setArray] = useState<number[]>([]);
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [swapIndices, setSwapIndices] = useState<number[]>([]);
    const [sortedIndices, setSortedIndices] = useState<number[]>([]);
    const [pivotIndex, setPivotIndex] = useState<number | undefined>(undefined);
    const [isFinished, setIsFinished] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const generatorRef = useRef<Generator<SortStep, void, unknown> | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextInitRef = useRef(false);
    const { initAudio, playTone } = useAudioSynth({ volume: 0.1 });

    // Three.js Refs
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const pillarsRef = useRef<THREE.Mesh[]>([]);
    const controlsRef = useRef<OrbitControls | null>(null);
    const reqIdRef = useRef<number | null>(null);

    // --- LOGIC ---
    const generateArray = () => {
        const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
        setArray(newArr);
        setActiveIndices([]);
        setSwapIndices([]);
        setSortedIndices([]);
        setPivotIndex(undefined);
        setStats({ comparisons: 0, swaps: 0, steps: 0 });
        setIsFinished(false);
        setIsPlaying(false);
        generatorRef.current = null;
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Initial Array Gen
    useEffect(() => {
        generateArray();
    }, [arraySize, algoName]);

    // --- THREE.JS SETUP ---
    useEffect(() => {
        if (!containerRef.current) return;

        // 1. Scene - LIGHT THEME
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#f8fafc'); // Slate-50
        // scene.fog = new THREE.Fog('#f8fafc', 20, 90);
        sceneRef.current = scene;

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        camera.position.set(0, 15, 30);
        cameraRef.current = camera;

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 4. Lights - Bright Studio Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.5); // Light blue fill
        fillLight.position.set(-10, 5, -10);
        scene.add(fillLight);

        // 5. Grid - Subtle Light Grid
        const gridHelper = new THREE.GridHelper(50, 50, 0xcbd5e1, 0xe2e8f0); // Slate-300 / Slate-200
        scene.add(gridHelper);

        // 6. Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.1;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.5;
        controlsRef.current = controls;

        // Render Loop
        const animate = () => {
            reqIdRef.current = requestAnimationFrame(animate);
            if (controlsRef.current) controlsRef.current.update();
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        // Resize
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
            cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            if (containerRef.current && rendererRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // --- THREE.JS UPDATES (Sync Pillars) ---
    useEffect(() => {
        if (!sceneRef.current) return;
        const scene = sceneRef.current;
        const total = array.length;

        // Clear old
        pillarsRef.current.forEach(mesh => {
            scene.remove(mesh);
            (mesh.geometry as THREE.BoxGeometry).dispose();
            (mesh.material as THREE.MeshStandardMaterial).dispose();
        });
        pillarsRef.current = [];

        array.forEach((val, idx) => {
            const height = Math.max(0.5, (val / 100) * 15);
            const width = Math.min(0.8, 25 / total);
            const x = (idx - total / 2) * (width + 0.1);

            // COLORS - Light Theme
            let colorHex = '#bae6fd'; // Sky-200 (Default)
            let emissiveIntensity = 0;
            let emissiveColor = '#000000';

            if (sortedIndices.includes(idx)) {
                colorHex = '#86efac'; // Green-300
            } else if (swapIndices.includes(idx)) {
                colorHex = '#fde047'; // Yellow-300
                // emissiveIntensity = 0.2;
                // emissiveColor = colorHex;
            } else if (activeIndices.includes(idx)) {
                colorHex = '#fca5a5'; // Red-300
            } else if (idx === pivotIndex) {
                colorHex = '#d8b4fe'; // Purple-300
            }

            const geometry = new THREE.BoxGeometry(width, height, width);
            // Move pivot to bottom so it scales up from floor
            geometry.translate(0, height / 2, 0);

            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(colorHex),
                roughness: 0.3, // Glossy plastic
                metalness: 0.1,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, 0, 0); // Position at floor (y=0) because we translated geometry
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            scene.add(mesh);
            pillarsRef.current.push(mesh);
        });

    }, [array, activeIndices, swapIndices, sortedIndices, pivotIndex]);

    // Update autoRotate
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.autoRotate = isPlaying;
        }
    }, [isPlaying]);

    // --- SORTING LOOP ---
    useEffect(() => {
        if (isPlaying && !isFinished) {
            if (!generatorRef.current) {
                const genFunc = ALGORITHMS[algoName];
                if (genFunc) generatorRef.current = genFunc(array);
            }

            const tick = () => {
                if (!generatorRef.current) return;
                const { value, done } = generatorRef.current.next();

                if (done) {
                    setIsFinished(true);
                    setIsPlaying(false);
                    return;
                }

                if (value) {
                    setArray(value.array);
                    setActiveIndices(value.activeIndices);
                    setSwapIndices(value.swapIndices);
                    setSortedIndices(value.sortedIndices);
                    setPivotIndex(value.pivotIndex);

                    setStats(prev => ({
                        steps: prev.steps + 1,
                        comparisons: prev.comparisons + (value.activeIndices.length > 0 ? 1 : 0),
                        swaps: prev.swaps + (value.swapIndices.length > 0 ? 1 : 0)
                    }));

                    if (!isMuted) {
                        const relevantIndices = [...value.swapIndices, ...value.activeIndices];
                        if (relevantIndices.length > 0) {
                            const maxVal = Math.max(...relevantIndices.map(i => value.array[i]));
                            playTone(maxVal, 100);
                        }
                    }
                }
            };

            const delay = Math.max(1, 510 - (speed * 5));
            intervalRef.current = setInterval(tick, delay);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, isFinished, speed, algoName, isMuted, playTone]);

    const togglePlay = () => {
        if (!audioContextInitRef.current) {
            initAudio();
            audioContextInitRef.current = true;
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex flex-col h-[85vh] w-full bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative">

            {/* HEADER / CONTROLS (Light Theme) */}
            <div className="z-30 bg-white/80 backdrop-blur border-b border-slate-200 p-4 flex flex-wrap gap-4 justify-between items-center text-slate-700">
                <div className="flex items-center gap-4">
                    <div className="w-48">
                        <CustomSelect
                            options={Object.keys(ALGORITHMS).map(name => ({ label: name, value: name }))}
                            value={algoName}
                            onChange={(value) => setAlgoName(value)}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button onClick={togglePlay} className={`p-2 rounded ${isPlaying ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-white text-slate-500 hover:text-slate-700 hover:shadow-sm'}`}>
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button onClick={generateArray} className="p-2 hover:bg-white text-slate-500 hover:text-slate-700 rounded hover:shadow-sm" title="Reset">
                            <RotateCcw size={18} />
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-white text-slate-500 hover:text-slate-700 rounded hover:shadow-sm">
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <label className="text-[10px] text-slate-600 uppercase font-bold tracking-wider mb-1">Items: {arraySize}</label>
                        <input
                            type="range" min="10" max="150" value={arraySize}
                            onChange={(e) => setArraySize(Number(e.target.value))}
                            disabled={isPlaying}
                            className="w-32 accent-indigo-600 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] text-slate-600 uppercase font-bold tracking-wider mb-1">Speed</label>
                        <input
                            type="range" min="1" max="100" value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-32 accent-purple-600 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* INFO PANEL OVERLAY (Light Theme) */}
            <div className="absolute top-24 left-6 z-10 pointer-events-none">
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-5 rounded-xl shadow-lg w-64">
                    <h2 className="text-slate-800 font-black text-xl mb-1">{algoName.toUpperCase()}</h2>
                    <div className="text-[10px] text-slate-500 font-mono mb-4 border-b border-slate-100 pb-2">{ALGORITHM_INFO[algoName as keyof typeof ALGORITHM_INFO]?.complexity} Time Complexity</div>

                    <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between text-slate-600">
                            <span>Steps:</span> <span className="font-bold text-slate-800">{stats.steps}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Comparisons:</span> <span className="font-bold text-pink-500">{stats.comparisons}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Swaps:</span> <span className="font-bold text-amber-500">{stats.swaps}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D CANVAS CONTAINER */}
            <div
                ref={containerRef}
                className="flex-1 bg-slate-50 relative w-full h-full cursor-move"
            />
        </div>
    );
}
