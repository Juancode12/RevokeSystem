// ===== SISTEMA EXPANDIDO DE PESOS CIENTÍFICOS =====
const riskWeights = {
    // FACTORES CRÍTICOS
    obesity: 20,
    apnea: 18,
    diabetes: 15,
    opioids: 18,
    steroids: 15,
    alcohol: 12,
    smoking: 10,

    // NUTRICIÓN
    'sugar-drinks': 8,
    'processed-carbs': 6,
    'low-protein': 5,
    'low-fat': 4,
    'soy-heavy': 3,
    'intermittent-fasting': -2,

    // EJERCICIO
    'overtraining': 9,
    'sedentary-job': 7,
    'no-steps': 6,
    'consistent-training': -5,
    'active-lifestyle': -3,

    // ESTRÉS
    'chronic-stress': 8,
    'poor-sleep-mental': 7,
    'relationship-stress': 6,
    'meditation': -4,
    'good-coping': -3,

    // AMBIENTE
    'bpa-plastics': 8,
    'nonstick-cookware': 5,
    'conventional-produce': 4,
    'water-filter': -3,
    'organic-foods': -2,

    // SÍNTOMAS
    symptoms: 2,

    // EDAD
    age: {
        '25-29': 0,
        '30-39': 5,
        '40-49': 10,
        '50+': 15
    },

    // SUEÑO
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

    // DIETA
    'diet-type': {
        'western': 8,
        'mediterranean': -3,
        'low-carb': -2,
        'plant-based': 4,
        'balanced': 0,
        'other': 2
    },

    // VEGETALES
    'vegetable-intake': {
        '0': 6,
        '1': 3,
        '2': 0,
        '3': -2
    },

    // EJERCICIO SELECT
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

    // ESTRÉS SELECT
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

    // AMBIENTE SELECT
    'air-quality': {
        'excellent': -1,
        'good': 0,
        'fair': 3,
        'poor': 6,
        'very-poor': 9
    },

    // HISTORIAL FAMILIAR
    'family-history': {
        'none': 0,
        'diabetes': 4,
        'thyroid': 3,
        'low-testosterone': 6,
        'multiple': 8
    }
};

// ===== VARIABLES GLOBALES =====
let currentSection = 0;
let sections = [];

// ===== ESTIMADOR DE TESTOSTERONA =====
function estimateTestosterone(totalRisk, breakdown) {
    // Base de testosterona para hombre adulto sano
    let baseTestosterone = 700; // ng/dL (promedio para hombre joven saludable)
    
    // Factores de ajuste basados en el riesgo calculado
    let testosteroneLevel = baseTestosterone;
    
    // Ajuste por edad (ya considerado en el risk score)
    const age = parseInt(document.getElementById('age').value);
    if (age >= 50) {
        testosteroneLevel *= 0.7; // -30% para 50+
    } else if (age >= 40) {
        testosteroneLevel *= 0.8; // -20% para 40-49
    } else if (age >= 30) {
        testosteroneLevel *= 0.9; // -10% para 30-39
    }
    
    // Ajuste por IMC
    const bmi = calculateBMI();
    if (bmi >= 30) {
        testosteroneLevel *= 0.7; // Obesidad: -30%
    } else if (bmi >= 25) {
        testosteroneLevel *= 0.85; // Sobrepeso: -15%
    }
    
    // Ajuste por sueño
    const sleep = document.getElementById('sleep').value;
    if (sleep === '4') {
        testosteroneLevel *= 0.75; // <5h: -25%
    } else if (sleep === '5') {
        testosteroneLevel *= 0.85; // 5h: -15%
    } else if (sleep === '6') {
        testosteroneLevel *= 0.9; // 6h: -10%
    } else if (sleep === '7') {
        testosteroneLevel *= 0.95; // 7h: -5%
    }
    
    // Ajuste por calidad de sueño
    const sleepQuality = document.getElementById('sleep-quality').value;
    if (sleepQuality === 'very-poor') {
        testosteroneLevel *= 0.8;
    } else if (sleepQuality === 'poor') {
        testosteroneLevel *= 0.9;
    } else if (sleepQuality === 'excellent') {
        testosteroneLevel *= 1.05;
    }
    
    // Ajuste por estrés
    const stressLevel = document.getElementById('stress-level').value;
    if (stressLevel === 'very-high') {
        testosteroneLevel *= 0.75;
    } else if (stressLevel === 'high') {
        testosteroneLevel *= 0.85;
    } else if (stressLevel === 'moderate') {
        testosteroneLevel *= 0.95;
    } else if (stressLevel === 'very-low') {
        testosteroneLevel *= 1.05;
    }
    
    // Ajuste por ejercicio
    const strengthFreq = document.getElementById('strength-frequency').value;
    if (strengthFreq === '3') {
        testosteroneLevel *= 1.15; // 4+ veces: +15%
    } else if (strengthFreq === '2') {
        testosteroneLevel *= 1.05; // 2-3 veces: +5%
    } else if (strengthFreq === '0') {
        testosteroneLevel *= 0.85; // Nunca: -15%
    }
    
    // Ajuste por factores críticos
    if (breakdown.some(item => item.category === 'critical' && Math.abs(item.impact) >= 15)) {
        testosteroneLevel *= 0.7; // Factores críticos severos
    } else if (breakdown.some(item => item.category === 'critical')) {
        testosteroneLevel *= 0.8; // Factores críticos moderados
    }
    
    // Ajuste final basado en el risk score total
    const riskAdjustment = 1 - (totalRisk / 200); // Ajuste proporcional al riesgo
    testosteroneLevel *= riskAdjustment;
    
    // Limitar rango fisiológico realista (150-1200 ng/dL)
    testosteroneLevel = Math.max(150, Math.min(1200, testosteroneLevel));
    
    return Math.round(testosteroneLevel);
}

function getTestosteroneInterpretation(level) {
    if (level < 250) {
        return {
            level: "Critically low",
            class: "testosterone-critical",
            message: "Severely deficient levels. Consult an endocrinologist urgently.",
            recommendation: "Immediate medical evaluation and possible hormone replacement therapy."
        };
    } else if (level < 350) {
        return {
            level: "lOW",
            class: "testosterone-low",
            message: "Levels below optimal. Multiple factors are affecting your hormone production.",
            recommendation: "Aggressive approach to lifestyle: sleep, stress, exercise and nutrition."
        };
    } else if (level < 500) {
        return {
            level: "PROMEDIO BAJO",
            class: "testosterone-medium",
            message: "Dentro del rango normal pero subóptimo. Hay margen significativo de mejora.",
            recommendation: "Optimizar hábitos clave para alcanzar niveles óptimos."
        };
    } else if (level < 700) {
        return {
            level: "ÓPTIMO",
            class: "testosterone-good",
            message: "Niveles saludables y funcionales. Buen balance hormonal.",
            recommendation: "Mantener hábitos actuales y enfocarse en mejoras incrementales."
        };
    } else {
        return {
            level: "EXCELENTE",
            class: "testosterone-excellent",
            message: "Niveles excepcionales. Máximo potencial hormonal alcanzado.",
            recommendation: "Continúa con tu rutina actual - estás en el percentil superior."
        };
    }
}

// ===== FUNCIONES AUXILIARES MEJORADAS =====
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    if (weight && height && height > 0) {
        const bmi = weight / Math.pow(height/100, 2);
        return Math.round(bmi * 10) / 10; // Redondear a 1 decimal
    }
    return null;
}

function getFactorName(value) {
    const names = {
        // FACTORES CRÍTICOS
        'obesity': 'Obesity (BMI ≥30)',
        'apnea': 'Sleep Apnea',
        'diabetes': 'Diabetes/Metabolic Syndrome',
        'opioids': 'Opioid Medication Use',
        'steroids': 'Anabolic Steroid Use',
        'alcohol': 'High Alcohol Consumption',
        'smoking': 'Current Smoker',
        
        // NUTRICIÓN
        'sugar-drinks': 'Daily Sugary Drinks',
        'processed-carbs': 'High Processed Carbohydrates',
        'low-protein': 'Insufficient Protein Intake',
        'low-fat': 'Very Low Fat Diet',
        'soy-heavy': 'High Soy/Phytoestrogen Foods',
        'intermittent-fasting': 'Regular Intermittent Fasting',
        
        // EJERCICIO
        'overtraining': 'Overtraining/Chronic Fatigue',
        'sedentary-job': 'Sedentary Job (>6h sitting)',
        'no-steps': 'Low Daily Steps (<5,000)',
        'consistent-training': 'Consistent Strength Training',
        'active-lifestyle': 'Active Lifestyle',
        
        // ESTRÉS
        'chronic-stress': 'Chronic Work/Financial Stress',
        'poor-sleep-mental': 'Anxiety Affecting Sleep',
        'relationship-stress': 'Significant Relationship Stress',
        'meditation': 'Regular Meditation/Mindfulness',
        'good-coping': 'Healthy Stress Management',
        
        // AMBIENTE
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
        'chronic-stress': 'Elevated cortisol directly suppresses testosterone production'
    };
    return descriptions[value] || 'Contributes to hormonal balance impact';
}

function getImpactCategory(impact) {
    const absImpact = Math.abs(impact);
    if (absImpact >= 10) return 'critical';
    if (absImpact >= 5) return 'medium';
    return 'light';
}

function processCheckboxSection(sectionName, breakdown) {
    let sectionTotal = 0;
    
    document.querySelectorAll(`input[name="${sectionName}"]:checked`).forEach(checkbox => {
        if (checkbox.value !== 'none') {
            const impact = riskWeights[checkbox.value];
            if (impact) {
                sectionTotal += impact;
                breakdown.push({
                    category: getImpactCategory(impact),
                    name: getFactorName(checkbox.value),
                    impact: impact,
                    description: getFactorDescription(checkbox.value)
                });
            }
        }
    });
    
    return sectionTotal;
}

function processSelectFactor(selectId, breakdown, categoryName) {
    const select = document.getElementById(selectId);
    if (!select || !select.value) return 0;
    
    if (riskWeights[selectId] && riskWeights[selectId][select.value] !== undefined) {
        const impact = riskWeights[selectId][select.value];
        breakdown.push({
            category: getImpactCategory(impact),
            name: `${categoryName}: ${select.selectedOptions[0].text}`,
            impact: impact,
            description: getFactorDescription(selectId)
        });
        return impact;
    }
    return 0;
}

// ===== FUNCIONES DE VALIDACIÓN CORREGIDAS =====
function validateAllRequiredFields() {
    const age = parseInt(document.getElementById('age').value);
    if (!age || age < 18 || age > 80) {
        showFieldError("Please enter a valid age between 18 and 80.", 'age');
        return false;
    }
    
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    if (!weight || weight < 40 || weight > 200) {
        showFieldError("Please enter valid weight (40-200 kg).", 'weight');
        return false;
    }
    if (!height || height < 140 || height > 220) {
        showFieldError("Please enter valid height (140-220 cm).", 'height');
        return false;
    }
    
    const sleep = document.getElementById('sleep').value;
    if (!sleep) {
        showFieldError("Please select your average sleep hours.", 'sleep');
        return false;
    }
    
    return true;
}

function showFieldError(message, fieldId) {
    alert(`🚫 ${message}`);
    if (fieldId) {
        document.getElementById(fieldId).focus();
    }
}

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assessment-form');
    sections = [
        document.getElementById('section-1'),
        document.getElementById('section-2'), 
        document.getElementById('section-3'),
        document.getElementById('section-4'),
        document.getElementById('section-5'),
        document.getElementById('section-6'),
        document.getElementById('section-7')
    ];
    
    const submitBtn = document.getElementById('submit-btn');
    const resultSection = document.getElementById('result-section');
    const analyzingDiv = document.getElementById('analyzing');
    const resultsContent = document.getElementById('results-content');
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    
    let downloadHandler = null;

    // Inicializar aplicación
    initializeApp();

    function initializeApp() {
        // SOLUCIÓN: Deshabilitar validación HTML5 para evitar el error del campo "waist"
        form.setAttribute('novalidate', 'true');
        
        showSection(0);
        setupNavigationButtons();
        initializeQuickNav();
        setupNoneOptions();
        setupEventListeners();
        updateNavigationButtons();
    }

    // CONFIGURAR BOTONES DE NAVEGACIÓN CON EVENT LISTENERS
    function setupNavigationButtons() {
        // Configurar botones de la primera sección (que no tenían onclick)
        const firstSectionPrev = document.querySelector('#section-1 .nav-button:not(.primary)');
        const firstSectionNext = document.querySelector('#section-1 .nav-button.primary');
        
        if (firstSectionPrev) {
            firstSectionPrev.addEventListener('click', goToPreviousSection);
        }
        if (firstSectionNext) {
            firstSectionNext.addEventListener('click', goToNextSection);
        }
        
        // Configurar resto de botones
        document.querySelectorAll('.nav-button:not(.primary)').forEach(button => {
            if (!button.hasAttribute('data-listener-added')) {
                button.addEventListener('click', goToPreviousSection);
                button.setAttribute('data-listener-added', 'true');
            }
        });
        
        document.querySelectorAll('.nav-button.primary').forEach(button => {
            if (!button.hasAttribute('data-listener-added')) {
                button.addEventListener('click', goToNextSection);
                button.setAttribute('data-listener-added', 'true');
            }
        });
    }

    function setupEventListeners() {
        // Form submission - Ya no necesita novalidate aquí porque se hace en initializeApp
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateAllRequiredFields()) return;
            
            showAnalyzing();
            setTimeout(calculateScientificResults, 1500);
        });

        // Input events for auto-advance
        form.addEventListener('input', function() {
            updateProgress();
            updateSubmitButton();
            updateNavigationButtons();
        });

        // Single download handler
        downloadHandler = function() {
            const email = prompt("📧 Enter your email to receive your REVOKESYSTEM Protocol:");
            if (email && validateEmail(email)) {
                alert("✅ Your evidence-based protocol is being prepared. Check your email in 5 minutes.");
            } else if (email) {
                alert("Please enter a valid email address.");
            }
        };
        
        document.getElementById('download-btn').addEventListener('click', downloadHandler);
    }

    // FUNCIONES DE NAVEGACIÓN MEJORADAS
    function goToPreviousSection() {
        if (currentSection > 0) {
            showSection(currentSection - 1);
        }
    }

    function goToNextSection() {
        if (!isSectionComplete(currentSection)) {
            alert("Please complete all required fields in this section before continuing.");
            return;
        }
        
        if (currentSection < sections.length - 1) {
            showSection(currentSection + 1);
        } else if (currentSection === sections.length - 1) {
            document.getElementById('submit-btn').scrollIntoView({ behavior: 'smooth' });
        }
    }

    function updateNavigationButtons() {
        const prevButtons = document.querySelectorAll('.nav-button:not(.primary)');
        const nextButtons = document.querySelectorAll('.nav-button.primary');
        
        // Actualizar botones Previous
        prevButtons.forEach(button => {
            button.style.display = currentSection > 0 ? 'block' : 'none';
        });
        
        // Actualizar botones Next
        nextButtons.forEach(button => {
            const isComplete = isSectionComplete(currentSection);
            button.disabled = !isComplete;
            
            if (currentSection === sections.length - 2) {
                button.textContent = 'Final Section →';
            } else {
                button.textContent = 'Next Section →';
            }
        });
    }

    function initializeQuickNav() {
        const quickNav = document.getElementById('quick-nav');
        if (!quickNav) return;
        
        quickNav.innerHTML = '';
        sections.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            dot.dataset.section = index;
            dot.addEventListener('click', () => {
                if (isSectionComplete(index - 1) || index === 0) {
                    showSection(index);
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
                    section.querySelectorAll('input[type="checkbox"]:not(.none-option-checkbox)').forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    
                    // FORZAR actualización inmediata
                    updateProgress();
                    updateSubmitButton();
                    updateNavigationButtons();
                    
                    // Permitir continuar inmediatamente después de seleccionar "none"
                    if (currentSection < sections.length - 1) {
                        setTimeout(() => {
                            const nextButton = section.querySelector('.nav-button.primary');
                            if (nextButton && !nextButton.disabled) {
                                nextButton.focus();
                            }
                        }, 100);
                    }
                }
            });
        });

        document.querySelectorAll('input[type="checkbox"]:not(.none-option-checkbox)').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const section = this.closest('.content-section');
                const noneOption = section.querySelector('.none-option-checkbox');
                if (noneOption && noneOption.checked) {
                    noneOption.checked = false;
                }
                updateProgress();
                updateSubmitButton();
                updateNavigationButtons();
            });
        });
    }

    function showSection(index) {
        console.log('Mostrando sección:', index);
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        sections[index].style.display = 'block';
        currentSection = index;
        
        // Efecto de transición
        sections[index].classList.remove('fade-in');
        void sections[index].offsetWidth;
        sections[index].classList.add('fade-in');
        
        updateProgress();
        updateSubmitButton();
        updateQuickNav();
        updateNavigationButtons();
        
        // Scroll suave a la sección
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ===== FUNCIÓN isSectionComplete CORREGIDA =====
    function isSectionComplete(sectionIndex) {
        const section = sections[sectionIndex];
        
        if (sectionIndex === 0) {
            const age = parseInt(document.getElementById('age').value);
            const weight = document.getElementById('weight').value;
            const height = document.getElementById('height').value;
            const sleep = document.getElementById('sleep').value;
            
            return age >= 18 && age <= 80 && weight && height && sleep;
        } else if (sectionIndex >= 1 && sectionIndex <= 5) {
            const inputs = section.querySelectorAll('input[type="checkbox"]');
            let hasSelection = false;
            
            inputs.forEach(input => {
                if (input.checked) hasSelection = true;
            });
            
            return hasSelection;
        } else if (sectionIndex === 6) {
            return true; // Síntomas opcionales
        }
        return false;
    }

    function updateProgress() {
        let completedSections = 0;
        
        // Verificar TODAS las secciones
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
        }
    }

    function updateQuickNav() {
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSection);
            dot.classList.toggle('completed', index < currentSection && isSectionComplete(index));
        });
    }

    function validateAge() {
        const age = parseInt(document.getElementById('age').value);
        if (isNaN(age)) {
            showAgeError("Please enter a valid age.");
            return false;
        }
        
        if (age < 18) {
            showAgeError("This assessment is for adults 18 years and older only.");
            document.getElementById('age').value = '';
            return false;
        }
        
        if (age > 80) {
            showAgeError("For accurate assessment, please consult with a healthcare provider for age-specific evaluation.");
            return false;
        }
        
        return true;
    }

    function showAgeError(message) {
        alert(`🚫 ${message}`);
        document.getElementById('age').focus();
    }

    function showAnalyzing() {
        if (resultSection) resultSection.style.display = 'block';
        if (analyzingDiv) analyzingDiv.style.display = 'block';
        if (resultsContent) resultsContent.style.display = 'none';
        if (resultSection) resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // ===== CÁLCULO PRINCIPAL DE RESULTADOS CORREGIDO =====
    function calculateScientificResults() {
        if (!validateAllRequiredFields()) return;
        
        let totalRisk = 0;
        const breakdown = [];
        const bmi = calculateBMI();

        // EDAD
        const age = parseInt(document.getElementById('age').value);
        let ageImpact = 0;
        if (age >= 50) ageImpact = riskWeights.age['50+'];
        else if (age >= 40) ageImpact = riskWeights.age['40-49'];
        else if (age >= 30) ageImpact = riskWeights.age['30-39'];
        
        if (ageImpact > 0) {
            totalRisk += ageImpact;
            breakdown.push({
                category: 'critical',
                name: `Age (${age} years)`,
                impact: ageImpact,
                description: 'Natural age-related decline'
            });
        }

        // SUEÑO
        const sleep = document.getElementById('sleep').value;
        const sleepImpact = riskWeights.sleep[sleep] || 0;
        if (sleepImpact > 0) {
            totalRisk += sleepImpact;
            breakdown.push({
                category: sleepImpact >= 10 ? 'critical' : 'medium',
                name: `Sleep (${sleep}h/night)`,
                impact: sleepImpact,
                description: 'Sleep duration impact on testosterone production'
            });
        }

        // CALIDAD DE SUEÑO
        const sleepQuality = document.getElementById('sleep-quality').value;
        if (sleepQuality && riskWeights['sleep-quality'][sleepQuality]) {
            const sleepQualityImpact = riskWeights['sleep-quality'][sleepQuality];
            totalRisk += sleepQualityImpact;
            breakdown.push({
                category: Math.abs(sleepQualityImpact) >= 6 ? 'critical' : 'medium',
                name: `Sleep Quality: ${document.getElementById('sleep-quality').selectedOptions[0].text}`,
                impact: sleepQualityImpact,
                description: 'Sleep quality affects hormone restoration'
            });
        }

        // BMI
        if (bmi >= 30) {
            totalRisk += riskWeights.obesity;
            breakdown.push({
                category: 'critical',
                name: 'Obesity (BMI ≥30)',
                impact: riskWeights.obesity,
                description: 'Adipose tissue aromatizes testosterone to estrogen'
            });
        } else if (bmi >= 25) {
            totalRisk += 10;
            breakdown.push({
                category: 'medium',
                name: 'Overweight (BMI 25-29.9)',
                impact: 10,
                description: 'Excess body fat reduces free testosterone'
            });
        }

        // PROCESAR TODAS LAS SECCIONES CORREGIDO
        totalRisk += processCheckboxSection('nutrition', breakdown);
        totalRisk += processCheckboxSection('exercise', breakdown);
        totalRisk += processCheckboxSection('stress', breakdown);
        totalRisk += processCheckboxSection('environment', breakdown);
        totalRisk += processCheckboxSection('medical', breakdown);

        // PROCESAR SELECTS CORREGIDO
        totalRisk += processSelectFactor('diet-type', breakdown, 'Diet Type');
        totalRisk += processSelectFactor('vegetable-intake', breakdown, 'Vegetable Intake');
        totalRisk += processSelectFactor('strength-frequency', breakdown, 'Strength Training');
        totalRisk += processSelectFactor('cardio-frequency', breakdown, 'Cardio Exercise');
        totalRisk += processSelectFactor('stress-level', breakdown, 'Stress Level');
        totalRisk += processSelectFactor('social-support', breakdown, 'Social Support');
        totalRisk += processSelectFactor('air-quality', breakdown, 'Air Quality');
        totalRisk += processSelectFactor('family-history', breakdown, 'Family History');

        // SÍNTOMAS
        const symptomCheckboxes = document.querySelectorAll('input[name="symptoms"]:checked');
        const symptomImpact = symptomCheckboxes.length * riskWeights.symptoms;
        if (symptomImpact > 0) {
            totalRisk += symptomImpact;
            breakdown.push({
                category: 'symptoms',
                name: `${symptomCheckboxes.length} clinical symptoms`,
                impact: symptomImpact,
                description: 'Symptom burden indicating potential deficiency'
            });
        }

        // CALCULAR SCORE FINAL Y TESTOSTERONA
        const finalScore = Math.min(Math.max(totalRisk, 0), 100);
        const testosteroneLevel = estimateTestosterone(finalScore, breakdown);

        // LLAMAR A DISPLAY CON TODOS LOS PARÁMETROS
        displayScientificResults(finalScore, breakdown, bmi, testosteroneLevel);
    }

    function displayScientificResults(score, breakdown, bmi, testosteroneLevel) {
        if (analyzingDiv) analyzingDiv.style.display = 'none';
        if (resultsContent) resultsContent.style.display = 'block';

        animateValue(document.getElementById('result-score'), 0, score, 1500);

        // Determinar nivel de riesgo
        let level, message, levelClass;
        if (score >= 70) {
            level = "CRITICAL HORMONAL RISK";
            levelClass = "risk-critical";
            message = "Your profile indicates severe testosterone disruption. Multiple high-impact factors are compromising masculine function. Immediate intervention required.";
        } else if (score >= 50) {
            level = "HIGH RISK PROFILE";
            levelClass = "risk-high";
            message = "Significant testosterone impairment detected. Critical lifestyle factors require immediate attention to prevent further decline.";
        } else if (score >= 30) {
            level = "MODERATE RISK";
            levelClass = "risk-medium";
            message = "Several factors are negatively impacting testosterone levels. Targeted interventions can restore optimal function.";
        } else {
            level = "LOW RISK";
            levelClass = "risk-low";
            message = "Minimal risk factors detected. Maintain current healthy habits and monitor for changes.";
        }

        document.getElementById('risk-level').textContent = level;
        document.getElementById('risk-level').className = `risk-level ${levelClass}`;
        document.getElementById('result-message').textContent = message;

        // MOSTRAR ESTIMADO DE TESTOSTERONA
        const testosteroneInfo = getTestosteroneInterpretation(testosteroneLevel);
        displayTestosteroneEstimate(testosteroneLevel, testosteroneInfo);
        
        displayBreakdown(breakdown, bmi);
    }

    // FUNCIÓN PARA MOSTRAR EL ESTIMADO DE TESTOSTERONA
    function displayTestosteroneEstimate(level, info) {
        const breakdownContainer = document.getElementById('breakdown-container');
        
        const testosteroneHTML = `
            <div class="testosterone-estimate">
                <div class="testosterone-header">
                    <h3>🧪 Estimado de Niveles de Testosterona</h3>
                    <div class="testosterone-level ${info.class}">${level} ng/dL</div>
                </div>
                <div class="testosterone-range">
                    <div class="range-bar">
                        <div class="range-fill" style="width: ${((level - 150) / (1200 - 150)) * 100}%"></div>
                        <div class="range-labels">
                            <span>150 (Crítico)</span>
                            <span>350 (Bajo)</span>
                            <span>500 (Promedio)</span>
                            <span>700 (Óptimo)</span>
                            <span>1200 (Excelente)</span>
                        </div>
                    </div>
                </div>
                <div class="testosterone-info">
                    <div class="testosterone-status ${info.class}">${info.level}</div>
                    <p class="testosterone-message">${info.message}</p>
                    <div class="testosterone-recommendation">
                        <strong>Recomendación:</strong> ${info.recommendation}
                    </div>
                </div>
            </div>
        `;
        
        // Insertar antes del breakdown
        breakdownContainer.insertAdjacentHTML('beforebegin', testosteroneHTML);
    }

    function displayBreakdown(breakdown, bmi) {
        const container = document.getElementById('breakdown-container');
        if (!container) return;
        
        let html = '<h3 style="text-align: center; margin-bottom: 20px;">🎯 Risk Factor Breakdown</h3>';
        
        if (breakdown.length === 0) {
            html += `
                <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                    <p>🎉 No significant risk factors detected. Your hormonal profile appears optimal.</p>
                </div>
            `;
            container.innerHTML = html;
            return;
        }

        const categories = {
            critical: breakdown.filter(item => item.category === 'critical'),
            medium: breakdown.filter(item => item.category === 'medium'),
            light: breakdown.filter(item => item.category === 'light'),
            symptoms: breakdown.filter(item => item.category === 'symptoms')
        };

        // Factores Críticos
        if (categories.critical.length > 0) {
            const criticalEl = createCategoryElement('critical', 'Critical Factors (10-25% impact)', categories.critical);
            container.appendChild(criticalEl);
        }

        // Factores Medios
        if (categories.medium.length > 0) {
            const mediumEl = createCategoryElement('medium', 'Medium Factors (5-10% impact)', categories.medium);
            container.appendChild(mediumEl);
        }

        // Factores Ligeros
        if (categories.light.length > 0) {
            const lightEl = createCategoryElement('light', 'Light Factors (1-4% impact)', categories.light);
            container.appendChild(lightEl);
        }

        // Síntomas
        if (categories.symptoms.length > 0) {
            const symptomsEl = createCategoryElement('symptoms', 'Clinical Symptoms', categories.symptoms);
            container.appendChild(symptomsEl);
        }

        // BMI
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
                </div>
            `;
            container.appendChild(bmiEl);
        }
    }

    function createCategoryElement(type, title, items) {
        const element = document.createElement('div');
        element.className = 'breakdown-category';
        
        const icon = type === 'critical' ? '🔴' : type === 'medium' ? '🟡' : type === 'light' ? '🟢' : '📋';
        
        element.innerHTML = `
            <div class="category-title">
                <span>${icon}</span>
                <span>${title}</span>
            </div>
            <div class="category-items">
                ${items.map(item => `
                    <div class="breakdown-item">
                        <span class="factor-name">${item.name}</span>
                        <span class="factor-impact impact-${type}">${item.impact > 0 ? '-' : '+'}${Math.abs(item.impact)}%</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        return element;
    }

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + "%";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});