import '../assets/styles/graph-tooltip/impact-tooltip.scss';

export const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'tooltipDiv';
    tooltipEl.style.display = 'block';
    tooltipEl.style.background = 'rgba(255, 255, 255, 0.95)';
    tooltipEl.style.borderRadius = '2px';
    tooltipEl.style.border = '1px solid #dadeeb';
    tooltipEl.style.color = '#000';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.marginTop = '1rem';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .4s ease';
    tooltipEl.style.width = '25rem';
    tooltipEl.style.padding = '1.5rem';
    tooltipEl.style.zIndex = '10000';

    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};
