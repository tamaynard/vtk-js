import { vtkAlgorithm, vtkObject } from "../../../interfaces";
import { Vector3 } from "../../../types";

/**
 *
 */
export interface ILabelSourceInitialValues {
	text?: string;
	center?: Vector3;
	fontColor?: string;
	fontStyle?: string;
	fontSize?: number;
	fontFamily?: string;
}

type vtkLabelSourceBase = vtkObject & Omit<vtkAlgorithm,
	| 'getInputData'
	| 'setInputData'
	| 'setInputConnection'
	| 'getInputConnection'
	| 'addInputConnection'
	| 'addInputData'>;

export interface vtkLabelSource extends vtkLabelSourceBase {

	/**
	 * Get the center of the label.
	 * @default [0, 0, 0]
	 */
	getCenter(): Vector3;

	/**
	 * Get the center of the label.
	 */
	getCenterByReference(): Vector3;

	/**
	 * Get the orientation vector of the label.
	 * @default [1.0, 0.0, 0.0]
	 */
	getDirection(): Vector3;

	/**
	 * Get the orientation vector of the label.
	 */
	getDirectionByReference(): Vector3;

	/**
	 * Get the text displayed by the label.
	 */
	getText(): string;

	/**
	 * Get the color of the label.
	 */
	getFontColor(): string;

	/**
	 * Get the font style of the label.
	 */
	getFontStyle(): string;

	/**
	 * Get the font size of the label.
	 */
	getFontSize(): number;

	/**
	 * Get the font family of the label.
	 */
	getFontFamily(): string;

	/**
	 * Expose methods
	 * @param inData 
	 * @param outData 
	 */
	requestData(inData: any, outData: any): void;

	/**
	 * Set the direction for the label.
	 * @param {Number} x The x coordinate.
	 * @param {Number} y The y coordinate.
	 * @param {Number} z The z coordinate.
	 */
	setDirection(x: number, y: number, z: number): boolean;

	/**
	 * Set the direction for the label.
	 * @param {Vector3} direction The direction coordinates.
	 */
	setDirection(direction: Vector3): boolean;

	/**
	 * Set the direction for the label.
	 * @param {Vector3} direction The direction coordinates.
	 */
	setDirectionFrom(direction: Vector3): boolean;

	/**
	 * Set the center of the label.
	 * @param {Number} x The x coordinate.
	 * @param {Number} y The y coordinate.
	 * @param {Number} z The z coordinate.
	 * @default [0, 0, 0]
	 */
	setCenter(x: number, y: number, z: number): boolean;

	/**
	 * Set the center of the label.
	 * @param {Vector3} center 
	 * @default [0, 0, 0]
	 */
	setCenterFrom(center: Vector3): boolean;

	/**
	 * Set the text of the label.
	 * @param {String} text 
	 * @default ""
	 */
	setText(text: string): boolean;

	/**
	 * Set the font color for the label.
	 * @param {String} fontColor 
	 * @default "white"
	 */
	setFontColor(fontColor: string): boolean;

	/**
	 * Set the font style for the label.
	 * @param {String} fontStyle 
	 * @default "normal"
	 */
	setFontStyle(fontStyle: string): boolean;

	/**
	 * Set the font size for the label.
	 * @param {Number} fontSize 
	 * @default 15
	 */
	setFontSize(fontSize: number): boolean;

	/**
	 * Set the font family for the label.
	 * @param {String} fontFamily 
	 * @default "serif"
	 */
	setFontFamily(fontFamily: string): boolean;

}

/**
 * Method used to decorate a given object (publicAPI+model) with vtkLabelSource characteristics.
 *
 * @param publicAPI object on which methods will be bounds (public)
 * @param model object on which data structure will be bounds (protected)
 * @param {ILabelSourceInitialValues} [initialValues] (default: {})
 */
export function extend(publicAPI: object, model: object, initialValues?: ILabelSourceInitialValues): void;

/**
 * Method used to create a new instance of vtkLabelSource.
 * @param {ILabelSourceInitialValues} [initialValues] for pre-setting some of its content
 */
export function newInstance(initialValues?: ILabelSourceInitialValues): vtkLabelSource;

/**
/**
 * vtkLabelSource creates a label.
 * 
 * @example
 * ```js
 * import vtkLabelSource from '@kitware/vtk.js/Filters/Sources/LabelSource';
 * 
 * const label = vtkLabelSource.newInstance({ text: "This is a label" });
 * const polydata = label.getOutputData();
 * ```
 */
export declare const vtkLabelSource: {
	newInstance: typeof newInstance,
	extend: typeof extend,
};
export default vtkLabelSource;
