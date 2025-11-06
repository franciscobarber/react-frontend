import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await api.getRecommendations();
                setRecommendations(data);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div>
            <h3>You might also like</h3>
            {recommendations.length > 0 ? (
                <ul>{recommendations.map(rec => <li key={rec.id}>{rec.name}</li>)}</ul>
            ) : <p>No recommendations at this time.</p>}
        </div>
    );
};

export default Recommendations;