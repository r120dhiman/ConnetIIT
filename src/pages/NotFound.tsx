import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';

function NotFound() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const homeButtonRef = useRef(null);
  const particlesRef = useRef([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize scene after component mounts
  useEffect(() => {
    // Mark as loaded to trigger animations
    setTimeout(() => setIsLoaded(true), 100);
    
    // Create main timeline
    const mainTimeline = gsap.timeline({ 
      defaults: { ease: "power3.out" },
      onComplete: () => initContinuousAnimations()
    });
    
    // Initial loading animation
    if (isLoaded) {
      // Animate the glitch effect on the 404
      const glitchText = () => {
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 5
        });
        
        tl.to(textRef.current, {
          skewX: 70,
          duration: 0.04,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          skewX: 0,
          duration: 0.04,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          opacity: 0.8,
          duration: 0.04,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          opacity: 1,
          duration: 0.04,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          x: -20,
          duration: 0.08,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          x: 0,
          duration: 0.08,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          x: 20, 
          duration: 0.08,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          x: 0,
          duration: 0.08,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          skewX: -70,
          duration: 0.04,
          ease: "power1.inOut"
        })
        .to(textRef.current, {
          skewX: 0,
          duration: 0.04,
          ease: "power1.inOut"
        });
        
        return tl;
      };
      
      // Main sequence animation
      mainTimeline
        .from(textRef.current, {
          y: -200,
          opacity: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.3)",
          onComplete: () => glitchText()
        })
        .from(contentRef.current, {
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.1
        }, "-=0.8")
        .from(buttonRef.current, {
          scale: 0,
          rotation: 720,
          opacity: 0,
          duration: 1.2,
          ease: "back.out(1.5)"
        }, "-=0.5")
        .from(homeButtonRef.current, {
          scale: 0,
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.3)"
        }, "-=0.8");
    }
    
    // Setup continuous animations
    const initContinuousAnimations = () => {
      // Animate particles
      particlesRef.current.forEach((particle, index) => {
        animateParticle(particle, index);
      });
      
      // Create portal pulse effect
      gsap.to(".portal-pulse", {
        scale: 1.2,
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Create home button hover effect
      if (homeButtonRef.current) {
        // Continuous subtle animation
        gsap.to(homeButtonRef.current, {
          y: -5,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        
        // Orbit animation for the decorative elements
        gsap.to(".orbit-particle", {
          rotation: 360,
          duration: 8,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center"
        });
      }
    };
    
    // Mouse move parallax effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      setCursorPosition({
        x: clientX / innerWidth - 0.5,
        y: clientY / innerHeight - 0.5
      });
      
      // Update portal rotation based on mouse position
      gsap.to(".portal-ring", {
        rotationY: cursorPosition.x * 20,
        rotationX: -cursorPosition.y * 20,
        duration: 1
      });
      
      // Parallax effect on text
      gsap.to(textRef.current, {
        x: cursorPosition.x * 40,
        y: cursorPosition.y * 40,
        duration: 1
      });
      
      // Parallax effect on content
      gsap.to(contentRef.current, {
        x: cursorPosition.x * 20,
        y: cursorPosition.y * 20,
        duration: 1.2
      });
      
      // Parallax effect on home button
      gsap.to(homeButtonRef.current, {
        x: cursorPosition.x * -30,
        y: cursorPosition.y * -30,
        rotationY: cursorPosition.x * 10,
        rotationX: -cursorPosition.y * 10,
        duration: 1
      });
      
      // Particle attraction to cursor
      particlesRef.current.forEach((particle, index) => {
        const strength = 0.3;
        gsap.to(particle, {
          x: `+=${cursorPosition.x * 40 * strength}`,
          y: `+=${cursorPosition.y * 40 * strength}`,
          duration: 3,
          ease: "power1.out"
        });
      });
    };
    
    // Function to animate individual particle
    const animateParticle = (particle, index) => {
      // Generate random parameters
      const speed = 10 + Math.random() * 40;
      const scale = 0.5 + Math.random() * 2;
      const startX = Math.random() * 100 - 50;
      const startY = Math.random() * 100 - 50;
      const rotation = Math.random() * 360;
      
      // Apply random starting position
      gsap.set(particle, {
        x: startX + "vw",
        y: startY + "vh",
        scale: scale,
        rotation: rotation
      });
      
      // Create looping animation with random paths
      const createRandomPath = () => {
        const tl = gsap.timeline({
          repeat: -1,
          yoyo: true
        });
        
        for (let i = 0; i < 5; i++) {
          const nextX = Math.random() * 200 - 100;
          const nextY = Math.random() * 200 - 100;
          const nextRotation = Math.random() * 360;
          const duration = 5 + Math.random() * 10;
          
          tl.to(particle, {
            x: nextX + "vw",
            y: nextY + "vh", 
            rotation: nextRotation,
            duration: duration,
            ease: "sine.inOut"
          });
        }
        
        return tl;
      };
      
      // Create pulsing animation
      const createPulse = () => {
        return gsap.to(particle, {
          opacity: 0.2 + Math.random() * 0.5,
          scale: scale * (0.8 + Math.random() * 0.4),
          duration: 2 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      };
      
      // Run both animations
      createRandomPath();
      createPulse();
    };
    
    // Event listeners
    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isLoaded, cursorPosition]);
  
  // Function to add particles to refs array
  const addToParticlesRef = (el) => {
    if (el && !particlesRef.current.includes(el)) {
      particlesRef.current.push(el);
    }
  };
  
  return (<>
<div className="main w-screen h-screen fixed top-0 left-0 flex items-center justify-center  z-50">
  <div className="backtohome w-[30%] mx-auto mt-10">
    <Link to='/' className='text-4xl bg-orange-500/90 p-auto m-auto my-5 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out'>
      Back To Home
    </Link>
    <div ref={contentRef} className="mb-12 mt-5 transform-style-3d">
      <h2 
        className="text-3xl font-light text-white mb-4 tracking-wide glitch-text"
        style={{ transform: 'translateZ(30px)' }}
      >
        Reality Distortion Detected
      </h2>
      
      <p 
        className="text-lg text-white opacity-80 leading-relaxed"
        style={{ transform: 'translateZ(20px)' }}
      >
        The digital dimension you're searching for has collapsed or shifted beyond our current reach. Our quantum engineers are recalibrating the systems to restore access.
      </p>
    </div>
  </div>
</div>
    <div 
      ref={containerRef} 
      className="relative overflow-hidden w-full min-h-screen flex items-center justify-center perspective-1000"
      style={{ 
        background: 'radial-gradient(circle at center, #262438 0%, #1B1730 100%)',
        perspective: '1000px'
      }}
    >
     

      {/* Video background with noise overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.4) contrast(1.2)' }}
        >
          <source src="/api/placeholder/1920/1080" type="video/mp4" />
        </video>
        
        {/* Noise overlay */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-30"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            width: '100%',
            height: '100%'
          }}
        ></div>
        
        {/* Color overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at center, rgba(38,36,56,0.7) 0%, rgba(27,23,48,0.9) 100%)' 
          }}
        ></div>
      </div>
      
      {/* Animated portal effect */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="portal-ring relative w-96 h-96 rounded-full flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div 
              key={`ring-${i}`}
              className="portal-pulse absolute rounded-full"
              style={{
                width: `${100 + i * 20}%`,
                height: `${100 + i * 20}%`,
                border: `2px solid #FE744D`,
                opacity: 0.3 - i * 0.1,
                animation: `pulse ${3 + i}s infinite ease-in-out alternate`,
                animationDelay: `${i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Floating particles */}
      {[...Array(40)].map((_, i) => (
        <div 
          key={`particle-${i}`}
          ref={addToParticlesRef}
          className="absolute rounded-full opacity-40"
          style={{
            width: `${10 + Math.random() * 20}px`,
            height: `${10 + Math.random() * 20}px`,
            background: i % 3 === 0 ? '#FE744D' : i % 3 === 1 ? '#FF9B7D' : '#FFD4C2',
            filter: 'blur(2px)',
          }}
        ></div>
      ))}
      
      {/* Main content */}
      <div className="relative z-20 text-center px-6 max-w-2xl mx-auto transform-style-3d">
        <h1 
          ref={textRef}
          className="text-9xl font-black mb-6 transform-style-3d text-shadow"
          style={{ 
            color: '#FE744D',
            textShadow: '0 0 30px rgba(254,116,77,0.7)',
            transform: 'translateZ(50px)',
          }}
        >
          404
        </h1>
        
       
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 transform-style-3d">
          <Link to="/">
            <button 
              ref={buttonRef}
              className="group relative px-10 py-4 rounded-lg text-white font-medium overflow-hidden transition-all duration-300"
              style={{ 
                background: '#FE744D',
                transform: 'translateZ(40px)',
                boxShadow: '0 10px 30px -10px rgba(254,116,77,0.6)'
              }}
            >
              <span className="relative z-10">Return to Reality</span>
              
              {/* Button hover effects */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300" 
                   style={{ background: 'white' }}></div>
              <div className="absolute -inset-2 opacity-0 group-hover:opacity-50 scale-0 group-hover:scale-100 transition-all duration-500 rounded-full" 
                   style={{ background: '#FE744D', filter: 'blur(20px)' }}></div>
            </button>
          </Link>
          
          {/* Ultra Dynamic Home Button */}
          <Link to="/">
            <div 
              ref={homeButtonRef}
              className="group relative transform-style-3d"
              style={{ 
                transform: 'translateZ(60px)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <button 
                className="relative flex items-center justify-center w-16 h-16 rounded-full overflow-hidden transition-all duration-500 group-hover:scale-110"
                style={{ 
                  background: 'linear-gradient(135deg, #3CAAFF, #2463FF)',
                  boxShadow: '0 0 30px rgba(36, 99, 255, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.5)',
                }}
              >
                {/* Home icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className="w-8 h-8 relative z-10 transition-transform duration-500 group-hover:scale-110 fill-current text-white"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                
                {/* Inner glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                  style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)' }}
                ></div>
              </button>
              
              {/* Tooltip */}
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 rounded text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ 
                  background: 'rgba(36, 99, 255, 0.8)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Home
              </div>
              
              {/* Orbiting particles */}
              <div className="orbit-particle absolute w-full h-full top-0 left-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={`orbit-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: '4px',
                      height: '4px',
                      background: '#FFFFFF',
                      filter: 'blur(1px)',
                      top: `${50 + 40 * Math.cos(i * Math.PI * 2 / 3)}%`,
                      left: `${50 + 40 * Math.sin(i * Math.PI * 2 / 3)}%`,
                      boxShadow: '0 0 5px #3CAAFF',
                      opacity: 0.8,
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Energy wave effect on hover */}
              <div 
                className="absolute inset-0 w-full h-full rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  animation: 'wave 2s infinite',
                  border: '2px solid rgba(60, 170, 255, 0.5)',
                  transform: 'scale(1)',
                  transformOrigin: 'center',
                  transition: 'opacity 0.3s ease'
                }}
              ></div>
              <div 
                className="absolute inset-0 w-full h-full rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  animation: 'wave 2s infinite 0.5s',
                  border: '2px solid rgba(60, 170, 255, 0.3)',
                  transform: 'scale(1)',
                  transformOrigin: 'center',
                  transition: 'opacity 0.3s ease'
                }}
              ></div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Digital glitch effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen" 
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #1B1730 50%, transparent 100%)' }}
      >
        <div className="w-full h-full" style={{ 
          background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(254,116,77,0.1) 3px, transparent 4px)',
          backgroundSize: '100% 4px',
          animation: 'scanlines 5s linear infinite'
        }}></div>
      </div>
      
      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes scanlines {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
        
        @keyframes wave {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .glitch-text {
          position: relative;
          animation: glitch-skew 1s infinite linear alternate-reverse;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: 'Reality Distortion Detected';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          animation: glitch-anim-1 5s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          opacity: 0.8;
        }
        
        .glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
          animation: glitch-anim-2 1s infinite linear alternate-reverse;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          opacity: 0.8;
        }
        
        @keyframes glitch-anim-1 {
          0% {
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            transform: translate(0);
          }
          10% {
            clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
            transform: translate(-5px);
          }
          20% {
            clip-path: polygon(0 15%, 100% 15%, 100% 55%, 0 55%);
            transform: translate(5px);
          }
          30% {
            clip-path: polygon(0 25%, 100% 25%, 100% 65%, 0 65%);
            transform: translate(-5px);
          }
          40% {
            clip-path: polygon(0 45%, 100% 45%, 100% 65%, 0 65%);
            transform: translate(5px);
          }
          50% {
            clip-path: polygon(0 45%, 100% 45%, 100% 85%, 0 85%);
            transform: translate(-5px);
          }
          60% {
            clip-path: polygon(0 55%, 100% 55%, 100% 85%, 0 85%);
            transform: translate(5px);
          }
          70% {
            clip-path: polygon(0 65%, 100% 65%, 100% 85%, 0 85%);
            transform: translate(-5px);
          }
          80% {
            clip-path: polygon(0 75%, 100% 75%, 100% 90%, 0 90%);
            transform: translate(5px);
          }
          90% {
            clip-path: polygon(0 85%, 100% 85%, 100% 100%, 0 100%);
            transform: translate(-5px);
          }
          100% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            transform: translate(0);
          }
        }
        
        @keyframes glitch-anim-2 {
          0% {
            clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
            transform: translate(0);
          }
          15% {
            clip-path: polygon(0 65%, 100% 65%, 100% 80%, 0 80%);
            transform: translate(5px);
          }
          30% {
            clip-path: polygon(0 85%, 100% 85%, 100% 100%, 0 100%);
            transform: translate(-5px);
          }
          45% {
            clip-path: polygon(0 85%, 100% 85%, 100% 90%, 0 90%);
            transform: translate(5px);
          }
          60% {
            clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%);
            transform: translate(-5px);
          }
          75% {
            clip-path: polygon(0 70%, 100% 70%, 100% 95%, 0 95%);
            transform: translate(5px);
          }
          90% {
            clip-path: polygon(0 80%, 100% 80%, 100% 100%, 0 100%);
            transform: translate(-5px);
          }
          100% {
            clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
            transform: translate(0);
          }
        }
        
        @keyframes glitch-skew {
          0% {
            transform: skew(0);
          }
          10% {
            transform: skew(0);
          }
          11% {
            transform: skew(5deg);
          }
          12% {
            transform: skew(0);
          }
          70% {
            transform: skew(0);
          }
          71% {
            transform: skew(-5deg);
          }
          72% {
            transform: skew(0);
          }
          100% {
            transform: skew(0);
          }
        }
      `}</style>
    </div></>
  );
}


export default NotFound;


