// ===== EXPANDED SCIENTIFIC WEIGHT SYSTEM =====
const riskWeights = {
    // CRITICAL FACTORS
    obesity: 20,
    apnea: 18,
    diabetes: 15,
    opioids: 18,
    steroids: 15,
    alcohol: 12,
    smoking: 10,

    // NUTRITION
    'sugar-drinks': 8,
    'processed-carbs': 6,
    'low-protein': 5,
    'low-fat': 4,
    'soy-heavy': 3,
    'intermittent-fasting': -2,

    // EXERCISE
    'overtraining': 9,
    'sedentary-job': 7,
    'no-steps': 6,
    'consistent-training': -5,
    'active-lifestyle': -3,

    // STRESS
    'chronic-stress': 8,
    'poor-sleep-mental': 7,
    'relationship-stress': 6,
    'meditation': -4,
    'good-coping': -3,

    // ENVIRONMENT
    'bpa-plastics': 8,
    'nonstick-cookware': 5,
    'conventional-produce': 4,
    'water-filter': -3,
    'organic-foods': -2,

    // SYMPTOMS
    symptoms: 2,

    // AGE
    age: {
        '25-29': 0,
        '30-39': 5,
        '40-49': 10,
        '50+': 15
    },

    // SLEEP
    sleep: {
        '4': 15,
        '5': 12,
        '6': 6,
        '7': 3,
        '8': 0,
        '9': 0
    },
    'sleep-quality': {
        'excellent': -2,
        'good': 0,
        'fair': 3,
        'poor': 6,
        'very-poor': 9
    },

    // DIET
    'diet-type': {
        'western': 8,
        'mediterranean': -3,
        'low-carb': -2,
        'plant-based': 4,
        'balanced': 0,
        'other': 2
    },

    // VEGETABLES
    'vegetable-intake': {
        '0': 6,
        '1': 3,
        '2': 0,
        '3': -2
    },

    // EXERCISE SELECT
    'strength-frequency': {
        '0': 8,
        '1': 4,
        '2': 0,
        '3': -3
    },
    'cardio-frequency': {
        '0': 6,
        '1': 2,
        '2': 0,
        '3': -2
    },

    // STRESS SELECT
    'stress-level': {
        'very-low': -2,
        'low': 0,
        'moderate': 4,
        'high': 8,
        'very-high': 12
    },
    'social-support': {
        'excellent': -3,
        'good': 0,
        'fair': 3,
        'poor': 6,
        'isolated': 9
    },

    // ENVIRONMENT SELECT
    'air-quality': {
        'excellent': -1,
        'good': 0,
        'fair': 3,
        'poor': 6,
        'very-poor': 9
    },

    // FAMILY HISTORY
    'family-history': {
        'none': 0,
        'diabetes': 4,
        'thyroid': 3,
        'low-testosterone': 6,
        'multiple': 8
    }
};

// ===== CONFIGURATIONS AND CONSTANTS =====
const CATEGORY_ICONS = {
    critical: '🔴',
    medium: '🟡',
    light: '🟢',
    symptoms: '📋'
};

const CATEGORY_TITLES = {
    critical: 'Critical Factors (10-25 pts impact)',
    medium: 'Medium Factors (5-10 pts impact)',
    light: 'Light Factors (1-4 pts impact)',
    symptoms: 'Clinical Symptoms'
};

const OVERWEIGHT_IMPACT = 10;
const BASE_TESTOSTERONE = 700;
const MIN_TESTOSTERONE = 150;
const MAX_TESTOSTERONE = 1200;

// ===== PAYHIP CONFIGURATION =====
const PAYHIP_URL = "https://payhip.com/b/h2nNu"; // REPLACE WITH YOUR ACTUAL PAYHIP URL

// ===== DOM CACHE =====
const domCache = {
    elements: {},
    get(id) {
        if (!this.elements[id]) {
            this.elements[id] = document.getElementById(id);
        }
        return this.elements[id];
    },
    clear() {
        this.elements = {};
    }
};

// ===== GLOBAL VARIABLES =====
let currentSection = 0;
let sections = [];
let obesityProcessed = false;
let isInitializing = true;

// ===== OPTIMIZED TESTOSTERONE ESTIMATOR =====
function estimateTestosterone(totalRisk) {
    if (totalRisk <= 0) return BASE_TESTOSTERONE;
    
    // Logarithmic curve for more realistic estimation
    const riskFactor = Math.min(totalRisk / 100, 0.9);
    const adjustment = 1 - (riskFactor * 0.7); // 70% max reduction
    let testosteroneLevel = BASE_TESTOSTERONE * adjustment;
    
    return Math.max(MIN_TESTOSTERONE, Math.min(MAX_TESTOSTERONE, Math.round(testosteroneLevel)));
}

function getTestosteroneInterpretation(level) {
    if (level < 250) {
        return {
            level: "CRITICALLY LOW",
            class: "testosterone-critical",
            message: "Severely deficient levels. Consult an endocrinologist urgently.",
            recommendation: "Immediate medical evaluation and possible hormone replacement therapy."
        };
    } else if (level < 350) {
        return {
            level: "LOW",
            class: "testosterone-low",
            message: "Levels below optimal range. Multiple factors are affecting your hormone production.",
            recommendation: "Aggressive lifestyle approach focusing on sleep, stress management, exercise and nutrition."
        };
    } else if (level < 500) {
        return {
            level: "BELOW AVERAGE",
            class: "testosterone-medium",
            message: "Within normal but suboptimal range. There is significant room for improvement.",
            recommendation: "Optimize key habits to achieve optimal levels through targeted lifestyle changes."
        };
    } else if (level < 700) {
        return {
            level: "OPTIMAL",
            class: "testosterone-good",
            message: "Healthy and functional levels. Good hormonal balance maintained.",
            recommendation: "Maintain current healthy habits and focus on incremental improvements."
        };
    } else {
        return {
            level: "EXCELLENT",
            class: "testosterone-excellent",
            message: "Exceptional levels. Maximum hormonal potential achieved.",
            recommendation: "Continue with your current routine - you're in the top percentile for hormonal health."
        };
    }
}

// ===== OPTIMIZED HELPER FUNCTIONS =====
function calculateBMI() {
    const weight = parseFloat(domCache.get('weight')?.value);
    const height = parseFloat(domCache.get('height')?.value);
    
    if (!weight || !height || height <= 0 || weight <= 0) {
        return null;
    }
    
    const bmi = weight / Math.pow(height / 100, 2);
    return Math.round(bmi * 10) / 10;
}

function getFactorName(value) {
    const names = {
        // CRITICAL FACTORS
        'obesity': 'Obesity (BMI ≥30)',
        'apnea': 'Sleep Apnea',
        'diabetes': 'Diabetes/Metabolic Syndrome',
        'opioids': 'Opioid Medication Use',
        'steroids': 'Anabolic Steroid Use',
        'alcohol': 'High Alcohol Consumption',
        'smoking': 'Current Smoker',
        
        // NUTRITION
        'sugar-drinks': 'Daily Sugary Drinks',
        'processed-carbs': 'High Processed Carbohydrates',
        'low-protein': 'Insufficient Protein Intake',
        'low-fat': 'Very Low Fat Diet',
        'soy-heavy': 'High Soy/Phytoestrogen Foods',
        'intermittent-fasting': 'Regular Intermittent Fasting',
        
        // EXERCISE
        'overtraining': 'Overtraining/Chronic Fatigue',
        'sedentary-job': 'Sedentary Job (>6h sitting)',
        'no-steps': 'Low Daily Steps (<5,000)',
        'consistent-training': 'Consistent Strength Training',
        'active-lifestyle': 'Active Lifestyle',
        
        // STRESS
        'chronic-stress': 'Chronic Work/Financial Stress',
        'poor-sleep-mental': 'Anxiety Affecting Sleep',
        'relationship-stress': 'Significant Relationship Stress',
        'meditation': 'Regular Meditation/Mindfulness',
        'good-coping': 'Healthy Stress Management',
        
        // ENVIRONMENT
        'bpa-plastics': 'Regular Plastic Container Use (BPA)',
        'nonstick-cookware': 'Non-stick Cookware Regular Use',
        'conventional-produce': 'Mostly Conventional Produce',
        'water-filter': 'Regular Water Filter Use',
        'organic-foods': 'Mostly Organic Food Consumption'
    };
    return names[value] || value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getFactorDescription(value) {
    const descriptions = {
        'obesity': 'Adipose tissue converts testosterone to estrogen',
        'apnea': 'Sleep disruption severely impacts hormone production',
        'alcohol': 'Liver metabolism prioritizes alcohol over hormones',
        'diabetes': 'Insulin resistance disrupts hormonal balance',
        'opioids': 'Direct suppression of hypothalamic-pituitary axis',
        'intermittent-fasting': 'Can improve insulin sensitivity and hormone function',
        'consistent-training': 'Strength training boosts natural testosterone production',
        'meditation': 'Reduces cortisol and improves hormonal balance',
        'sedentary-job': 'Prolonged sitting increases inflammation and reduces testosterone',
        'chronic-stress': 'Elevated cortisol directly suppresses testosterone production',
        'smoking': 'Nicotine and toxins impair testicular function',
        'steroids': 'Exogenous hormones suppress natural production'
    };
    return descriptions[value] || 'Affects hormonal balance and testosterone production';
}

function getImpactCategory(impact) {
    const absImpact = Math.abs(impact);
    if (absImpact >= 10) return 'critical';
    if (absImpact >= 5) return 'medium';
    return 'light';
}

// ===== OPTIMIZED FACTOR PROCESSOR =====
const factorProcessor = {
    processCheckboxSection(sectionName, breakdown) {
        let sectionTotal = 0;
        const checkboxes = document.querySelectorAll(`input[name="${sectionName}"]:checked`);
        
        checkboxes.forEach(checkbox => {
            if (checkbox.value === 'none') return;
            
            // Prevent duplicate processing of obesity
            if (checkbox.value === 'obesity' && obesityProcessed) {
                return;
            }
            if (checkbox.value === 'obesity') {
                obesityProcessed = true;
            }
            
            const impact = riskWeights[checkbox.value];
            if (impact !== undefined) {
                sectionTotal += impact;
                breakdown.push({
                    category: getImpactCategory(impact),
                    name: getFactorName(checkbox.value),
                    impact: impact,
                    description: getFactorDescription(checkbox.value)
                });
            }
        });
        
        return sectionTotal;
    },
    
    processSelectFactor(selectId, breakdown, categoryName) {
        const select = domCache.get(selectId);
        if (!select || !select.value || select.value === '') return 0;
        
        if (riskWeights[selectId] && riskWeights[selectId][select.value] !== undefined) {
            const impact = riskWeights[selectId][select.value];
            const optionText = select.options[select.selectedIndex]?.text || select.value;
            breakdown.push({
                category: getImpactCategory(impact),
                name: `${categoryName}: ${optionText}`,
                impact: impact,
                description: getFactorDescription(selectId)
            });
            return impact;
        }
        return 0;
    }
};

// ===== UNIFIED VALIDATION FUNCTIONS =====
function validateForm(showAlerts = true) {
    const validators = [
        { 
            id: 'age', 
            test: v => !isNaN(v) && v >= 18 && v <= 80, 
            msg: "Please enter a valid age between 18 and 80 years.",
            required: true
        },
        { 
            id: 'weight', 
            test: v => !isNaN(v) && v >= 40 && v <= 200, 
            msg: "Please enter a valid weight (40-200 kg).",
            required: true
        },
        { 
            id: 'height', 
            test: v => !isNaN(v) && v >= 140 && v <= 220, 
            msg: "Please enter a valid height (140-220 cm).",
            required: true
        },
        { 
            id: 'sleep', 
            test: v => v && ['4','5','6','7','8','9'].includes(v),
            msg: "Please select your average sleep hours.",
            required: true
        }
    ];

    for (const {id, test, msg, required} of validators) {
        const element = domCache.get(id);
        if (!element) continue;
        
        const value = element.type === 'select-one' ? element.value : parseFloat(element.value);
        
        // If the field is empty and required
        if (required && (element.value === '' || element.value === null || element.value === undefined)) {
            if (showAlerts && !isInitializing) {
                showFieldError(msg, id, true);
            }
            return false;
        }
        
        // Validate the value
        if (element.value !== '' && !test(value)) {
            if (showAlerts && !isInitializing) {
                showFieldError(msg, id, true);
            }
            return false;
        }
    }
    
    // Validate BMI
    const bmi = calculateBMI();
    if (bmi === null) {
        if (showAlerts && !isInitializing) {
            showFieldError("Please enter valid weight and height to calculate BMI.", 'weight', true);
        }
        return false;
    }
    
    if (bmi < 15 || bmi > 50) {
        if (showAlerts && !isInitializing) {
            showFieldError("BMI outside valid range. Please check your weight and height.", 'weight', true);
        }
        return false;
    }
    
    return true;
}

function showFieldError(message, fieldId, showAlert = true) {
    if (showAlert && !isInitializing) {
        alert(`🚫 ${message}`);
    }
    const field = domCache.get(fieldId);
    if (field) {
        field.focus();
        field.style.borderColor = '#f44336';
        setTimeout(() => {
            if (field.style.borderColor === '#f44336') {
                field.style.borderColor = '';
            }
        }, 2000);
    }
}

// ===== NAVIGATION AND UI FUNCTIONS =====
function isSectionComplete(sectionIndex) {
    if (sectionIndex === 0) {
        // Only check that fields are not empty for progress
        const age = domCache.get('age')?.value || '';
        const weight = domCache.get('weight')?.value || '';
        const height = domCache.get('height')?.value || '';
        const sleep = domCache.get('sleep')?.value || '';
        
        return age !== '' && weight !== '' && height !== '' && sleep !== '';
    } else if (sectionIndex >= 1 && sectionIndex <= 5) {
        const section = sections[sectionIndex];
        if (!section) return false;
        
        const inputs = section.querySelectorAll('input[type="checkbox"]');
        return Array.from(inputs).some(input => input.checked);
    } else if (sectionIndex === 6) {
        return true; // Symptoms optional
    }
    return false;
}

// ===== OPTIMIZED ANIMATIONS =====
function animateCounter(element, target, duration = 1500) {
    if (!element) return;
    
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother animation
        const easeOut = progress * (2 - progress);
        const value = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = `${value} pts`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    
    requestAnimationFrame(update);
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    const form = domCache.get('assessment-form');
    sections = [
        domCache.get('section-1'),
        domCache.get('section-2'), 
        domCache.get('section-3'),
        domCache.get('section-4'),
        domCache.get('section-5'),
        domCache.get('section-6'),
        domCache.get('section-7')
    ].filter(Boolean);
    
    if (sections.length === 0) {
        console.error('No sections found');
        return;
    }

    const submitBtn = domCache.get('submit-btn');
    const resultSection = domCache.get('result-section');
    const analyzingDiv = domCache.get('analyzing');
    const resultsContent = domCache.get('results-content');
    const progressFill = domCache.get('progress-fill');
    const progressPercent = domCache.get('progress-percent');

    // Initialize application
    initializeApp();

    function initializeApp() {
        isInitializing = true;
        
        if (form) {
            form.setAttribute('novalidate', 'true');
        }
        
        showSection(0);
        setupRealTimeValidation();
        setupNavigationButtons();
        initializeQuickNav();
        setupNoneOptions();
        setupEventListeners();
        updateNavigationButtons();
        
        // Disable initialization flag after a short delay
        setTimeout(() => {
            isInitializing = false;
        }, 100);
    }

    function setupRealTimeValidation() {
        const inputs = ['age', 'weight', 'height'];
        
        inputs.forEach(id => {
            const input = domCache.get(id);
            if (input) {
                input.addEventListener('input', () => {
                    const value = parseFloat(input.value);
                    const min = id === 'age' ? 18 : id === 'weight' ? 40 : 140;
                    const max = id === 'age' ? 80 : id === 'weight' ? 200 : 220;
                    
                    if (input.value === '') {
                        input.style.borderColor = '';
                    } else if (!isNaN(value) && value >= min && value <= max) {
                        input.style.borderColor = '#4CAF50';
                    } else {
                        input.style.borderColor = '#f44336';
                    }
                    
                    updateProgress();
                    updateSubmitButton();
                    updateNavigationButtons();
                });
            }
        });
        
        // For sleep select
        const sleepSelect = domCache.get('sleep');
        if (sleepSelect) {
            sleepSelect.addEventListener('change', () => {
                updateProgress();
                updateSubmitButton();
                updateNavigationButtons();
            });
        }
    }

    function setupNavigationButtons() {
        // Set up specific navigation buttons for first section
        const firstSectionPrev = document.querySelector('#section-1 .nav-button:not(.primary)');
        const firstSectionNext = document.querySelector('#section-1 .nav-button.primary');
        
        if (firstSectionPrev) {
            firstSectionPrev.addEventListener('click', goToPreviousSection);
        }
        if (firstSectionNext) {
            firstSectionNext.addEventListener('click', goToNextSection);
        }
        
        // Use event delegation for other buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-button:not(.primary):not([data-section="0"] *)')) {
                goToPreviousSection();
            }
            if (e.target.matches('.nav-button.primary:not([data-section="0"] *)')) {
                goToNextSection();
            }
        });
    }

    function setupEventListeners() {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!validateForm(true)) return;
                
                showAnalyzing();
                setTimeout(calculateScientificResults, 1500);
            });
        }

        // Set up redirect to Payhip button
        const downloadBtn = domCache.get('download-btn');
        if (downloadBtn) {
            // Change button text if desired
            downloadBtn.textContent = 'Get Full Personalized Guide';
            downloadBtn.addEventListener('click', redirectToPayhip);
        }
    }

    // ===== MODIFIED: REDIRECT TO PAYHIP INSTEAD OF DOWNLOAD =====
    function redirectToPayhip() {
        // Get results data to potentially pass as parameters
        const resultScore = domCache.get('result-score')?.textContent || '0';
        const riskLevel = domCache.get('risk-level')?.textContent || 'Not available';
        
        // Optional: Pass data as URL parameters for personalization
        const params = new URLSearchParams({
            score: resultScore,
            risk: riskLevel.toLowerCase().replace(/\s+/g, '-'),
            source: 'testosterone-assessment',
            date: new Date().toISOString().split('T')[0]
        });
        
        const payhipUrl = `${PAYHIP_URL}?${params.toString()}`;
        
        // Open Payhip in new tab
        window.open(payhipUrl, '_blank', 'noopener,noreferrer');
        
        // Optional: Show confirmation message
        showPayhipRedirectMessage(resultScore, riskLevel);
    }
    
    function showPayhipRedirectMessage(score, riskLevel) {
        // Create a modal or notification
        const message = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 350px;
                animation: slideIn 0.5s ease-out;
            ">
                <h4 style="margin: 0 0 10px 0; font-size: 18px;">🎯 Personalized Guide Available</h4>
                <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">
                    Based on your risk score of <strong>${score}</strong> and <strong>${riskLevel}</strong> level,
                    we've prepared a comprehensive guide to help you optimize your testosterone.
                </p>
                <p style="margin: 0; font-size: 12px; opacity: 0.8;">
                    Opening Payhip in new tab...
                </p>
            </div>
        `;
        
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = message;
        document.body.appendChild(messageDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }

    function goToPreviousSection() {
        if (currentSection > 0) {
            showSection(currentSection - 1);
        }
    }

    function goToNextSection() {
        if (!isSectionComplete(currentSection)) {
            if (!isInitializing) {
                alert("Please complete all required fields in this section before continuing.");
            }
            return;
        }
        
        if (currentSection < sections.length - 1) {
            showSection(currentSection + 1);
        } else if (currentSection === sections.length - 1 && submitBtn) {
            submitBtn.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function updateNavigationButtons() {
        const prevButtons = document.querySelectorAll('.nav-button:not(.primary)');
        const nextButtons = document.querySelectorAll('.nav-button.primary');
        
        prevButtons.forEach(button => {
            button.style.display = currentSection > 0 ? 'block' : 'none';
        });
        
        nextButtons.forEach(button => {
            const isComplete = isSectionComplete(currentSection);
            button.disabled = !isComplete;
            
            if (currentSection === sections.length - 2) {
                button.textContent = 'Final Section →';
            } else if (currentSection === sections.length - 1) {
                button.textContent = 'Complete Assessment';
            } else {
                button.textContent = 'Next Section →';
            }
        });
    }

    function initializeQuickNav() {
        const quickNav = domCache.get('quick-nav');
        if (!quickNav) return;
        
        quickNav.innerHTML = '';
        sections.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            dot.dataset.section = index;
            dot.addEventListener('click', () => {
                if (isSectionComplete(index - 1) || index === 0) {
                    showSection(index);
                } else if (!isInitializing) {
                    alert("Please complete the previous section first.");
                }
            });
            quickNav.appendChild(dot);
        });
        updateQuickNav();
    }

    function setupNoneOptions() {
        document.querySelectorAll('.none-option-checkbox').forEach(noneOption => {
            noneOption.addEventListener('change', function() {
                if (this.checked) {
                    const section = this.closest('.content-section');
                    if (section) {
                        section.querySelectorAll('input[type="checkbox"]:not(.none-option-checkbox)').forEach(checkbox => {
                            checkbox.checked = false;
                        });
                        
                        updateProgress();
                        updateSubmitButton();
                        updateNavigationButtons();
                        
                        if (currentSection < sections.length - 1) {
                            setTimeout(() => {
                                const nextButton = section.querySelector('.nav-button.primary');
                                if (nextButton && !nextButton.disabled) {
                                    nextButton.focus();
                                }
                            }, 100);
                        }
                    }
                }
            });
        });

        document.querySelectorAll('input[type="checkbox"]:not(.none-option-checkbox)').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const section = this.closest('.content-section');
                if (section) {
                    const noneOption = section.querySelector('.none-option-checkbox');
                    if (noneOption && noneOption.checked) {
                        noneOption.checked = false;
                    }
                    updateProgress();
                    updateSubmitButton();
                    updateNavigationButtons();
                }
            });
        });
    }

    function showSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        sections.forEach(section => {
            if (section) {
                section.style.display = 'none';
            }
        });
        
        const targetSection = sections[index];
        if (targetSection) {
            targetSection.style.display = 'block';
            currentSection = index;
            
            // Transition effect
            targetSection.classList.remove('fade-in');
            void targetSection.offsetWidth;
            targetSection.classList.add('fade-in');
            
            updateProgress();
            updateSubmitButton();
            updateQuickNav();
            updateNavigationButtons();
            
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updateProgress() {
        let completedSections = 0;
        
        for (let i = 0; i < sections.length; i++) {
            if (isSectionComplete(i)) completedSections++;
        }
        
        const progress = (completedSections / sections.length) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (progressPercent) {
            progressPercent.textContent = `${Math.round(progress)}%`;
        }
    }

    function updateSubmitButton() {
        const allComplete = sections.every((_, i) => isSectionComplete(i));
        if (submitBtn) {
            submitBtn.style.display = allComplete ? 'block' : 'none';
            submitBtn.disabled = !allComplete;
        }
    }

    function updateQuickNav() {
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            if (dot) {
                dot.classList.toggle('active', index === currentSection);
                dot.classList.toggle('completed', index < currentSection && isSectionComplete(index));
            }
        });
    }

    function showAnalyzing() {
        if (resultSection) {
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (analyzingDiv) analyzingDiv.style.display = 'block';
        if (resultsContent) resultsContent.style.display = 'none';
    }

    // ===== OPTIMIZED MAIN RESULTS CALCULATION =====
    function calculateScientificResults() {
        // Reset obesity processed flag
        obesityProcessed = false;
        domCache.clear(); // Clear cache for fresh calculations
        
        if (!validateForm(true)) {
            return;
        }
        
        let totalRisk = 0;
        const breakdown = [];
        const bmi = calculateBMI();

        if (bmi === null) {
            showFieldError("Error calculating BMI. Please check weight and height.", 'weight', true);
            return;
        }

        // AGE
        const age = parseInt(domCache.get('age').value);
        let ageImpact = 0;
        if (age >= 50) ageImpact = riskWeights.age['50+'];
        else if (age >= 40) ageImpact = riskWeights.age['40-49'];
        else if (age >= 30) ageImpact = riskWeights.age['30-39'];
        
        if (ageImpact !== 0) {
            totalRisk += ageImpact;
            breakdown.push({
                category: getImpactCategory(ageImpact),
                name: `Age (${age} years)`,
                impact: ageImpact,
                description: 'Natural age-related decline in testosterone production'
            });
        }

        // SLEEP
        const sleep = domCache.get('sleep').value;
        const sleepImpact = riskWeights.sleep[sleep] || 0;
        if (sleepImpact !== 0) {
            totalRisk += sleepImpact;
            breakdown.push({
                category: getImpactCategory(sleepImpact),
                name: `Sleep Duration (${sleep} hours/night)`,
                impact: sleepImpact,
                description: 'Sleep duration impact on testosterone production'
            });
        }

        // SLEEP QUALITY
        const sleepQuality = domCache.get('sleep-quality').value;
        if (sleepQuality && riskWeights['sleep-quality'][sleepQuality] !== undefined) {
            const sleepQualityImpact = riskWeights['sleep-quality'][sleepQuality];
            totalRisk += sleepQualityImpact;
            breakdown.push({
                category: getImpactCategory(sleepQualityImpact),
                name: `Sleep Quality: ${domCache.get('sleep-quality').selectedOptions[0].text}`,
                impact: sleepQualityImpact,
                description: 'Sleep quality affects hormone restoration during sleep'
            });
        }

        // BMI
        if (bmi >= 30) {
            totalRisk += riskWeights.obesity;
            obesityProcessed = true;
            breakdown.push({
                category: 'critical',
                name: 'Obesity (BMI ≥30)',
                impact: riskWeights.obesity,
                description: 'Adipose tissue aromatizes testosterone to estrogen'
            });
        } else if (bmi >= 25) {
            totalRisk += OVERWEIGHT_IMPACT;
            breakdown.push({
                category: 'medium',
                name: 'Overweight (BMI 25-29.9)',
                impact: OVERWEIGHT_IMPACT,
                description: 'Excess body fat reduces free testosterone availability'
            });
        }

        // PROCESS SECTIONS
        totalRisk += factorProcessor.processCheckboxSection('nutrition', breakdown);
        totalRisk += factorProcessor.processCheckboxSection('exercise', breakdown);
        totalRisk += factorProcessor.processCheckboxSection('stress', breakdown);
        totalRisk += factorProcessor.processCheckboxSection('environment', breakdown);
        totalRisk += factorProcessor.processCheckboxSection('medical', breakdown);

        // PROCESS SELECTS
        totalRisk += factorProcessor.processSelectFactor('diet-type', breakdown, 'Diet Type');
        totalRisk += factorProcessor.processSelectFactor('vegetable-intake', breakdown, 'Vegetable Intake');
        totalRisk += factorProcessor.processSelectFactor('strength-frequency', breakdown, 'Strength Training');
        totalRisk += factorProcessor.processSelectFactor('cardio-frequency', breakdown, 'Cardio Exercise');
        totalRisk += factorProcessor.processSelectFactor('stress-level', breakdown, 'Stress Level');
        totalRisk += factorProcessor.processSelectFactor('social-support', breakdown, 'Social Support');
        totalRisk += factorProcessor.processSelectFactor('air-quality', breakdown, 'Air Quality');
        totalRisk += factorProcessor.processSelectFactor('family-history', breakdown, 'Family History');

        // SYMPTOMS
        const symptomCheckboxes = document.querySelectorAll('input[name="symptoms"]:checked');
        if (symptomCheckboxes.length > 0) {
            const symptomImpact = symptomCheckboxes.length * riskWeights.symptoms;
            totalRisk += symptomImpact;
            breakdown.push({
                category: 'symptoms',
                name: `${symptomCheckboxes.length} clinical symptoms reported`,
                impact: symptomImpact,
                description: 'Symptom burden indicating potential testosterone deficiency'
            });
        }

        const finalScore = Math.max(totalRisk, 0);
        const testosteroneLevel = estimateTestosterone(finalScore);

        displayScientificResults(finalScore, breakdown, bmi, testosteroneLevel);
    }

    function displayScientificResults(score, breakdown, bmi, testosteroneLevel) {
        if (analyzingDiv) analyzingDiv.style.display = 'none';
        if (resultsContent) {
            resultsContent.style.display = 'block';
            resultsContent.scrollIntoView({ behavior: 'smooth' });
        }

        const resultScoreElement = domCache.get('result-score');
        if (resultScoreElement) {
            animateCounter(resultScoreElement, score);
        }

        // Determine risk level
        let level, message, levelClass;
        if (score >= 70) {
            level = "CRITICAL HORMONAL RISK";
            levelClass = "risk-critical";
            message = "Your profile indicates severe testosterone disruption. Multiple high-impact factors are compromising hormonal function. Immediate medical intervention is recommended.";
        } else if (score >= 50) {
            level = "HIGH RISK PROFILE";
            levelClass = "risk-high";
            message = "Significant testosterone impairment detected. Critical lifestyle factors require immediate attention to prevent further decline. Consider consulting an endocrinologist.";
        } else if (score >= 30) {
            level = "MODERATE RISK";
            levelClass = "risk-medium";
            message = "Several factors are negatively impacting testosterone levels. Targeted lifestyle interventions can help restore optimal hormonal function.";
        } else if (score >= 15) {
            level = "LOW-MODERATE RISK";
            levelClass = "risk-low-medium";
            message = "Some risk factors present. Minor adjustments to lifestyle habits could help optimize testosterone levels.";
        } else {
            level = "LOW RISK";
            levelClass = "risk-low";
            message = "Minimal risk factors detected. Maintain current healthy habits and continue monitoring for changes.";
        }

        const riskLevelElement = domCache.get('risk-level');
        const resultMessageElement = domCache.get('result-message');
        
        if (riskLevelElement) {
            riskLevelElement.textContent = level;
            riskLevelElement.className = `risk-level ${levelClass}`;
        }
        
        if (resultMessageElement) {
            resultMessageElement.textContent = message;
        }

        const testosteroneInfo = getTestosteroneInterpretation(testosteroneLevel);
        displayTestosteroneEstimate(testosteroneLevel, testosteroneInfo);
        displayBreakdown(breakdown, bmi);
        
        // Add Payhip CTA after results
        addPayhipCTA(score, level);
    }

    function addPayhipCTA(score, riskLevel) {
        const existingCTA = document.querySelector('.payhip-cta');
        if (existingCTA) {
            existingCTA.remove();
        }
        
        
        
        const resultsContent = domCache.get('results-content');
        if (resultsContent) {
            resultsContent.insertAdjacentHTML('beforeend', ctaHTML);
            
            // Add event listener to the CTA button
            const ctaButton = document.getElementById('payhip-cta-button');
            if (ctaButton) {
                ctaButton.addEventListener('click', redirectToPayhip);
            }
        }
    }

    function displayTestosteroneEstimate(level, info) {
        const breakdownContainer = domCache.get('breakdown-container');
        if (!breakdownContainer) return;
        
        const existingEstimate = document.querySelector('.testosterone-estimate');
        if (existingEstimate) {
            existingEstimate.remove();
        }
        
        const widthPercentage = ((level - MIN_TESTOSTERONE) / (MAX_TESTOSTERONE - MIN_TESTOSTERONE)) * 100;
        const clampedWidth = Math.max(0, Math.min(100, widthPercentage));
        
        const testosteroneHTML = `
            <div class="testosterone-estimate">
                <div class="testosterone-header">
                    <h3>🧪 Estimated Testosterone Level</h3>
                    <div class="testosterone-level ${info.class}">${level} ng/dL</div>
                </div>
                <div class="testosterone-range">
                    <div class="range-bar">
                        <div class="range-fill" style="width: ${clampedWidth}%"></div>
                        <div class="range-labels">
                            <span>${MIN_TESTOSTERONE} (Critical)</span>
                            <span>350 (Low)</span>
                            <span>500 (Average)</span>
                            <span>700 (Optimal)</span>
                            <span>${MAX_TESTOSTERONE} (Excellent)</span>
                        </div>
                    </div>
                </div>
                <div class="testosterone-info">
                    <div class="testosterone-status ${info.class}">${info.level}</div>
                    <p class="testosterone-message">${info.message}</p>
                    <div class="testosterone-recommendation">
                        <strong>Recommendation:</strong> ${info.recommendation}
                    </div>
                </div>
            </div>
        `;
        
        breakdownContainer.insertAdjacentHTML('beforebegin', testosteroneHTML);
    }

    function displayBreakdown(breakdown, bmi) {
        const container = domCache.get('breakdown-container');
        if (!container) return;
        
        // Clear previous content
        container.innerHTML = '';
        
        if (breakdown.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                    <h3 style="margin-bottom: 10px;">🎯 Risk Factor Breakdown</h3>
                    <p>🎉 No significant risk factors detected. Your hormonal profile appears optimal.</p>
                </div>
            `;
            return;
        }

        // Add title
        const title = document.createElement('h3');
        title.textContent = '🎯 Risk Factor Breakdown';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        container.appendChild(title);

        // Group by category
        const categories = {
            critical: breakdown.filter(item => item.category === 'critical'),
            medium: breakdown.filter(item => item.category === 'medium'),
            light: breakdown.filter(item => item.category === 'light'),
            symptoms: breakdown.filter(item => item.category === 'symptoms')
        };

        // Display in order of importance
        if (categories.critical.length > 0) {
            container.appendChild(createCategoryElement('critical', categories.critical));
        }
        if (categories.medium.length > 0) {
            container.appendChild(createCategoryElement('medium', categories.medium));
        }
        if (categories.light.length > 0) {
            container.appendChild(createCategoryElement('light', categories.light));
        }
        if (categories.symptoms.length > 0) {
            container.appendChild(createCategoryElement('symptoms', categories.symptoms));
        }

        // BMI if available
        if (bmi) {
            const bmiEl = document.createElement('div');
            bmiEl.className = 'breakdown-category';
            bmiEl.innerHTML = `
                <div class="category-title">
                    <span>📊</span>
                    <span>Clinical Metrics</span>
                </div>
                <div class="category-items">
                    <div class="breakdown-item">
                        <span class="factor-name">Body Mass Index (BMI)</span>
                        <span class="factor-impact">${bmi.toFixed(1)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="factor-name">BMI Category</span>
                        <span class="factor-impact">${bmi >= 30 ? 'Obese' : bmi >= 25 ? 'Overweight' : 'Normal'}</span>
                    </div>
                </div>
            `;
            container.appendChild(bmiEl);
        }
    }

    function createCategoryElement(type, items) {
        const element = document.createElement('div');
        element.className = 'breakdown-category';
        
        const itemsHTML = items.map(item => `
            <div class="breakdown-item">
                <div class="factor-info">
                    <span class="factor-name">${item.name}</span>
                    <div class="factor-description">${item.description}</div>
                </div>
                <span class="factor-impact impact-${type}">
                    ${item.impact > 0 ? '+' : ''}${item.impact} pts
                </span>
            </div>
        `).join('');
        
        element.innerHTML = `
            <div class="category-title">
                <span>${CATEGORY_ICONS[type]}</span>
                <span>${CATEGORY_TITLES[type]}</span>
            </div>
            <div class="category-items">
                ${itemsHTML}
            </div>
        `;
        
        return element;
    }
});