import 'vtk.js/Sources/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import 'vtk.js/Sources/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkLabelSource from 'vtk.js/Sources/Filters/Sources/LabelSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

import controlPanel from './controlPanel.html';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

function createLabelPipeline() {
  const labelSource = vtkLabelSource.newInstance();
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  labelSource.setLines(true);
  labelSource.setFace(true);

  actor.setMapper(mapper);
  mapper.setInputConnection(labelSource.getOutputPort());

  renderer.addActor(actor);
  return { labelSource, mapper, actor };
}

const pipelines = [createLabelPipeline()];
pipelines[0].actor.getProperty().setColor(1, 0, 0);

renderer.resetCamera();
renderWindow.render();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

['text'].forEach((propertyName) => {
  document.querySelector(`.${propertyName}`).addEventListener('input', (e) => {
    const value e.target.value;
    pipelines[0].labelSource.set({ [propertyName]: value });
    renderWindow.render();
  });
});

const centerElems = document.querySelectorAll('.center');
const dirElems = document.querySelectorAll('.dir');

function updateTransformedLabel() {
  const center = [0, 0, 0];
  const direction = [1, 0, 0];
  for (let i = 0; i < 3; i++) {
    center[Number(centerElems[i].dataset.index)] = Number(centerElems[i].value);
    direction[Number(dirElems[i].dataset.index)] = Number(dirElems[i].value);
  }
  pipelines[0].labelSource.set({ center });
  pipelines[0].labelSource.set({ direction });
  renderWindow.render();
}

for (let i = 0; i < 3; i++) {
  centerElems[i].addEventListener('input', updateTransformedLabel);
}

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.pipelines = pipelines;
global.renderer = renderer;
global.renderWindow = renderWindow;
