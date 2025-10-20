import BpmnJS from 'bpmn-js/dist/bpmn-viewer.development.js';

const viewer = new BpmnJS({
    container: '#canvas'
});

viewer.importXML(`<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
</bpmn:definitions>`);
