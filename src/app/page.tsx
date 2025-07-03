/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import {
  Box,
  ContactShadows,
  Environment,
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sphere,
  Stars,
  Text,
  Torus,
} from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AnimatePresence, motion } from "framer-motion"
import { Suspense, useEffect, useRef, useState } from "react"
import type { Group } from "three"
import * as THREE from "three"

// Particle System Component
function ParticleField() {
  const points = useRef<THREE.Points>(null)
  const particleCount = 1000

  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50

    colors[i * 3] = Math.random()
    colors[i * 3 + 1] = Math.random()
    colors[i * 3 + 2] = Math.random()
  }

  useFrame(() => {
    if (points.current) {
      // If you need elapsedTime, you can get it from THREE.Clock or useThree, but currently 'state' is unused.
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
    </points>
  )
}

// Interactive 3D Logo
function InteractiveLogo({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mousePosition.y * 0.3, 0.05)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mousePosition.x * 0.3, 0.05)

      if (hovered) {
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.2, 0.1))
      } else {
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.1))
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Torus
          args={[2, 0.5, 16, 100]}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <MeshDistortMaterial
            color="#ff6b6b"
            attach="material"
            distort={0.6}
            speed={3}
            roughness={0.1}
            metalness={0.8}
          />
        </Torus>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Box args={[1, 1, 1]} position={[3, 0, 0]}>
          <MeshWobbleMaterial color="#4ecdc4" factor={0.8} speed={2} />
        </Box>
      </Float>

      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={3}>
        <Sphere args={[0.8]} position={[-3, 0, 0]}>
          <MeshDistortMaterial color="#45b7d1" distort={0.4} speed={1.5} roughness={0.2} metalness={0.6} />
        </Sphere>
      </Float>
    </group>
  )
}

// 3D Text Component
function Text3D({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Text
      position={position}
      fontSize={1}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Inter_Bold.json"
    >
      {text}
      <MeshDistortMaterial distort={0.2} speed={2} />
    </Text>
  )
}

// Main 3D Scene
function Scene3D({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { camera } = useThree()

  useFrame((state) => {
    // Smooth camera movement based on mouse
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.x * 2, 0.02)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.y * 2, 0.02)
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} color="#ff6b6b" intensity={0.8} />
      <pointLight position={[10, 10, 10]} color="#4ecdc4" intensity={0.8} />
      <spotLight position={[0, 10, 0]} color="#ffffff" intensity={0.5} />

      {/* Particle Field */}
      <ParticleField />

      {/* Interactive Logo */}
      <InteractiveLogo mousePosition={mousePosition} />

      {/* Floating Elements */}
      <Float speed={1} rotationIntensity={1} floatIntensity={2}>
        <Torus args={[1, 0.3, 16, 100]} position={[6, 3, -5]}>
          <MeshWobbleMaterial color="#96ceb4" factor={0.6} speed={1.5} />
        </Torus>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Box args={[1.5, 1.5, 1.5]} position={[-6, -2, -3]}>
          <MeshDistortMaterial color="#feca57" distort={0.5} speed={2} />
        </Box>
      </Float>

      {/* Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Environment */}
      <Environment preset="night" />
      <ContactShadows position={[0, -8, 0]} opacity={0.3} scale={40} blur={2} far={8} />
    </>
  )
}

// Loading Screen Component
function LoadingScreen({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-8"
        />
        <h2 className="text-2xl font-bold text-white mb-4">Loading Experience</h2>
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
        <p className="text-white/70 mt-2">{Math.round(progress)}%</p>
      </div>
    </motion.div>
  )
}

// Skill Card Component
function SkillCard({ skill, index }: { skill: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
    >
      <div className="text-4xl mb-4">{skill.icon}</div>
      <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
      <p className="text-white/70 mb-4">{skill.description}</p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Proficiency</span>
        <span className="text-sm text-purple-400">{skill.level}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
        />
      </div>
    </motion.div>
  )
}

// Project Card Component
function ProjectCard({ project, index }: { project: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-500"
    >
      <div className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/20"
        />
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <span className="text-2xl">{project.icon}</span>
        </div>

        <p className="text-white/70 mb-4 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech: string) => (
            <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform duration-200">
            View Live
          </button>
          <button className="px-4 py-2 border border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
            Code
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Experience Timeline Component
function ExperienceTimeline() {
  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      period: "2022 - Present",
      description: "Leading development of scalable web applications using React, Node.js, and cloud technologies.",
      icon: "💼",
    },
    {
      title: "Frontend Developer",
      company: "StartupXYZ",
      period: "2020 - 2022",
      description: "Built responsive web applications and improved user experience across multiple platforms.",
      icon: "🚀",
    },
    {
      title: "Junior Developer",
      company: "WebSolutions",
      period: "2019 - 2020",
      description: "Developed and maintained client websites using modern web technologies.",
      icon: "💻",
    },
  ]

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />

      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="relative flex items-start mb-12"
        >
          <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-slate-900" />

          <div className="ml-16 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{exp.icon}</span>
              <div>
                <h3 className="text-xl font-bold">{exp.title}</h3>
                <p className="text-purple-400 font-medium">{exp.company}</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-3">{exp.period}</p>
            <p className="text-white/80">{exp.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Main Portfolio Component
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Loading simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsLoaded(true), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const sections = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "about", label: "About", icon: "👨‍💻" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "contact", label: "Contact", icon: "📧" },
  ]

  const skills = [
    {
      name: "React & Next.js",
      description: "Building modern web applications with React ecosystem",
      level: 95,
      icon: "⚛️",
    },
    {
      name: "Three.js & WebGL",
      description: "Creating immersive 3D experiences and animations",
      level: 88,
      icon: "🎮",
    },
    {
      name: "TypeScript",
      description: "Type-safe development for scalable applications",
      level: 92,
      icon: "📘",
    },
    {
      name: "Node.js & APIs",
      description: "Backend development and RESTful API design",
      level: 85,
      icon: "🔧",
    },
    {
      name: "Cloud & DevOps",
      description: "AWS, Docker, and CI/CD pipeline management",
      level: 80,
      icon: "☁️",
    },
    {
      name: "UI/UX Design",
      description: "Creating beautiful and intuitive user interfaces",
      level: 87,
      icon: "🎨",
    },
  ]

  const projects = [
    {
      title: "AI-Powered Analytics Dashboard",
      description: "Real-time analytics platform with machine learning insights and interactive data visualizations.",
      tech: ["React", "Python", "TensorFlow", "D3.js", "AWS"],
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      icon: "📊",
    },
    {
      title: "3D E-Commerce Platform",
      description: "Immersive shopping experience with 3D product visualization and AR try-on features.",
      tech: ["Next.js", "Three.js", "WebXR", "Stripe", "MongoDB"],
      gradient: "from-green-500 via-teal-500 to-blue-500",
      icon: "🛍️",
    },
    {
      title: "Real-time Collaboration Tool",
      description: "Multi-user workspace with live editing, video calls, and project management features.",
      tech: ["React", "Socket.io", "WebRTC", "Redis", "Docker"],
      gradient: "from-orange-500 via-red-500 to-pink-500",
      icon: "👥",
    },
    {
      title: "Blockchain DeFi Platform",
      description: "Decentralized finance application with yield farming and liquidity pool management.",
      tech: ["React", "Web3.js", "Solidity", "Ethereum", "IPFS"],
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      icon: "₿",
    },
    {
      title: "AI Content Generator",
      description: "GPT-powered content creation tool with custom templates and brand voice training.",
      tech: ["Next.js", "OpenAI", "Prisma", "PostgreSQL", "Vercel"],
      gradient: "from-purple-500 via-pink-500 to-red-500",
      icon: "🤖",
    },
    {
      title: "IoT Smart Home Hub",
      description: "Centralized control system for smart home devices with voice commands and automation.",
      tech: ["React Native", "Node.js", "MQTT", "Raspberry Pi", "AWS IoT"],
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
      icon: "🏡",
    },
  ]

  if (!isLoaded) {
    return (
      <AnimatePresence>
        <LoadingScreen progress={loadingProgress} />
      </AnimatePresence>
    )
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      } text-white overflow-hidden`}
    >
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene3D mousePosition={mousePosition} />
          </Suspense>
        </Canvas>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 p-6"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl hidden md:block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
             MR
          </motion.div>

          {/* Navigation Links */}
          <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
            <div className="flex space-x-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-sm">{section.icon}</span>
                  <span className="hidden md:inline">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="relative z-10 min-h-screen pt-24">
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen flex items-center justify-center p-6"
            >
              <div className="text-center max-w-6xl">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-8"
                >
                  <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    Masud Rana
                  </h1>
                  <div className="text-2xl md:text-4xl text-white/90 mb-4">
                    <span className="inline-block">Software Engineer</span>
                    <span className="mx-4 text-purple-400">•</span>
                    <span className="inline-block">Deep Thinker</span>
                    <span className="mx-4 text-purple-400">•</span>
                    <span className="inline-block">Personal Growth Specialist</span>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-xl md:text-xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed"
                >
                 Blending engineering precision with deep thought and mindful living, this 3D portfolio is a space where creativity meets clarity. Every project is crafted with purpose, reflecting a journey of growth in both code and consciousness. 🌱
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                  <button className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3">
                    <span>Explore My Work</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      →
                    </motion.span>
                  </button>
                    <a
                    href="/masud-resume.pdf"
                    download="Masud_Rana_Resume.pdf"
                    className="px-8 py-4 border-2 border-white/30 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                    >
                    <span>Download Resume</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                    </a>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
                >
                  {[
                    { number: "30+", label: "Projects Completed" },
                    { number: "1.5+", label: "Years Experience" },
                    { number: "15+", label: "Happy Clients" },
                    { number: "15+", label: "Awards Won" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-white/60 mt-2">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeSection === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen flex items-center justify-center p-6"
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-6xl font-bold mb-16 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  About Me
                </h2>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                      <p className="text-lg text-white/90 leading-relaxed mb-6">
                        I&#39;m a passionate full-stack developer with over 5 years of experience creating digital
                        experiences that push the boundaries of what&#39;s possible on the web. My journey began with
                        traditional web development, but I quickly fell in love with the endless possibilities of 3D
                        graphics and interactive design.
                      </p>
                      <p className="text-lg text-white/90 leading-relaxed mb-6">
                        Today, I specialize in building immersive web applications that combine cutting-edge
                        technologies like WebGL, Three.js, and modern frameworks to create experiences that are both
                        beautiful and functional.
                      </p>
                      <p className="text-lg text-white/90 leading-relaxed">
                        When I&#39;m not coding, you&#39;ll find me exploring new technologies, contributing to open-source
                        projects, or experimenting with digital art and 3D modeling.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                      <h3 className="text-2xl font-bold mb-6 text-purple-400">What I Do</h3>
                      <div className="space-y-4">
                        {[
                          {
                            icon: "🎨",
                            title: "UI/UX Design",
                            desc: "Creating intuitive and beautiful user interfaces",
                          },
                          {
                            icon: "⚛️",
                            title: "Frontend Development",
                            desc: "Building responsive and interactive web applications",
                          },
                          {
                            icon: "🔧",
                            title: "Backend Development",
                            desc: "Developing scalable APIs and server-side solutions",
                          },
                          {
                            icon: "🎮",
                            title: "3D Development",
                            desc: "Creating immersive 3D experiences and animations",
                          },
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <h4 className="font-semibold text-white">{item.title}</h4>
                              <p className="text-white/70 text-sm">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "experience" && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen flex items-center justify-center p-6"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-6xl font-bold mb-16 text-center bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                  Experience
                </h2>
                <ExperienceTimeline />
              </div>
            </motion.div>
          )}

          {activeSection === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen p-6 py-24"
            >
              <div className="max-w-7xl mx-auto">
                <h2 className="text-6xl font-bold mb-16 text-center bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <ProjectCard key={project.title} project={project} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, rotateX: 90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: -90 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen p-6 py-24"
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-6xl font-bold mb-16 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Skills & Expertise
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {skills.map((skill, index) => (
                    <SkillCard key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen flex items-center justify-center p-6"
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-6xl font-bold mb-16 text-center bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                  Let&#39;s Work Together
                </h2>

                <div className="grid lg:grid-cols-2 gap-12">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                      <h3 className="text-3xl font-bold mb-8">Get In Touch</h3>

                      <div className="space-y-6">
                        {[
                          {
                            icon: "📧",
                            label: "Email",
                            value: "alex@example.com",
                            color: "from-pink-500 to-purple-500",
                          },
                          {
                            icon: "💼",
                            label: "LinkedIn",
                            value: "linkedin.com/in/alexchen",
                            color: "from-blue-500 to-cyan-500",
                          },
                          {
                            icon: "🐙",
                            label: "GitHub",
                            value: "github.com/alexchen",
                            color: "from-green-500 to-teal-500",
                          },
                          { icon: "🐦", label: "Twitter", value: "@alexchen_dev", color: "from-cyan-500 to-blue-500" },
                        ].map((contact, index) => (
                          <motion.div
                            key={contact.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                            className="flex items-center space-x-4 group cursor-pointer hover:scale-105 transition-transform duration-200"
                          >
                            <div
                              className={`w-14 h-14 bg-gradient-to-r ${contact.color} rounded-full flex items-center justify-center text-xl`}
                            >
                              {contact.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{contact.label}</p>
                              <p className="text-white/70 group-hover:text-white transition-colors">{contact.value}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                      <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

                      <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors backdrop-blur-sm"
                          />
                          <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors backdrop-blur-sm"
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Subject"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors backdrop-blur-sm"
                        />

                        <textarea
                          placeholder="Your Message"
                          rows={6}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none backdrop-blur-sm"
                        ></textarea>

                        <button
                          type="submit"
                          className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                          Send Message ✨
                        </button>
                      </form>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <motion.button
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.1, rotate: 15 }}
          className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-xl"
        >
          ✨
        </motion.button>

        <motion.button
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          whileHover={{ scale: 1.1, rotate: -15 }}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center text-xl"
        >
          🚀
        </motion.button>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  )
}
