import React from 'react';
import { LEARNING_TIPS } from '../constants';
import { LightbulbIcon } from './icons/SidebarIcons';

const TipsAndTricks: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-8">
                <LightbulbIcon className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl font-bold text-dark dark:text-dark-text">Tips & Trik Belajar</h1>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
                {LEARNING_TIPS.map((tip, index) => (
                    <div key={index} className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md flex items-start">
                        <span className="text-2xl mr-4 text-primary">💡</span>
                        <p className="text-dark dark:text-dark-text">{tip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TipsAndTricks;
