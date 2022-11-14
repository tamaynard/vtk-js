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
    tmContext.fillText(model.text, 1, height);
    tmTexture.setCanvas(tmCanvas);
    tmTexture.modified();

    const tcoords = [
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
    ];
    const points = [
      0.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
    ];
    const polys = [
      3, 0, 1, 2,
      3, 0, 2, 3,
    ];

    const tcoordDA = vtkDataArray.newInstance({
      numberOfComponents: 2,
      values: tcoords,
      name: 'TextureCoordinates',
    });

    textPolyData = vtkPolyData.newInstance();
    textPolyData.getPointData().setTCoords(tcoordDA);
    textPolyData.getPoints().setData(points, 3);
    textPolyData.getPolys().setData(polys, 1);

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
