import React, { lazy } from "react";
import { MdLocalFlorist, MdPsychology, MdTaskAlt } from "react-icons/md";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PsychologyIcon from "@mui/icons-material/Psychology";
import '../styleSheets/homePage.css';
import AssistedService from "../components/assistedService/AssistedService";
const FAQ = lazy(() => import("../components/FAQ"));

const Home = () => {

    return (
        <div className="homePage">

            <div className="homeBanner">
                <div className="bannerInner container">
                    <div className="bannerText">
                        <img src="/vivahjeevan_logo.png" alt="vivahjeevan_logo" height="200" width="200" />
                        <h1>Vivahjeevan</h1>
                        <h4>Bond for Seven Lifetimes...</h4>
                    </div>

                    <div className="bannerImage">
                        <img src="banner2.webp" alt="homeBanner" width="520" height="450"/>
                    </div>
                </div>
            </div>

            <div className="container mt-5 mb-5 py-4 w-75">
                <h2 className="cardHeader">The Matrimony Experience</h2>

                <div className="row mt-4 experienceScroll">
                    <div className="col-sm-4 mb-3 mb-sm-0">
                        <div className="card homeCard">
                            <div className="card-body">
                                <MdLocalFlorist size={70} color="#8B6F47" />
                                <h6 className="card-title" style={{ fontWeight: 'bold' }}>Spiritual Compatibility Focus</h6>
                                <p className="card-text opacity-75">
                                    Where values, beliefs, and life purpose align We prioritize inner values, faith alignment, and practical life harmony.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card homeCard">
                            <div className="card-body">
                                <MdTaskAlt  size={70} color="blue" />
                                <h6 className="card-title" style={{ fontWeight: 'bold' }}>Verified Blue-Tick Profiles</h6>
                                <p className="card-text opacity-75">Profiles with a blue tick build more trust and receive higher connection requests compared to regular profiles.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card homeCard">
                            <div className="card-body">
                                <MdPsychology size={70} color="#00eaffff" />
                                <h6 className="card-title" style={{ fontWeight: 'bold' }}>Smart AI Matchmaking</h6>
                                <p className="card-text opacity-75">Combining advanced technology with years of expertise to guide users toward the right life partner.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <AssistedService />
            </div>

            <div>
                <FAQ />
            </div>
        </div>
    );
};

export default Home;