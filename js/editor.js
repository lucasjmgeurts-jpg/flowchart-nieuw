import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';

const STORAGE_KEY = 'bpmnFlowcharts';

// Haal flowcharts op uit localStorage
const getFlowcharts = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

// Sla flowcharts op in localStorage
const saveFlowcharts = (flowcharts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowcharts));
};

// Initialiseer de BPMN Editor
const viewer = new BpmnJS({
    container: '#canvas'
});

// Haal de flowchart ID op uit de URL
const params = new URLSearchParams(window.location.search);
const flowchartId = params.get('id');
let currentFlowchart = null;

// Laad de flowchart data
const loadFlowchart = async () => {
    if (!flowchartId) {
        alert('Geen flowchart ID gevonden!');
        window.location.href = 'index.html';
        return;
    }

    const flowcharts = getFlowcharts();
    currentFlowchart = flowcharts.find(f => f.id === flowchartId);

    if (!currentFlowchart) {
        alert('Flowchart niet gevonden!');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('flowchart-name').value = currentFlowchart.name;

    try {
        await viewer.importXML(currentFlowchart.xml);
        const canvas = viewer.get('canvas');
        canvas.zoom('fit-viewport');
    } catch (err) {
        console.error('Fout bij het importeren van XML:', err);
    }
};

// Sla de flowchart op
const saveFlowchart = async () => {
    if (!currentFlowchart) return;

    try {
        const { xml } = await viewer.saveXML({ format: true });
        const flowcharts = getFlowcharts();
        const index = flowcharts.findIndex(f => f.id === flowchartId);

        if (index !== -1) {
            flowcharts[index].name = document.getElementById('flowchart-name').value;
            flowcharts[index].xml = xml;
            flowcharts[index].updatedAt = new Date().toISOString();
            saveFlowcharts(flowcharts);
            alert('Flowchart opgeslagen!');
        }
    } catch (err) {
        console.error('Fout bij het opslaan van XML:', err);
        alert('Kon de flowchart niet opslaan.');
    }
};

/**
 * Exporteert het diagram naar een specifiek formaat.
 * @param {string} type - Het te exporteren formaat (bijv. 'svg', 'png', 'pdf').
 */
const exportDiagram = (type) => {
    // TODO: Implementeer export naar SVG, PNG, PDF.
    console.log(`Exporting diagram to ${type}...`);
    // Voorbeeld voor SVG:
    // viewer.saveSVG().then(result => { ... });
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadFlowchart();
    document.getElementById('save-btn').addEventListener('click', saveFlowchart);
});
