document.addEventListener('DOMContentLoaded', () => {
    // Get results from localStorage
    const results = JSON.parse(localStorage.getItem('warCompassResults'));
    
    if (!results) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update score displays
    document.getElementById('strategicEthicsScore').textContent = results.strategicEthics.toFixed(1);
    document.getElementById('moralScopeScore').textContent = results.moralScope.toFixed(1);
    document.getElementById('strategicOrientationScore').textContent = results.strategicOrientation.toFixed(1);
    document.getElementById('epistemicTrustScore').textContent = results.epistemicTrust.toFixed(1);
    
    // Compass A: Strategic Orientation vs. Moral Scope
    const compassA = new Chart(document.getElementById('compassA'), {
        type: 'scatter',
        data: {
            datasets: [{
                data: [{
                    x: results.strategicOrientation,
                    y: results.moralScope
                }],
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            scales: {
                x: {
                    min: 1,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Strategic Orientation (Idealist → Realist)'
                    }
                },
                y: {
                    min: 1,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Moral Scope (Particularist → Universalist)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
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
                    x: results.strategicEthics,
                    y: results.epistemicTrust
                }],
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            scales: {
                x: {
                    min: 1,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Strategic Ethics (Deontological → Consequentialist)'
                    }
                },
                y: {
                    min: 1,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Epistemic Trust (Skeptic → Deferent)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: true
        }
    });
}); 