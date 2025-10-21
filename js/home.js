const STORAGE_KEY = 'bpmnFlowcharts';

// Haal flowcharts op uit localStorage of retourneer een lege array
const getFlowcharts = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

// Sla flowcharts op in localStorage
const saveFlowcharts = (flowcharts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowcharts));
};

// Genereer een uniek ID
const generateId = () => `flowchart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Render de lijst met flowcharts op de pagina
const renderFlowcharts = () => {
    const flowcharts = getFlowcharts();
    const listContainer = document.getElementById('flowchart-list');
    listContainer.innerHTML = ''; // Maak de lijst leeg

    if (flowcharts.length === 0) {
        listContainer.innerHTML = '<p>Geen flowcharts gevonden. Maak een nieuw ontwerp om te beginnen!</p>';
        return;
    }

    flowcharts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sorteer op meest recent

    flowcharts.forEach(flowchart => {
        const card = document.createElement('div');
        card.className = 'flowchart-card';
        card.innerHTML = `
            <h3>${flowchart.name || 'Onbekend Diagram'}</h3>
            <p>Laatst bijgewerkt: ${new Date(flowchart.updatedAt).toLocaleString()}</p>
            <div class="card-actions">
                <button data-id="${flowchart.id}" class="open-btn">Openen</button>
                <button data-id="${flowchart.id}" class="copy-btn">Kopiëren</button>
                <button data-id="${flowchart.id}" class="delete-btn">Verwijderen</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
};

// Functie om een nieuw, leeg diagram aan te maken
const createNewFlowchart = () => {
    const flowcharts = getFlowcharts();
    const newId = generateId();
    const newFlowchart = {
        id: newId,
        name: 'Nieuw Diagram',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="159" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,
        updatedAt: new Date().toISOString()
    };
    flowcharts.push(newFlowchart);
    saveFlowcharts(flowcharts);
    window.location.href = `editor.html?id=${newId}`;
};

// Functie om een diagram te verwijderen
const deleteFlowchart = (id) => {
    if (confirm('Weet je zeker dat je deze flowchart wilt verwijderen?')) {
        let flowcharts = getFlowcharts();
        flowcharts = flowcharts.filter(f => f.id !== id);
        saveFlowcharts(flowcharts);
        renderFlowcharts();
    }
};

// Functie om een diagram te kopiëren
const copyFlowchart = (id) => {
    let flowcharts = getFlowcharts();
    const original = flowcharts.find(f => f.id === id);
    if (original) {
        const newId = generateId();
        const newFlowchart = {
            ...original,
            id: newId,
            name: `Kopie van ${original.name}`,
            updatedAt: new Date().toISOString()
        };
        flowcharts.push(newFlowchart);
        saveFlowcharts(flowcharts);
        renderFlowcharts();
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderFlowcharts();

    document.getElementById('new-design-btn').addEventListener('click', createNewFlowchart);

    document.getElementById('flowchart-list').addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('open-btn')) {
            window.location.href = `editor.html?id=${id}`;
        } else if (target.classList.contains('delete-btn')) {
            deleteFlowchart(id);
        } else if (target.classList.contains('copy-btn')) {
            copyFlowchart(id);
        }
    });
});
