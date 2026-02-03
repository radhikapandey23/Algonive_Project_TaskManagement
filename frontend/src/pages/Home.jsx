import React from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaUserPlus, FaSignInAlt, FaCheckCircle, FaClock, FaUsers, FaChartLine, FaClipboardList, FaRocket, FaShieldAlt, FaMobile } from "react-icons/fa";
import "./Home.css";

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <div className="logo-section">
                    <div className="logo">
                        <div className="logo-icon">
                            <FaClipboardList />
                        </div>
                        <div className="logo-text">
                            <span className="logo-main">TaskFlow</span>
                            <span className="logo-sub">Pro</span>
                        </div>
                    </div>
                </div>
                
                <div className="hero-section">
                    <div className="hero-icon">
                        <FaTasks />
                    </div>
                    <h1 className="hero-title">Task Management System</h1>
                    <p className="hero-subtitle">
                        The ultimate productivity platform designed for modern teams. 
                        Streamline workflows, boost collaboration, and achieve more with intelligent task management.
                    </p>
                </div>
                
                <div className="cta-buttons">
                    <Link to="/register" className="cta-btn primary">
                        <FaUserPlus className="btn-icon" />
                        <span>Get Started</span>
                    </Link>
                    <Link to="/login" className="cta-btn secondary">
                        <FaSignInAlt className="btn-icon" />
                        <span>Sign In</span>
                    </Link>
                </div>
                
                <div className="features">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaCheckCircle />
                        </div>
                        <h3>Smart Task Organization</h3>
                        <p>AI-powered categorization and priority suggestions help you organize tasks effortlessly with drag-and-drop simplicity.</p>
                        <div className="feature-highlight">✨ Auto-categorization</div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaClock />
                        </div>
                        <h3>Real-time Collaboration</h3>
                        <p>Work seamlessly with your team through live updates, instant notifications, and shared workspaces.</p>
                        <div className="feature-highlight">⚡ Live sync</div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaShieldAlt />
                        </div>
                        <h3>Enterprise Security</h3>
                        <p>Bank-level encryption and advanced security protocols keep your data safe and compliant.</p>
                        <div className="feature-highlight">🔒 256-bit encryption</div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaMobile />
                        </div>
                        <h3>Mobile-First Design</h3>
                        <p>Access your tasks anywhere with our responsive design and native mobile applications.</p>
                        <div className="feature-highlight">📱 Cross-platform</div>
                    </div>
                </div>
                
                <div className="benefits-section">
                    <h2 className="section-title">Why Teams Choose TaskFlow Pro</h2>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <span className="benefit-emoji">🚀</span>
                            <h4>3x Faster Setup</h4>
                            <p>Get your team up and running in minutes, not hours. Our intuitive onboarding process ensures immediate productivity.</p>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-emoji">💡</span>
                            <h4>Smart Automation</h4>
                            <p>Reduce manual work with intelligent task routing, automated reminders, and workflow optimization.</p>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-emoji">📊</span>
                            <h4>Data-Driven Insights</h4>
                            <p>Make informed decisions with comprehensive analytics, performance metrics, and productivity reports.</p>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-emoji">🌟</span>
                            <h4>Award-Winning Support</h4>
                            <p>24/7 customer success team with 99.9% satisfaction rate and average 2-minute response time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;