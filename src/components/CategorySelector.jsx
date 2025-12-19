import { useState } from 'react';
import { MOOD_CATEGORIES, formatMoodPrompt } from '../constants/moodCategories';
import './CategorySelector.css';

const CategorySelector = ({ onSelect, selectedMood }) => {
    const [activeCategory, setActiveCategory] = useState('emotions');

    const handleMoodClick = (categoryId, mood) => {
        const promptText = formatMoodPrompt(categoryId, mood.id);
        onSelect(promptText, { categoryId, moodId: mood.id });
    };

    const activeCategoryData = MOOD_CATEGORIES[activeCategory];

    return (
        <div className="category-selector">
            {/* Category Tabs */}
            <div className="category-tabs">
                {Object.values(MOOD_CATEGORIES).map(category => (
                    <button
                        type="button"
                        key={category.id}
                        className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                        style={{
                            '--category-color': category.color
                        }}
                    >
                        <span className="category-tab-label">{category.label}</span>
                    </button>
                ))}
            </div>

            {/* Mood Grid */}
            <div className="mood-grid">
                {activeCategoryData.moods.map(mood => {
                    const isSelected = selectedMood?.categoryId === activeCategory &&
                        selectedMood?.moodId === mood.id;

                    return (
                        <button
                            type="button"
                            key={mood.id}
                            className={`mood-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleMoodClick(activeCategory, mood)}
                            style={{
                                '--mood-color': activeCategoryData.color
                            }}
                        >
                            <span className="mood-label">{mood.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelector;
