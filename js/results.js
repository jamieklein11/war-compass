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
        x, y, width, height, userX, userY, xLabels, yLabels, dotColor
    }) {
        console.log('createCompassSVG called', {userX, userY, xLabels, yLabels});
        // Map userX, userY from [-1,1] to SVG coordinates
        const map = v => ((v + 1) / 2) * width;
        const userSvgX = map(userX);
        const userSvgY = height - map(userY); // SVG y is inverted
        const axisStyle = 'stroke:black;stroke-width:3';
        const gridStyle = 'stroke:#e5e7eb;stroke-width:1';
        const arrowSize = 7;
        // Axis ends (for arrowheads and labels)
        const margin = 18;
        const x0 = margin, x1 = width - margin;
        const y0 = margin, y1 = height - margin;
        const cx = width / 2, cy = height / 2;
        // SVG
        return `
<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="max-width:350px;max-height:350px;">
    <!-- Subtle border -->
    <rect x="0" y="0" width="${width}" height="${height}" fill="#f7f8fa" stroke="#d1d5db" stroke-width="2" rx="18"/>
    <!-- Grid lines -->
    <line x1="${width*0.25}" y1="0" x2="${width*0.25}" y2="${height}" style="${gridStyle}"/>
    <line x1="${width*0.75}" y1="0" x2="${width*0.75}" y2="${height}" style="${gridStyle}"/>
    <line x1="0" y1="${height*0.25}" x2="${width}" y2="${height*0.25}" style="${gridStyle}"/>
    <line x1="0" y1="${height*0.75}" x2="${width}" y2="${height*0.75}" style="${gridStyle}"/>
    <!-- Y axis (vertical, x=cx) -->
    <line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y0}" style="${axisStyle}" marker-start="url(#arrowhead-down)" marker-end="url(#arrowhead-up)"/>
    <!-- X axis (horizontal, y=cy) -->
    <line x1="${x0}" y1="${cy}" x2="${x1}" y2="${cy}" style="${axisStyle}" marker-start="url(#arrowhead-left)" marker-end="url(#arrowhead-right)"/>
    <!-- User dot -->
    <circle cx="${userSvgX}" cy="${userSvgY}" r="13" fill="${dotColor}" stroke="#1e293b" stroke-width="3"/>
    <!-- Axis labels just outside the axis ends -->
    <text x="${cx}" y="${y0 - 8}" text-anchor="middle" font-size="1.1em" font-weight="bold">${yLabels[1]}</text>
    <text x="${cx}" y="${y1 + 22}" text-anchor="middle" font-size="1.1em" font-weight="bold">${yLabels[0]}</text>
    <text x="${x1 + 8}" y="${cy - 10}" text-anchor="start" font-size="1.1em" font-weight="bold">${xLabels[1]}</text>
    <text x="${x0 - 8}" y="${cy - 10}" text-anchor="end" font-size="1.1em" font-weight="bold">${xLabels[0]}</text>
    <!-- Arrowhead defs -->
    <defs>
      <marker id="arrowhead-up" markerWidth="${arrowSize}" markerHeight="${arrowSize}" refX="${arrowSize/2}" refY="${arrowSize}" orient="auto" markerUnits="strokeWidth">
        <polygon points="${arrowSize/2},0 0,${arrowSize} ${arrowSize},${arrowSize}" fill="black"/>
      </marker>
      <marker id="arrowhead-down" markerWidth="${arrowSize}" markerHeight="${arrowSize}" refX="${arrowSize/2}" refY="0" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 ${arrowSize},0 ${arrowSize/2},${arrowSize}" fill="black"/>
      </marker>
      <marker id="arrowhead-left" markerWidth="${arrowSize}" markerHeight="${arrowSize}" refX="${arrowSize}" refY="${arrowSize/2}" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,${arrowSize/2} ${arrowSize},0 ${arrowSize},${arrowSize}" fill="black"/>
      </marker>
      <marker id="arrowhead-right" markerWidth="${arrowSize}" markerHeight="${arrowSize}" refX="0" refY="${arrowSize/2}" orient="auto" markerUnits="strokeWidth">
        <polygon points="${arrowSize},${arrowSize/2} 0,0 0,${arrowSize}" fill="black"/>
      </marker>
    </defs>
</svg>`;
    }
    
    // Compass A: Strategic Orientation vs. Moral Scope
    document.getElementById('compassA').innerHTML = createCompassSVG({
        x: -1, y: -1, width: 320, height: 320,
        userX: convertedResults.strategicOrientation,
        userY: convertedResults.moralScope,
        xLabels: ['Idealist', 'Realist'],
        yLabels: ['Particularist', 'Universalist'],
        dotColor: '#2563eb'
    });
    
    // Compass B: Strategic Ethics vs. Epistemic Trust
    document.getElementById('compassB').innerHTML = createCompassSVG({
        x: -1, y: -1, width: 320, height: 320,
        userX: convertedResults.strategicEthics,
        userY: convertedResults.epistemicTrust,
        xLabels: ['Deontological', 'Consequentialist'],
        yLabels: ['Populist Skepticism', 'Institutional Deference'],
        dotColor: '#2563eb'
    });
}); 