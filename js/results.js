console.log('results.js loaded');
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
    
    function createCompassSVG({
        x, y, width = 420, height = 420, userX, userY, xLabels, yLabels, dotColor
    }) {
        console.log('createCompassSVG called', {userX, userY, xLabels, yLabels});
        // Add larger margin for labels
        const margin = 80;
        const innerWidth = width - 2 * margin;
        const innerHeight = height - 2 * margin;
        // Map userX, userY from [-1,1] to SVG coordinates (inner area)
        const mapX = v => margin + ((v + 1) / 2) * innerWidth;
        const mapY = v => height - (margin + ((v + 1) / 2) * innerHeight); // SVG y is inverted
        const userSvgX = mapX(userX);
        const userSvgY = mapY(userY);
        const axisStyle = 'stroke:black;stroke-width:3';
        const gridStyle = 'stroke:#e5e7eb;stroke-width:1';
        const arrowSize = 7;
        const cx = width / 2, cy = height / 2;
        const x0 = margin, x1 = width - margin;
        const y0 = margin, y1 = height - margin;
        // SVG
        return `
<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="max-width:470px;max-height:470px;">
    <!-- Subtle border -->
    <rect x="${margin/4}" y="${margin/4}" width="${width-margin/2}" height="${height-margin/2}" fill="#f7f8fa" stroke="#d1d5db" stroke-width="2" rx="18"/>
    <!-- Grid lines (inner area) -->
    <line x1="${x0 + innerWidth*0.25}" y1="${y0}" x2="${x0 + innerWidth*0.25}" y2="${y1}" style="${gridStyle}"/>
    <line x1="${x0 + innerWidth*0.75}" y1="${y0}" x2="${x0 + innerWidth*0.75}" y2="${y1}" style="${gridStyle}"/>
    <line x1="${x0}" y1="${y0 + innerHeight*0.25}" x2="${x1}" y2="${y0 + innerHeight*0.25}" style="${gridStyle}"/>
    <line x1="${x0}" y1="${y0 + innerHeight*0.75}" x2="${x1}" y2="${y0 + innerHeight*0.75}" style="${gridStyle}"/>
    <!-- Y axis (vertical, x=cx) -->
    <line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y0}" style="${axisStyle}" marker-start="url(#arrowhead)" marker-end="url(#arrowhead)"/>
    <!-- X axis (horizontal, y=cy) -->
    <line x1="${x0}" y1="${cy}" x2="${x1}" y2="${cy}" style="${axisStyle}" marker-start="url(#arrowhead)" marker-end="url(#arrowhead)"/>
    <!-- User dot -->
    <circle cx="${userSvgX}" cy="${userSvgY}" r="13" fill="${dotColor}" stroke="#1e293b" stroke-width="3"/>
    <!-- Axis labels in margin -->
    <text x="${cx}" y="${y0 - 24}" text-anchor="middle" font-size="1em" font-weight="bold">${yLabels[1]}</text>
    <text x="${cx}" y="${y1 + 44}" text-anchor="middle" font-size="1em" font-weight="bold">${yLabels[0]}</text>
    <text x="${x1 + 30}" y="${cy}" text-anchor="middle" font-size="1em" font-weight="bold" transform="rotate(90,${x1 + 30},${cy})">${xLabels[1]}</text>
    <text x="${x0 - 30}" y="${cy}" text-anchor="middle" font-size="1em" font-weight="bold" transform="rotate(-90,${x0 - 30},${cy})">${xLabels[0]}</text>
    <!-- Arrowhead def: single up-pointing, orient auto -->
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="10" orient="auto" markerUnits="strokeWidth">
        <polygon points="5,0 0,10 10,10" fill="black"/>
      </marker>
    </defs>
</svg>`;
    }
    
    // Compass A: Strategic Orientation vs. Moral Scope
    document.getElementById('compassA').innerHTML = createCompassSVG({
        x: -1, y: -1, width: 420, height: 420,
        userX: convertedResults.strategicOrientation,
        userY: convertedResults.moralScope,
        xLabels: ['Idealist', 'Realist'],
        yLabels: ['Particularist', 'Universalist'],
        dotColor: '#2563eb'
    });
    
    // Compass B: Strategic Ethics vs. Epistemic Trust
    document.getElementById('compassB').innerHTML = createCompassSVG({
        x: -1, y: -1, width: 420, height: 420,
        userX: convertedResults.strategicEthics,
        userY: convertedResults.epistemicTrust,
        xLabels: ['Deontological', 'Consequentialist'],
        yLabels: ['Populist Skepticism', 'Institutional Deference'],
        dotColor: '#2563eb'
    });
}); 