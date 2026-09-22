import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, ArrowDown, HelpCircle, CheckCircle2, ShieldCheck, DoorOpen, ChevronDown } from 'lucide-react'
import './IntroDoorGateway.css'

interface IntroDoorGatewayProps {
    onEnterStudio?: () => void
    children: React.ReactNode
}

export function IntroDoorGateway({ onEnterStudio, children }: IntroDoorGatewayProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Scroll progress for the overall door transition section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    // Door opening transforms (0 -> 1 scroll range)
    // Left door rotates on Y axis from 0deg to -105deg
    const leftDoorRotateY = useTransform(scrollYProgress, [0.35, 0.75], [0, -105])
    const leftDoorX = useTransform(scrollYProgress, [0.35, 0.75], ['0%', '-100%'])

    // Right door rotates on Y axis from 0deg to 105deg
    const rightDoorRotateY = useTransform(scrollYProgress, [0.35, 0.75], [0, 105])
    const rightDoorX = useTransform(scrollYProgress, [0.35, 0.75], ['0%', '100%'])

    // Portal glow flare behind the doors
    const portalGlow = useTransform(scrollYProgress, [0.25, 0.6, 0.85], [0, 1, 0.3])
    const portalScale = useTransform(scrollYProgress, [0.4, 0.85], [0.85, 1])
    const portalOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0.2, 1])

    // Question cards scroll animation
    const q1Y = useTransform(scrollYProgress, [0.05, 0.2], [40, 0])
    const q1Opacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])

    return (
        <div className="gateway-container">
            {/* Top Floating Direct Access Bar */}
            <div className="gateway-top-bar">
                <div className="vitian-pill">
                    <Sparkles size={14} className="sparkle-icon" />
                    <span>Student Hub • Made by VITIans</span>
                </div>
                <button
                    className="skip-door-btn"
                    onClick={() => {
                        const studioElement = document.getElementById('main-studio-landing')
                        studioElement?.scrollIntoView({ behavior: 'smooth' })
                        if (onEnterStudio) onEnterStudio()
                    }}
                >
                    <span>Enter Studio</span>
                    <DoorOpen size={16} />
                </button>
            </div>

            {/* Hero Intro Section */}
            <section className="gateway-hero">
                <div className="gateway-badge">
                    <ShieldCheck size={14} />
                    <span>OFFICIAL STUDENT HUB PLATFORM</span>
                </div>

                <h1 className="gateway-title">
                    Student Hub <br />
                    <span className="vitian-gradient">Made by VITIans</span>
                </h1>

                <p className="gateway-subtitle">
                    Crafted by VIT students who walked in your shoes. We faced the exam pressure, dry textbook slides,
                    and endless ATS resume rejection. So we built the ultimate studio for you.
                </p>

                <div className="scroll-indicator">
                    <span>Scroll down to unlock the studio</span>
                    <ChevronDown className="bounce-arrow" size={20} />
                </div>
            </section>

            {/* Relatable Self-Doubt Questions Section */}
            <section className="doubt-section">
                <div className="section-header">
                    <span className="doubt-label">DOES THIS SOUND LIKE YOU?</span>
                    <h2>Be Honest with Yourself...</h2>
                </div>

                <div className="doubt-grid">
                    <motion.div className="doubt-card" style={{ y: q1Y, opacity: q1Opacity }}>
                        <div className="doubt-icon-wrap">
                            <HelpCircle size={24} />
                        </div>
                        <h3>Struggling with 100+ Page Slides?</h3>
                        <p>
                            Wasting precious hours reading long chapters and dry PDFs before exams without understanding key concepts?
                        </p>
                    </motion.div>

                    <motion.div className="doubt-card">
                        <div className="doubt-icon-wrap">
                            <HelpCircle size={24} />
                        </div>
                        <h3>Getting Auto-Rejected by ATS Bots?</h3>
                        <p>
                            Sending 50+ resumes on job portals only to receive automated rejection emails with zero recruiter calls?
                        </p>
                    </motion.div>

                    <motion.div className="doubt-card">
                        <div className="doubt-icon-wrap">
                            <HelpCircle size={24} />
                        </div>
                        <h3>Losing Track of Applications?</h3>
                        <p>
                            Scattering job applications across LinkedIn, Naukri, and Indeed without a unified application pipeline?
                        </p>
                    </motion.div>
                </div>

                {/* Reassurance Banner */}
                <motion.div
                    className="reassurance-box"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="reassurance-badge">
                        <CheckCircle2 size={18} />
                        <span>DON'T WORRY, WE ARE HERE!</span>
                    </div>
                    <h2>Student Hub Has Got Your Back.</h2>
                    <p>
                        You don't need to struggle alone anymore. Our AI Study Summarizer, ATS Resume Studio, and Job Tracker work together to give you 100% clarity and control.
                    </p>
                    <div className="reassurance-arrow-prompt">
                        <span>Keep scrolling to open the doors to your Studio</span>
                        <ArrowDown size={18} className="pulse-down" />
                    </div>
                </motion.div>
            </section>

            {/* 3D Scroll Door Opening Section */}
            <div ref={containerRef} className="door-viewport-container">
                <div className="door-sticky-stage">
                    {/* Light Rays & Glow Flare behind doors */}
                    <motion.div
                        className="door-portal-glow"
                        style={{
                            opacity: portalGlow,
                        }}
                    />

                    {/* Studio Content Container (Revealed as Doors Open) */}
                    <motion.div
                        id="main-studio-landing"
                        className="door-revealed-content"
                        style={{
                            scale: portalScale,
                            opacity: portalOpacity,
                        }}
                    >
                        {children}
                    </motion.div>

                    {/* The 3D Grand Door Frame & Panels */}
                    <div className="door-3d-wrapper">
                        {/* Left Door Panel */}
                        <motion.div
                            className="door-panel door-left"
                            style={{
                                rotateY: leftDoorRotateY,
                                x: leftDoorX,
                            }}
                        >
                            <div className="door-inner">
                                <div className="door-crest">
                                    <div className="crest-symbol">AH</div>
                                    <span>STUDENT HUB</span>
                                </div>
                                <div className="door-handle door-handle-left" />
                                <div className="door-pattern" />
                            </div>
                        </motion.div>

                        {/* Right Door Panel */}
                        <motion.div
                            className="door-panel door-right"
                            style={{
                                rotateY: rightDoorRotateY,
                                x: rightDoorX,
                            }}
                        >
                            <div className="door-inner">
                                <div className="door-crest">
                                    <div className="crest-symbol">VIT</div>
                                    <span>MADE BY VITIANS</span>
                                </div>
                                <div className="door-handle door-handle-right" />
                                <div className="door-pattern" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
