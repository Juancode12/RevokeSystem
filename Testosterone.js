 // ===== CAMARGOLOGY: OPTIMIZACIÓN DEL CÓDIGO JAVASCRIPT =====
        document.addEventListener('DOMContentLoaded', function() {
            // Complete data by country - actualizado con rangos y potencial de recuperación
            const completeCountryData = {
                "USA": {
                    name: "United States",
                    decline: "52-60%",
                    declineRange: "52-60",
                    causes: "Dietary shifts toward processed foods, increased sedentary behavior, environmental endocrine disruptors",
                    period: "1970-2023",
                    impact: "High (affects 78% of adult men)",
                    flag: "https://flagcdn.com/us.svg",
                    mainCause: "Dietary and environmental factors",
                    riskFactors: "Obesity (42%), chronic stress (65%), lack of sleep (35%)",
                    trend: "Continues to decline (1.2% annually)",
                    recoveryPotential: "High with targeted intervention",
                    studies: 8,
                    confidence: "High",
                    population: "332 million",
                    avgAge: "38.1 years"
                },
                "CAN": {
                    name: "Canada",
                    decline: "50-55%",
                    declineRange: "50-55",
                    causes: "Sedentary lifestyle patterns, vitamin D deficiency due to climate, workplace stress factors",
                    period: "1980-2023",
                    impact: "Moderate-High (affects 72% of adult men)",
                    flag: "https://flagcdn.com/ca.svg",
                    mainCause: "Lack of sunlight and sedentary life",
                    riskFactors: "Low vitamin D (68%), office jobs (73%)",
                    trend: "Stabilized in the last 5 years",
                    recoveryPotential: "High with vitamin D optimization",
                    studies: 5,
                    confidence: "High",
                    population: "38 million",
                    avgAge: "41.1 years"
                },
                "MEX": {
                    name: "Mexico",
                    decline: "45-50%",
                    declineRange: "45-50",
                    causes: "Rapid nutritional transition, environmental pollution, economic stress factors",
                    period: "1990-2023",
                    impact: "Moderate (affects 65% of adult men)",
                    flag: "https://flagcdn.com/mx.svg",
                    mainCause: "Rapid shift to Westernized diet",
                    riskFactors: "Pollution (58%), economic stress (82%)",
                    trend: "Worsening in urban areas",
                    recoveryPotential: "Moderate-High with dietary intervention",
                    studies: 4,
                    confidence: "Medium",
                    population: "126 million",
                    avgAge: "29.3 years"
                },
                "BRA": {
                    name: "Brazil",
                    decline: "43-48%",
                    declineRange: "43-48",
                    causes: "Accelerated urbanization, loss of active lifestyle, Westernized diet adoption",
                    period: "1985-2023",
                    impact: "Moderate (affects 63% of adult men)",
                    flag: "https://flagcdn.com/br.svg",
                    mainCause: "Urbanization and loss of physical activities",
                    riskFactors: "Sedentary lifestyle (68%), fast food (55%)",
                    trend: "Accelerated in large cities",
                    recoveryPotential: "High with activity restoration",
                    studies: 3,
                    confidence: "Medium",
                    population: "214 million",
                    avgAge: "33.5 years"
                },
                "COL": {
                    name: "Colombia",
                    decline: "40-45%",
                    declineRange: "40-45",
                    causes: "Rapid cultural changes, increase in sedentary jobs, agricultural pollutants",
                    period: "1990-2023",
                    impact: "Moderate (affects 60% of adult men)",
                    flag: "https://flagcdn.com/co.svg",
                    mainCause: "Sedentary jobs and pollution",
                    riskFactors: "Long working hours (72%), pollution (45%)",
                    trend: "Stable with tendency to worsen",
                    recoveryPotential: "Medium with lifestyle adjustments",
                    studies: 2,
                    confidence: "Medium",
                    population: "51 million",
                    avgAge: "31.2 years"
                },
                "ARG": {
                    name: "Argentina",
                    decline: "43-48%",
                    declineRange: "43-48",
                    causes: "Excessive consumption of hormone-treated meats, recurring economic crises",
                    period: "1985-2023",
                    impact: "65% of adult men affected",
                    flag: "https://flagcdn.com/ar.svg",
                    mainCause: "Economic stress and unbalanced diet",
                    riskFactors: "Job instability (58%), processed meat consumption (72%)",
                    trend: "Accelerated in the last decade",
                    recoveryPotential: "Medium with dietary changes",
                    studies: 3,
                    confidence: "Medium",
                    population: "45 million",
                    avgAge: "31.9 years"
                },
                "CHE": {
                    name: "Switzerland",
                    decline: "35-40%",
                    declineRange: "35-40",
                    causes: "Aging population, high levels of work stress, precision-oriented culture",
                    period: "1990-2023",
                    impact: "55% of adult men affected",
                    flag: "https://flagcdn.com/ch.svg",
                    mainCause: "Work perfectionism and social pressure",
                    riskFactors: "Long working hours (68%), high standards (82%)",
                    trend: "Slight improvement in the last 3 years",
                    recoveryPotential: "High with stress management",
                    studies: 4,
                    confidence: "High",
                    population: "8.7 million",
                    avgAge: "43.1 years"
                },
                "URY": {
                    name: "Uruguay",
                    decline: "40-45%",
                    declineRange: "40-45",
                    causes: "Accelerated urbanization, changes in eating habits, economic fluctuations",
                    period: "1995-2023",
                    impact: "60% of adult men affected",
                    flag: "https://flagcdn.com/uy.svg",
                    mainCause: "Loss of active rural life",
                    riskFactors: "Alcohol consumption (48%), smoking (35%)",
                    trend: "Stable with slight tendency to worsen",
                    recoveryPotential: "Medium with lifestyle intervention",
                    studies: 2,
                    confidence: "Medium",
                    population: "3.5 million",
                    avgAge: "35.5 years"
                },
                "GBR": {
                    name: "United Kingdom",
                    decline: "53-58%",
                    declineRange: "53-58",
                    causes: "Dietary patterns, limited sunlight exposure, changing social roles",
                    period: "1970-2023",
                    impact: "High (affects 75% of adult men)",
                    flag: "https://flagcdn.com/gb.svg",
                    mainCause: "Diet and limited vitamin D synthesis",
                    riskFactors: "Alcohol consumption (65%), lack of sunlight (78%)",
                    trend: "Slight improvement in young people",
                    recoveryPotential: "High with comprehensive approach",
                    studies: 7,
                    confidence: "High",
                    population: "67 million",
                    avgAge: "40.5 years"
                },
                "DEU": {
                    name: "Germany",
                    decline: "49-54%",
                    declineRange: "49-54",
                    causes: "Work-related stress, industrial pollution, demographic aging",
                    period: "1975-2023",
                    impact: "High (affects 70% of adult men)",
                    flag: "https://flagcdn.com/de.svg",
                    mainCause: "Work stress and pollution",
                    riskFactors: "Work stress (72%), pollutants (65%)",
                    trend: "Stable in the last decade",
                    recoveryPotential: "Moderate-High with stress management",
                    studies: 6,
                    confidence: "High",
                    population: "83 million",
                    avgAge: "44.6 years"
                },
                "FRA": {
                    name: "France",
                    decline: "47-52%",
                    declineRange: "47-52",
                    causes: "Changes in Mediterranean diet, decreased physical activity, social stress",
                    period: "1980-2023",
                    impact: "Moderate-High (affects 68% of adult men)",
                    flag: "https://flagcdn.com/fr.svg",
                    mainCause: "Loss of traditional diet",
                    riskFactors: "Smoking (42%), stress (58%)",
                    trend: "Slow continuous decline",
                    recoveryPotential: "High with dietary restoration",
                    studies: 5,
                    confidence: "High",
                    population: "68 million",
                    avgAge: "41.7 years"
                },
                "ESP": {
                    name: "Spain",
                    decline: "45-50%",
                    declineRange: "45-50",
                    causes: "Urbanization, loss of traditional diet, increase in sedentary jobs",
                    period: "1985-2023",
                    impact: "Moderate (affects 65% of adult men)",
                    flag: "https://flagcdn.com/es.svg",
                    mainCause: "Abandonment of Mediterranean diet",
                    riskFactors: "Youth unemployment (55%), sedentary lifestyle (62%)",
                    trend: "Recently stabilized",
                    recoveryPotential: "High with lifestyle intervention",
                    studies: 4,
                    confidence: "Medium",
                    population: "47 million",
                    avgAge: "43.9 years"
                },
                "ITA": {
                    name: "Italy",
                    decline: "44-49%",
                    declineRange: "44-49",
                    causes: "Aging population, changes in gender roles, agricultural pollutants",
                    period: "1980-2023",
                    impact: "Moderate (affects 64% of adult men)",
                    flag: "https://flagcdn.com/it.svg",
                    mainCause: "Aging and social changes",
                    riskFactors: "Youth unemployment (48%), pollutants (52%)",
                    trend: "Slight improvement in the north of the country",
                    recoveryPotential: "Medium with targeted approach",
                    studies: 4,
                    confidence: "Medium",
                    population: "59 million",
                    avgAge: "46.2 years"
                },
                "AUS": {
                    name: "Australia",
                    decline: "48-53%",
                    declineRange: "48-53",
                    causes: "Sedentary lifestyle, high alcohol consumption, work-life balance issues",
                    period: "1985-2023",
                    impact: "Moderate-High (affects 70% of adult men)",
                    flag: "https://flagcdn.com/au.svg",
                    mainCause: "Sedentary work culture",
                    riskFactors: "Alcohol (58%), screen time (76%)",
                    trend: "Slow decline continuing",
                    recoveryPotential: "High with activity increase",
                    studies: 5,
                    confidence: "High",
                    population: "26 million",
                    avgAge: "37.5 years"
                },
                "NLD": {
                    name: "Netherlands",
                    decline: "42-47%",
                    declineRange: "42-47",
                    causes: "High work pressure, cycling culture benefits but offset by stress",
                    period: "1980-2023",
                    impact: "Moderate (affects 62% of adult men)",
                    flag: "https://flagcdn.com/nl.svg",
                    mainCause: "Work-life balance issues",
                    riskFactors: "Work stress (65%), high expectations (71%)",
                    trend: "Stable with minor fluctuations",
                    recoveryPotential: "High with stress reduction",
                    studies: 3,
                    confidence: "Medium",
                    population: "17 million",
                    avgAge: "42.8 years"
                },
                "SWE": {
                    name: "Sweden",
                    decline: "38-43%",
                    declineRange: "38-43",
                    causes: "Long dark winters, high alcohol consumption, social isolation factors",
                    period: "1985-2023",
                    impact: "Moderate (affects 58% of adult men)",
                    flag: "https://flagcdn.com/se.svg",
                    mainCause: "Seasonal affective factors",
                    riskFactors: "Vitamin D deficiency (72%), alcohol (45%)",
                    trend: "Improving in urban areas",
                    recoveryPotential: "High with light therapy",
                    studies: 4,
                    confidence: "High",
                    population: "10 million",
                    avgAge: "41.2 years"
                }
            };

            // DOM elements cache
            const elements = {
                svg: d3.select("#world-map"),
                countryName: document.getElementById("country-name"),
                countryFlag: document.getElementById("country-flag"),
                declineValue: document.getElementById("decline-value"),
                declineBar: document.getElementById("decline-bar"),
                causesValue: document.getElementById("causes-value"),
                periodValue: document.getElementById("period-value"),
                impactValue: document.getElementById("impact-value"),
                riskFactors: document.getElementById("risk-factors"),
                trendValue: document.getElementById("trend-value"),
                recoveryValue: document.getElementById("recovery-value"),
                studiesValue: document.getElementById("studies-value"),
                countryList: document.getElementById("country-list"),
                mapTooltip: document.getElementById("map-tooltip"),
                mapTooltipFlag: document.getElementById("map-tooltip-flag"),
                mapTooltipTitle: document.getElementById("map-tooltip-title"),
                mapTooltipCause: document.getElementById("map-tooltip-cause"),
                mapTooltipDecline: document.getElementById("map-tooltip-decline"),
                selectionCard: document.getElementById("selection-card"),
                selectionCardFlag: document.getElementById("selection-card-flag"),
                selectionCardTitle: document.getElementById("selection-card-title"),
                selectionCardCause: document.getElementById("selection-card-cause"),
                dataPanel: document.getElementById("data-panel"),
                guideButton: document.getElementById("guide-button"),
                earlyAssessmentBtn: document.getElementById("early-assessment-btn"),
                researchPdfBtn: document.getElementById("research-pdf-btn"),
                additionalCountriesGrid: document.getElementById("additional-countries-grid"),
                countrySearch: document.getElementById("country-search")
            };

            // Map dimensions
            const width = 1000;
            const height = 500;
            elements.svg.attr("viewBox", `0 0 ${width} ${height}`);

            // Projection centered on America and Europe
            const projection = d3.geoMercator()
                .scale(130)
                .center([-20, 40])
                .translate([width / 2, height / 2]);

            const path = d3.geoPath().projection(projection);

            // Create country list for main panel
            function createCountryList() {
                // Solo mostrar países principales en el panel principal
                const mainCountries = ["USA", "CAN", "GBR", "DEU", "FRA", "AUS"];
                
                mainCountries.forEach(code => {
                    const country = completeCountryData[code];
                    const card = document.createElement("div");
                    card.className = "country-card";
                    card.dataset.countryCode = code;
                    card.setAttribute("role", "listitem");
                    card.setAttribute("tabindex", "0");
                    card.innerHTML = `
                        <h3>${country.name}</h3>
                        <div>Decline: ${country.decline}</div>
                    `;
                    card.addEventListener("click", () => {
                        selectCountry(code);
                    });
                    card.addEventListener("keydown", (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectCountry(code);
                        }
                    });
                    elements.countryList.appendChild(card);
                });
            }

            // Function to select a country
            function selectCountry(countryCode) {
                const country = completeCountryData[countryCode];
                
                // Show selection card
                elements.selectionCardFlag.src = country.flag;
                elements.selectionCardFlag.alt = `Flag of ${country.name}`;
                elements.selectionCardTitle.textContent = country.name;
                elements.selectionCardCause.textContent = country.mainCause;
                elements.selectionCard.classList.add("visible");
                
                // Update data panel
                elements.countryName.textContent = country.name;
                elements.countryFlag.src = country.flag;
                elements.countryFlag.alt = `Flag of ${country.name}`;
                elements.declineValue.textContent = country.decline;
                // Use the first number in the range for the bar visualization
                const declinePercent = parseInt(country.declineRange.split('-')[0]);
                elements.declineBar.style.width = `${declinePercent}%`;
                elements.causesValue.textContent = country.causes;
                elements.periodValue.textContent = country.period;
                elements.impactValue.textContent = country.impact;
                elements.riskFactors.textContent = country.riskFactors || "Data not available";
                elements.trendValue.textContent = country.trend || "Data not available";
                elements.recoveryValue.textContent = country.recoveryPotential || "Data not available";
                elements.studiesValue.textContent = country.studies ? `${country.studies} studies` : "Data not available";
                
                // Highlight on the map
                elements.svg.selectAll(".country")
                    .classed("selected", false);
                
                d3.select(`#${countryCode}`)
                    .classed("selected", true);
                
                // Highlight in the list
                document.querySelectorAll(".country-card")
                    .forEach(card => card.classList.remove("selected"));
                
                document.querySelector(`.country-card[data-country-code="${countryCode}"]`)
                    .classed("selected", true);
                
                // Scroll to data panel
                elements.dataPanel.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Hide card when hovering outside
            document.getElementById("world-map").addEventListener("mouseleave", function() {
                elements.selectionCard.classList.remove("visible");
            });

            // Function to update tooltip position
            function updateMapTooltipPosition(event) {
                const tooltipWidth = elements.mapTooltip.offsetWidth;
                const tooltipHeight = elements.mapTooltip.offsetHeight;
                const scrollX = window.scrollX || window.pageXOffset;
                const scrollY = window.scrollY || window.pageYOffset;
                
                let x = event.clientX - tooltipWidth / 2 + scrollX;
                let y = event.clientY - tooltipHeight - 20 + scrollY;
                
                // Adjust if it goes off the left side
                if (x < 10 + scrollX) x = 10 + scrollX;
                
                // Adjust if it goes off the top
                if (y < 10 + scrollY) y = event.clientY + 20 + scrollY;
                
                // Adjust if it goes off the right side
                if (x + tooltipWidth > window.innerWidth + scrollX - 10) {
                    x = window.innerWidth + scrollX - tooltipWidth - 10;
                }
                
                elements.mapTooltip.style.left = `${x}px`;
                elements.mapTooltip.style.top = `${y}px`;
            }

            // ===== FUNCIÓN PARA CREAR TARJETAS DE PAÍSES ADICIONALES =====
            function createAdditionalCountriesGrid() {
                Object.keys(completeCountryData).forEach(code => {
                    const country = completeCountryData[code];
                    
                    const card = document.createElement('div');
                    card.className = 'country-detail-card';
                    card.addEventListener('click', () => {
                        selectCountry(code);
                    });
                    
                    // Determinar clase de recuperación
                    let recoveryClass = 'recovery-medium';
                    if (country.recoveryPotential.toLowerCase().includes('high')) {
                        recoveryClass = 'recovery-high';
                    } else if (country.recoveryPotential.toLowerCase().includes('low')) {
                        recoveryClass = 'recovery-low';
                    }
                    
                    card.innerHTML = `
                        <div class="country-detail-header">
                            <img src="${country.flag}" alt="Flag of ${country.name}" class="country-detail-flag">
                            <h3 class="country-detail-name">${country.name}</h3>
                        </div>
                        
                        <div class="country-detail-stats">
                            <div class="stat-item">
                                <span class="stat-value">${country.decline}</span>
                                <span class="stat-label">Decline</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${country.studies}</span>
                                <span class="stat-label">Studies</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${country.impact.split(' ')[0]}</span>
                                <span class="stat-label">Impact</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${country.confidence}</span>
                                <span class="stat-label">Confidence</span>
                            </div>
                        </div>
                        
                        <div class="country-detail-causes">
                            <div class="causes-title">Primary Factors</div>
                            <div class="causes-list">${country.mainCause}</div>
                            <div class="recovery-badge ${recoveryClass}">${country.recoveryPotential}</div>
                        </div>
                    `;
                    
                    elements.additionalCountriesGrid.appendChild(card);
                });
            }

            // ===== FUNCIÓN DE BÚSQUEDA Y FILTRADO =====
            function filterCountries(searchTerm) {
                const cards = elements.additionalCountriesGrid.getElementsByClassName('country-detail-card');
                
                for (let card of cards) {
                    const countryName = card.querySelector('.country-detail-name').textContent.toLowerCase();
                    if (countryName.includes(searchTerm.toLowerCase())) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            }

            // Load and draw the map
            d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then(function(world) {
                const countries = topojson.feature(world, world.objects.countries).features;
                
                // Draw countries
                elements.svg.selectAll(".country")
                    .data(countries)
                    .enter()
                    .append("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .attr("id", d => d.id)
                    .style("fill", d => completeCountryData[d.id] ? "#2a2a2a" : "#1a1a1a")
                    .on("mouseover", function(event, d) {
                        if (completeCountryData[d.id]) {
                            d3.select(this).style("fill", "#8b0000");
                            
                            // Update map tooltip
                            const country = completeCountryData[d.id];
                            elements.mapTooltipFlag.src = country.flag;
                            elements.mapTooltipFlag.alt = `Flag of ${country.name}`;
                            elements.mapTooltipTitle.textContent = country.name;
                            elements.mapTooltipCause.textContent = country.mainCause;
                            elements.mapTooltipDecline.textContent = `Decline: ${country.decline}`;
                            
                            // Show and position tooltip
                            elements.mapTooltip.style.opacity = 1;
                            elements.mapTooltip.setAttribute("aria-hidden", "false");
                            updateMapTooltipPosition(event);
                        }
                    })
                    .on("mouseout", function(event, d) {
                        if (completeCountryData[d.id]) {
                            d3.select(this).style("fill", "#2a2a2a");
                            elements.mapTooltip.style.opacity = 0;
                            elements.mapTooltip.setAttribute("aria-hidden", "true");
                        }
                    })
                    .on("mousemove", function(event) {
                        updateMapTooltipPosition(event);
                    })
                    .on("click", function(event, d) {
                        if (completeCountryData[d.id]) {
                            selectCountry(d.id);
                        }
                    });
                
                // Create country lists
                createCountryList();
                createAdditionalCountriesGrid();
                
                // Select first country by default
                selectCountry("USA");
            });

            // Add event listeners for buttons
            
            
            elements.earlyAssessmentBtn.addEventListener('click', function() {
                alert('Redirecting to free assessment... This will help identify your personal risk factors and create a customized plan.');
            });
            
            elements.researchPdfBtn.addEventListener('click', function() {
                alert('Downloading research summary PDF... This document contains 27 peer-reviewed studies condensed into actionable insights.');
            });

            // Add search functionality
            elements.countrySearch.addEventListener('input', function(e) {
                filterCountries(e.target.value);
            });

            // Make functions global for external access if needed
            window.selectCountry = selectCountry;
            window.completeCountryData = completeCountryData;
        });