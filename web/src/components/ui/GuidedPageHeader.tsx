import { motion } from 'framer-motion'
import { ArrowLeft, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface StepItem {
    title: string
    description: string
}

interface GuidedPageHeaderProps {
    icon: LucideIcon
    kicker: string
    title: string
    subtitle: string
    color: string
    gradient: string
    steps: StepItem[]
    currentStep: number
}

export function GuidedPageHeader({
    icon: Icon,
    kicker,
    title,
    subtitle,
    color,
    gradient,
    steps,
    currentStep,
}: GuidedPageHeaderProps) {
    return (
        <motion.div
            className="guided-page-header"
            style={{ '--gph-color': color, '--gph-gradient': gradient } as React.CSSProperties}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link to="/" className="gph-back">
                <ArrowLeft size={16} />
                <span>Back to tools</span>
            </Link>

            <div className="gph-banner">
                <div className="gph-banner__glow" />
                <div className="gph-banner__icon">
                    <Icon size={24} />
                </div>
                <div className="gph-banner__text">
                    <span className="gph-kicker">{kicker}</span>
                    <h2 className="gph-title">{title}</h2>
                    <p className="gph-subtitle">{subtitle}</p>
                </div>
            </div>

            <div className="gph-steps">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className={`gph-step ${idx <= currentStep ? 'gph-step--active' : ''} ${idx === currentStep ? 'gph-step--current' : ''}`}
                    >
                        <div className="gph-step__dot">
                            {idx < currentStep ? '✓' : idx + 1}
                        </div>
                        <div className="gph-step__info">
                            <strong>{step.title}</strong>
                            <span>{step.description}</span>
                        </div>
                        {idx < steps.length - 1 && <div className="gph-step__line" />}
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
