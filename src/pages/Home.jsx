import React from "react";
import { MdLocalFlorist } from "react-icons/md";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PsychologyIcon from "@mui/icons-material/Psychology";
import '../styleSheets/homePage.css';
import FAQ from "../components/FAQ";

const Home = () => {

    return (
        <div className="homePage">

            <div className="homeBanner">
                <div className="bannerInner container">
                    <div className="bannerText">
                        <img src="/vivahjeevan_logo.png" alt="vivahjeevan_logo" height={'200px'} />
                        <h1>Vivahjeevan</h1>
                        <h4>Bond for Seven Lifetimes...</h4>
                    </div>

                    <div className="bannerImage">
                        <img src="banner2.png" alt="homeBanner" loading="lazy" />
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
                                <TaskAltIcon sx={{ fontSize: 70, color: 'blue', mb: 1, }} />
                                <h6 className="card-title" style={{ fontWeight: 'bold' }}>Blue Tick to find your Green Flag</h6>
                                <p className="card-text opacity-75">Did you know our blue-tick profiles get 40% more connection requests than others?.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card homeCard">
                            <div className="card-body">
                                <PsychologyIcon sx={{ fontSize: 70, color: '#00eaffff', mb: 1, }} />
                                <h6 className="card-title" style={{ fontWeight: 'bold' }}>Matchmaking Powered by AI</h6>
                                <p className="card-text opacity-75">Cutting-edge technology with two decades of matchmaking expertise to help you find "the one".</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <FAQ />
            </div>
        </div>
    );
};

export default Home;