import React from 'react';

// --- 3. Trust Bar Component (Trusted by Millions Section) ---
const SaathjanamTrustBar = () => {
    const featureStyle = {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        margin: '0 30px',
        textAlign: 'center'
    };

    const iconStyle = { 
        fontSize: '24px', 
        color: '#D13550', // Primary color
        marginBottom: '8px' 
    };

    return (
        <section style={{ 
            padding: '40px 15%', 
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderTop: '1px solid #eee'
        }}>
            <div style={{
                display: 'inline-block',
                backgroundColor: '#4CB9D2',
                color: 'white',
                padding: '8px 25px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '40px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                Trusted by Millions
            </div>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                paddingTop: '20px', 
                gap: '50px' 
            }}>
                
                {/* Feature 1: Best Matches (Placeholder for Icon) */}
                <div style={featureStyle}>
                    <span style={iconStyle}>
                        <span role="img" aria-label="Heart">💖</span>
                    </span>
                    <p style={{ margin: 0, fontWeight: '600' }}>**Best Matches**</p>
                </div>

                {/* Feature 2: Verified Profiles (Placeholder for Icon) */}
                <div style={featureStyle}>
                    <span style={{ ...iconStyle, color: '#4CAF50' }}>
                        <span role="img" aria-label="Check">✅</span>
                    </span>
                    <p style={{ margin: 0, fontWeight: '600' }}>**Verified Profiles**</p>
                </div>

                {/* Feature 3: 100% Privacy (Placeholder for Icon) */}
                <div style={featureStyle}>
                    <span style={{ ...iconStyle, color: '#FFA500' }}>
                        <span role="img" aria-label="Lock">🔒</span>
                    </span>
                    <p style={{ margin: 0, fontWeight: '600' }}>**100% Privacy**</p>
                </div>
            </div>
        </section>
    );
};

// --- 2. Header Component (Main banner and intro text) ---
const SaathjanamHeader = () => {
    return (
        <header style={{ 
            padding: '40px 15% 20px', 
            textAlign: 'center', 
            fontFamily: 'Arial, sans-serif' 
        }}>
            <h1 style={{ 
                fontSize: '32px', 
                color: '#D13550', 
                marginBottom: '5px' 
            }}>
                Saathjanam.com
            </h1>
            <p style={{ 
                fontSize: '16px', 
                color: '#666', 
                marginBottom: '20px' 
            }}>
                - **Trusted by over 35 Million Members**
            </p>
            
            <div style={{ 
                fontSize: '14px', 
                marginBottom: '20px' 
            }}>
                <a href="/india" style={{ color: '#007bff', textDecoration: 'none' }}>India</a> | 
                <a href="/usa" style={{ color: '#007bff', textDecoration: 'none', margin: '0 8px' }}>USA</a> | 
                <a href="/canada" style={{ color: '#007bff', textDecoration: 'none', margin: '0 8px' }}>Canada</a> | 
                <a href="/uk" style={{ color: '#007bff', textDecoration: 'none', margin: '0 8px' }}>UK</a> | 
                <a href="/nri" style={{ color: '#D13550', textDecoration: 'none', fontWeight: 'bold' }}>NRI Matrimonials »</a>
            </div>
        </header>
    );
};

// --- 1. Main Application Component for the About Us Page ---
const AboutUs = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
            <SaathjanamHeader />
            <SaathjanamTrustBar />
            
            {/* --- Main About Us Content Area --- */}
            <main style={{ 
                flexGrow: 1, 
                padding: '50px 15%', 
                maxWidth: '900px',
                margin: '0 auto',
                textAlign: 'left'
            }}>
                <h2 style={{ color: '#333', borderBottom: '2px solid #D13550', paddingBottom: '10px', marginBottom: '30px' }}>
                    Our Journey to Finding Happiness
                </h2>
                
                <p>
                    **Saathjanam.com** was established with a singular mission: to redefine the way people meet and find their life partners. Launched in 2025, we quickly grew to become one of the world’s most trusted matrimonial services, driven by innovation, security, and a deep understanding of our members' cultural needs.
                </p>
                
                <h3 style={{ color: '#4CB9D2', marginTop: '30px' }}>The Saathjanam Promise</h3>
                <ul>
                    <li>**Innovation:** We continually upgrade our platform with smart matching algorithms.</li>
                    <li>**Trust:** Every profile is screened to ensure a safe and genuine experience.</li>
                    <li>**Privacy:** We employ industry-leading encryption and privacy controls.</li>
                </ul>

                <p style={{ marginTop: '30px', fontWeight: 'bold' }}>
                    Join the millions who have found their happily ever after with Saathjanam!
                </p>
            </main>
            
            {/* The Footer would go here if needed, e.g.: <SaathjanamFooter /> */}
        </div>
  );
}

export default AboutUs;