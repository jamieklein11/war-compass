document.addEventListener('DOMContentLoaded', () => {
    // Get results from localStorage
    const results = JSON.parse(localStorage.getItem('warCompassResults'));
    
    if (!results) {
        window.location.href = 'index.html';
        return;
    }
    
    // Convert scores from 1-5 to -1 to 1 scale
    const convertedResults = {};
    for (const axis in results) {
        // Convert from 1-5 to -1 to 1 scale
        // For scores < 3, map to -1 to 0 (left side)
        // For scores > 3, map to 0 to 1 (right side)
        // Score of 3 maps to 0 (center)
        const score = results[axis];
        if (score < 3) {
            convertedResults[axis] = (score - 3) / 2; // Maps 1-3 to -1 to 0
        } else {
            convertedResults[axis] = (score - 3) / 2; // Maps 3-5 to 0 to 1
        }
    }
    
    // Update score displays
    document.getElementById('strategicOrientationScore').textContent = convertedResults.strategicOrientation.toFixed(2);
    document.getElementById('moralScopeScore').textContent = convertedResults.moralScope.toFixed(2);
    document.getElementById('strategicEthicsScore').textContent = convertedResults.strategicEthics.toFixed(2);
    document.getElementById('epistemicTrustScore').textContent = convertedResults.epistemicTrust.toFixed(2);
    
    // Common chart options
    const commonOptions = {
        scales: {
            x: {
                min: -1,
                max: 1,
                display: false,
                grid: {
                    display: true,
                    color: (context) => context.tick.value === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                    lineWidth: (context) => context.tick.value === 0 ? 2 : 1
                }
            },
            y: {
                min: -1,
                max: 1,
                display: false,
                grid: {
                    display: true,
                    color: (context) => context.tick.value === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                    lineWidth: (context) => context.tick.value === 0 ? 2 : 1
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const x = context.raw.x;
                        const y = context.raw.y;
                        return [
                            `X: ${x.toFixed(2)}`,
                            `Y: ${y.toFixed(2)}`
                        ];
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: true
    };
    
    // Compass A: Strategic Orientation vs. Moral Scope
    const compassA = new Chart(document.getElementById('compassA'), {
        type: 'scatter',
        data: {
            datasets: [{
                data: [{
                    x: convertedResults.strategicOrientation,
                    y: convertedResults.moralScope
                }],
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const x = context.raw.x;
                            const y = context.raw.y;
                            return [
                                `Strategic Orientation: ${x.toFixed(2)} ${x > 0 ? 'Realist' : 'Idealist'}`,
                                `Moral Scope: ${y.toFixed(2)} ${y > 0 ? 'Universalist' : 'Particularist'}`
                            ];
                        }
                    }
                }
            }
        }
    });
    
    // Compass B: Strategic Ethics vs. Epistemic Trust
    const compassB = new Chart(document.getElementById('compassB'), {
        type: 'scatter',
        data: {
            datasets: [{
                data: [{
                    x: convertedResults.strategicEthics,
                    y: convertedResults.epistemicTrust
                }],
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const x = context.raw.x;
                            const y = context.raw.y;
                            return [
                                `Strategic Ethics: ${x.toFixed(2)} ${x > 0 ? 'Consequentialist' : 'Deontological'}`,
                                `Epistemic Trust: ${y.toFixed(2)} ${y > 0 ? 'Deferent' : 'Skeptic'}`
                            ];
                        }
                    }
                }
            }
        }
    });
}); 