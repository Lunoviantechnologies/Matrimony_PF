import React from "react";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PsychologyIcon from "@mui/icons-material/Psychology";

const Home = () => {

    return (
        <div>
            <div className="homeImage">
                <span className="homeImageText">
                    <b className="imageTextStyle">Your journey to a lifelong</b> <br />
                    <b>companionship starts here...</b> <br />
                    <button className="btn btn-primary text-white mt-4 px-3 py-2" style={{ borderRadius: '500px' }}>Your Ideal Match Awaits</button>
                    <p className="mt-4"> #1 Matchmaking service | ⭐⭐⭐⭐⭐  Rating on Playstore | Successful stories</p>
                </span>
            </div>

            <div className="container mt-5 mb-5 py-4 w-75">
                <h2>The Matrimony Experience</h2>

                <div className="row mt-4">
                    <div class="col-sm-4 mb-3 mb-sm-0">
                        <div class="card homeCard">
                            <div class="card-body">
                                <CurrencyExchangeIcon sx={{ fontSize: 70, color: 'green', mb: 1,}} />
                                <h6 class="card-title" style={{ fontWeight: 'bold' }}>30 Day Money Back Guarantee</h6>
                                <p className="card-text opacity-75">Get matched with someone special within 30 days, or we’ll refund your money—guaranteed!</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="card homeCard">
                            <div class="card-body">
                                <TaskAltIcon sx={{ fontSize: 70, color: 'blue', mb: 1,}} />
                                <h6 class="card-title" style={{ fontWeight: 'bold' }}>Blue Tick to find your Green Flag</h6>
                                <p className="card-text opacity-75">Did you know our blue-tick profiles get 40% more connection requests than others?.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="card homeCard">
                            <div class="card-body">
                                <PsychologyIcon sx={{ fontSize: 70, color: '#00eaffff', mb: 1,}} />
                                <h6 class="card-title" style={{ fontWeight: 'bold' }}>Matchmaking Powered by AI</h6>
                                <p className="card-text opacity-75">Cutting-edge technology with two decades of matchmaking expertise to help you find "the one".</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;