import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextAnimate } from './components/TextAnimate';
import { SmoothCursor } from './components/SmoothCursor';
import GridBackground from './components/ui/GridBackground';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { cn } from './lib/utils';
import Lenis from 'lenis';
import HeroCanvas from './components/HeroCanvas'; 
import ProjectCarousel from './components/ProjectCarousel'; // Import the new carousel

// Import Images
import SkateScooter from './components/SkateScooter2_4.png';
import ClayExtruder from './components/clay extruder.png';
import biofoster from './components/biofoster.png';
import differential from './components/differential.png';
import skrillex from './components/CURLINX.jpg';
import microextruder from './components/microextruder.png';
import gears from './components/gears.png';
import bioform from './components/Bioform 3.png';
import fea from './components/fea.png';
import sketch from './components/sketch.png';
import hybrutos from './components/hybrutos.jpg';
import drawing from './components/Steering Fork Drawing.png';
import resumePdf from './components/resume.pdf'; 

// --- PROJECT DATA ---
const projects = [
    { 
        id: 1, 
        title: "CAD Modeling", 
        //category: "Prototyping", 
        mainImage: gears,
        className: "md:col-span-2",
        gallery: [
            { imageUrl: gears, title: "Gears Assembly", description: "Custom helical gear assembly modelled and mated in Autodesk Inventor" },
            { imageUrl: biofoster, title: "Main Assembly", description: "The complete Bio 3D printer assembly, designed for high-precision tissue engineering." },
            { imageUrl: SkateScooter, title: "Full Scooter Design", description: "A sleek and modern electric scooter concept designed in SolidWorks." },
            { imageUrl: ClayExtruder, title: "Clay Extruder", description: "A robust clay extruder." },
            { imageUrl: "https://placehold.co/1200x800/e5e5e5/1a1a1a?text=Extruder+Detail", title: "Custom Extruder Head", description: "A close-up of the custom-designed micro-extruder head for handling biomaterials." },
            { imageUrl: "https://placehold.co/1200x800/e5e5e5/1a1a1a?text=Print+Bed", title: "Heated Print Bed", description: "The temperature-controlled print bed for optimal cell viability." }
        ] 
    },
    { 
        id: 2, 
        title: "2D Drawing", 
        //category: "CAD & CAM", 
        mainImage: drawing,
        className: "md:row-span-2",
        gallery: [
            { imageUrl: drawing, title: "Frame & Battery Housing", description: "Detailed view of the integrated frame and battery compartment." },
            { imageUrl: SkateScooter, title: "Full Scooter Design", description: "A sleek and modern electric scooter concept designed in SolidWorks." },
            { imageUrl: "https://placehold.co/1200x800/e5e5e5/1a1a1a?text=Motor+Mount", title: "Motor Mount Assembly", description: "The rear wheel hub and motor mounting mechanism." }
        ] 
    },
    { 
        id: 3, 
        title: "Finite Element Analysis", 
        //category: "Cad Design", 
        mainImage: fea, 
        className: "",
        gallery: [{ imageUrl: fea, title: "Concept Car", description: "A futuristic concept car design." }] 
    },
    { 
        id: 4, 
        title: "Rendering", 
        //category: "Solidworks", 
        mainImage: skrillex, 
        className: "",
        gallery: [{ imageUrl: skrillex, title: "Differential Gearbox", description: "A detailed differential gearbox model." }] 
    },
    { 
        id: 5, 
        title: "Prototyping", 
        //category: "Product Development", 
        mainImage: hybrutos, 
        className: "",
        gallery: [{ imageUrl: hybrutos, title: "Clay Extruder", description: "A robust clay extruder." }] 
    },
    { 
        id: 6, 
        title: "Sketching", 
        //category: "Product Development", 
        mainImage: sketch, 
        className: "",
        gallery: [{ imageUrl: sketch, title: "Micro Extruder", description: "A compact micro-extruder." }] 
    },
];

// -- ANIMATION COMPONENTS --

const BentoCard = ({ project, onClick }) => {
    return (
        <motion.div onClick={() => onClick(project)} className={cn("relative w-full h-full min-h-[200px] md:min-h-0 overflow-hidden bg-gray-200 cursor-pointer group", project.className)} layoutId={`card-container-${project.id}`}>
            <motion.img src={project.mainImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <motion.div layoutId={`card-content-${project.id}`} className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="font-bold">{project.title}</h3>
                <p className="text-xs">{project.category}</p>
            </motion.div>
        </motion.div>
    );
};

// -- MODALS --

const Modal = ({ children, onClose }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10] flex items-center justify-center bg-black/50 backdrop-blur-md" onClick={onClose}>
        {children}
    </motion.div>
);

const ProjectDetailModal = ({ project, onClose }) => {
    const carouselRef = useRef(null);

    return (
        <Modal onClose={onClose}>
            <motion.div 
                layoutId={`card-container-${project.id}`} 
                className="relative bg-white text-black w-[90vw] h-[85vh] border-b border-gray-200 flex flex-col items-center" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full h-full flex-grow relative">
                    <ProjectCarousel ref={carouselRef} gallery={project.gallery} />
                </div>
                
                {/* --- Carousel Controls --- */}
                <button 
                    onClick={() => carouselRef.current?.scrollPrev()} 
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 h-[15%] p-3 z-10 backdrop-blur-sm transition-transform hover:bg-gray-300 hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button 
                    onClick={() => carouselRef.current?.scrollNext()} 
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 h-[15%] p-3 z-10 backdrop-blur-sm transition-transform hover:bg-gray-300 hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </motion.div>
        </Modal>
    );
};


const ResumeModal = ({ onClose }) => (
     <Modal onClose={onClose}>
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="bg-white text-black p-4 md:p-8 w-full max-w-2xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">My Resume</h3>
                <a href={resumePdf} download="Ashish_Yadav_Resume.pdf" className="text-center bg-black text-white px-4 py-2 text-sm">Download</a>
            </div>
            <div className="flex-grow border"><embed src={resumePdf} type="application/pdf" width="100%" height="100%" /></div>
        </motion.div>
    </Modal>
);

const ContactModal = ({ onClose }) => (
    <Modal onClose={onClose}>
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="bg-white text-black p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-2">Contact Me</h3>
            <p className="text-gray-600 mb-4">yadavashish1357@gmail.com</p>
            <a href="mailto:yadavashish1357@gmail.com" className="w-full text-center block bg-black text-white px-4 py-2">Send Mail</a>
        </motion.div>
    </Modal>
);

// -- SECTIONS --

const Header = ({ onContactClick, onResumeClick }) => (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center text-black bg-white/50 backdrop-blur-md border-b border-gray-200/50">
        <div className="text-2xl font-bold tracking-tighter">AY.</div>
        <div className="flex items-center gap-4">
            <button onClick={onResumeClick} className="text-sm px-2 py-2 transition-colors duration-300 hover:bg-gray-200">Resume</button>
            <button onClick={onContactClick} className="text-sm px-2 py-2 transition-colors duration-300 hover:bg-gray-200">Contact</button>
            <a href="https://www.linkedin.com/in/ashishyadav16/" target="_blank" rel="noopener noreferrer" className="text-sm px-4 py-2 border border-black transition-colors duration-300 hover:bg-gray-200">LinkedIn</a>
        </div>
    </header>
);

const Hero = () => (
    <section className="h-screen w-full relative flex flex-col items-center justify-center text-black px-4">
        <HeroCanvas />
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-full overflow-hidden">
                <TextAnimate as="h1" animation="blurInUp" by="character" duration={0.5} delay={0.3} className="text-[clamp(2rem,8vw,5rem)] font-bold tracking-tighter text-center pointer-events-none whitespace-nowrap" aurora={true} startOnView={false} once={true}>
                  Ashish Kumar Yadav
                </TextAnimate>
            </div>
            <TextAnimate as="p" animation="slideUp" duration={0.5} delay={1.5} className="text-xl md:text-2xl text-gray-600 mt-4 text-center pointer-events-none" startOnView={false} once={true}>
                Automobile Engineer
            </TextAnimate>
        </div>
        <motion.div initial={{ y: 0, opacity: 1 }} animate={{ y: 20, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} className="absolute bottom-10 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
        </motion.div>
    </section>
);

const ProjectsSection = ({ onProjectClick }) => {
    const containerRef = useRef(null);
    const bentoVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
    const cardVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <section className="py-20 px-4 md:px-8">
            <motion.div ref={containerRef} variants={bentoVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="max-w-[80%] mx-auto grid md:grid-cols-4 auto-rows-[300px] gap-4">
                {projects.map((project) => (
                    <motion.div key={project.id} variants={cardVariants} className={cn("relative", project.className)}>
                        <BentoCard project={project} onClick={onProjectClick} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

const AboutMeSection = () => (
    <section className="h-screen flex flex-col justify-center items-center py-20 px-4 text-center text-black">
        <div>
            <motion.h2 initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-4xl md:text-8xl font-bold tracking-tighter text-center z-1 pointer-events-none mb-8">
                About Me
            </motion.h2>
            <motion.p initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.5, duration: 0.8 }} className="max-w-6xl mx-auto text-gray-600 text-lg leading-relaxed">
                I am an Automobile Engineer with a deep passion for CAD designing and innovative product development. My expertise lies in turning complex ideas into tangible, efficient, and well-designed products. I thrive on challenges and am constantly exploring new technologies to push the boundaries of what's possible in the automotive world.
            </motion.p>
        </div>
    </section>
);

// --- MAIN APP ---
function App() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="bg-white font-sans min-h-screen w-screen overflow-x-hidden relative">
             <ScrollProgress />
             <GridBackground>
                <Header 
                    onContactClick={() => setIsContactOpen(true)} 
                    onResumeClick={() => setIsResumeOpen(true)} 
                />
                <main>
                    <Hero />
                    <ProjectsSection onProjectClick={setSelectedProject} />
                    <AboutMeSection />
                </main>
            </GridBackground>
            <SmoothCursor />
            <AnimatePresence>
                {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} />}
                {isResumeOpen && <ResumeModal onClose={() => setIsResumeOpen(false)} />}
                {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
            </AnimatePresence>
        </div>
    );
}

export default App;

