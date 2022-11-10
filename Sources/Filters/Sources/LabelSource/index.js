import macro from 'vtk.js/Sources/macros';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkTexture from 'vtk.js/Sources/Rendering/Core/Texture';
import vtkMatrixBuilder from 'vtk.js/Sources/Common/Core/MatrixBuilder';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math/';

// ----------------------------------------------------------------------------
// vtkLabelSource methods
// ----------------------------------------------------------------------------

function vtkLabelSource(publicAPI, model) {
  // Set our classname
  model.classHierarchy.push('vtkLabelSource');
  
  function requestData(inData, outData) {
    if (model.deleted) {
      return;
    }

    let textPolyData = outData[0];
	
    let tmTexture = vtkTexture.newInstance();
    tmTexture.setInterpolate(false);
    let tmCanvas = document.createElement('canvas');
    let tmContext = tmCanvas.getContext('2d');

    // set the text properties
    tmContext.textBaseline = 'bottom';
    tmContext.textAlign = 'left';
    tmContext.fillStyle = model.fontColor;
    tmContext.font = `${model.fontStyle} ${model.fontSize}px ${model.fontFamily}`;

    // compute the width and height we need
    const metrics = tmContext.measureText(model.text);
    let width  = metrics.width + 2;
    let height = metrics.actualBoundingBoxAscent + 2;
    width = vtkMath.nearestPowerOfTwo(width);
    height = vtkMath.nearestPowerOfTwo(height);
    tmCanvas.width = width;
    tmCanvas.height = height;
    tmContext.clearRect(0, 0, width, height);

    // draw text onto the texture
    let tcoords = [
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      height / (height + 1.0),
      0.0,
      height / (height + 1.0),
    ];
    tmContext.fillText(model.text, 1, height);
    tmTexture.setCanvas(tmCanvas);
    tmTexture.modified();

    // Points
    const points = macro.newTypedArray(model.pointType, model.resolution * 3);

    // Lines/cells
    // [# of points in line, vert_index_0, vert_index_1, ..., vert_index_0]
    const edges = new Uint32Array(model.resolution + 2);
    edges[0] = model.resolution + 1;

    // generate polydata
    const angle = (2.0 * Math.PI) / model.resolution;
    for (let i = 0; i < model.resolution; i++) {
      const x = model.center[0];
      const y = model.radius * Math.cos(i * angle) + model.center[1];
      const z = model.radius * Math.sin(i * angle) + model.center[2];
      points.set([x, y, z], i * 3);
      edges[i + 1] = i;
    }

    // connect endpoints
    edges[edges.length - 1] = edges[1];

    textPolyData = vtkPolyData.newInstance();
    textPolyData.getPoints().setData(points, 3);
    if (model.lines) {
      textPolyData.getLines().setData(edges, 1);
    }
    if (model.face) {
      textPolyData.getPolys().setData(edges, 1);
    }

    // translate an eventual center different to [0, 0, 0] to ensure rotation is correct
    vtkMatrixBuilder
      .buildFromRadian()
      .translate(...model.center)
      .rotateFromDirections([1, 0, 0], model.direction)
      .translate(...vtkMath.multiplyScalar([...model.center], -1))
      .apply(points);

    // Update output
    outData[0] = textPolyData;
  }

  // Expose methods
  publicAPI.requestData = requestData;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    text: "",
    center: [0, 0, 0],
    direction: [1, 0, 0],	
    fontColor: "white",
    fontStyle: "normal",
    fontSize: 15,
    fontFamily: "serif",
    ...initialValues,
  };
}

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, defaultValues(initialValues));

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['text', 'fontColor', 'fontStyle', 'fontSize', 'fontFamily']);
  macro.setGetArray(publicAPI, model, ['center', 'direction'], 3);
  macro.algo(publicAPI, model, 0, 1);
  vtkLabelSource(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkLabelSource');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
