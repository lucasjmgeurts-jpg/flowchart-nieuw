import BpmnJS from './node_modules/bpmn-js/dist/bpmn-modeler.development.js';

const viewer = new BpmnJS({
    container: '#canvas'
});

Coloris.setInstance('#solid-color', {
  onChange: (color) => {
    const selection = viewer.get('selection');
    const selectedElements = selection.get();
    if (selectedElements.length > 0) {
      const modeling = viewer.get('modeling');
      modeling.setColor(selectedElements, {
        fill: color,
        stroke: 'black'
      });
    }
  }
});

document.getElementById('apply-gradient').addEventListener('click', () => {
  const selection = viewer.get('selection');
  const selectedElements = selection.get();

  if (selectedElements.length === 0) {
    return;
  }

  const color1 = document.getElementById('gradient-color-1').value;
  const color2 = document.getElementById('gradient-color-2').value;
  const direction = document.getElementById('gradient-direction').value;

  const canvas = viewer.get('canvas');
  const svg = canvas._svg;
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.prepend(defs);
  }

  const gradientId = 'gradient-' + new Date().getTime();
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', gradientId);

  if (direction === 'horizontal') {
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
  } else {
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
  }

  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('style', `stop-color:${color1};stop-opacity:1`);
  gradient.appendChild(stop1);

  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('style', `stop-color:${color2};stop-opacity:1`);
  gradient.appendChild(stop2);

  defs.appendChild(gradient);

  const modeling = viewer.get('modeling');
  modeling.setColor(selectedElements, {
    fill: `url(#${gradientId})`,
    stroke: 'black'
  });
});

const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
    <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
    </bpmn:process>
</bpmn:definitions>`;

async function openDiagram(xml) {
    try {
        console.log('Importing diagram...');
        await viewer.importXML(xml);
        console.log('Diagram imported. Setting attribute.');
        document.body.setAttribute('data-bpmn-loaded', 'true');
        console.log('Attribute set.');
    } catch (err) {
        console.error('could not import BPMN 2.0 diagram', err);
    }
}

openDiagram(bpmnXML);
