document.addEventListener('DOMContentLoaded', () => {
    // Get results from localStorage
    const results = JSON.parse(localStorage.getItem('warCompassResults'));
    
    if (!results) {
        window.location.href = 'index.html';
        return;
    }
    
    // Convert scores from 1-5 to 0-1 scale
    const convertedResults = {};
    for (const axis in results) {
        // Convert from 1-5 to 0-1 scale
        convertedResults[axis] = (results[axis] - 3) / 2;
        // Ensure the score is between 0 and 1
        convertedResults[axis] = Math.max(0, Math.min(1, convertedResults[axis]));
    }
    
    // Update score displays
    document.getElementById('strategicOrientationScore').textContent = convertedResults.strategicOrientation.toFixed(2);
    document.getElementById('moralScopeScore').textContent = convertedResults.moralScope.toFixed(2);
    document.getElementById('strategicEthicsScore').textContent = convertedResults.strategicEthics.toFixed(2);
    document.getElementById('epistemicTrustScore').textContent = convertedResults.epistemicTrust.toFixed(2);
    
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
            scales: {
                x: {
                    min: 0,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Strategic Orientation'
                    },
                    grid: {
                        color: (context) => context.tick.value === 0.5 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    min: 0,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Moral Scope'
                    },
                    grid: {
                        color: (context) => context.tick.value === 0.5 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'
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
                                `Strategic Orientation: ${x.toFixed(2)} ${x > 0.5 ? 'Realist' : 'Idealist'}`,
                                `Moral Scope: ${y.toFixed(2)} ${y > 0.5 ? 'Universalist' : 'Particularist'}`
                            ];
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true
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
            scales: {
                x: {
                    min: 0,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Strategic Ethics'
                    },
                    grid: {
                        color: (context) => context.tick.value === 0.5 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    min: 0,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Epistemic Trust'
                    },
                    grid: {
                        color: (context) => context.tick.value === 0.5 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'
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
                                `Strategic Ethics: ${x.toFixed(2)} ${x > 0.5 ? 'Consequentialist' : 'Deontological'}`,
                                `Epistemic Trust: ${y.toFixed(2)} ${y > 0.5 ? 'Deferent' : 'Skeptic'}`
                            ];
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true
        }
    });
}); 