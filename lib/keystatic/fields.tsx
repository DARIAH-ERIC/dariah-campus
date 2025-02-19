import { TextField } from "@keystar/ui/text-field";
import type { BasicFormField, FormFieldStoredValue } from "@keystatic/core";

interface ColorPickerFieldProps {
	defaultValue?: string;
	description?: string;
	label: string;
}

function ColorPickerField(props: ColorPickerFieldProps): BasicFormField<string> {
	const { defaultValue, description, label } = props;

	return {
		kind: "form",
		label,
		Input(props) {
			/**
			 * For simple usecases, the browser built-in color input should work.
			 *
			 * For a better color-picker, consider using
			 * @see https://react-spectrum.adobe.com/react-aria/ColorPicker.html
			 */
			return <TextField {...props} description={description} label={label} type="color" />;
		},
		defaultValue() {
			return defaultValue ?? "";
		},
		parse(value) {
			return parseAsNormalField(value);
		},
		serialize(value) {
			return { value: value === "" ? undefined : value };
		},
		validate(value) {
			return validate(value);
		},
		reader: {
			parse(value) {
				return validate(parseAsNormalField(value));
			},
		},
	};
}

interface IdentifierFieldProps {
	defaultValue?: string;
	description?: string;
	label: string;
}

function IdentifierField(props: IdentifierFieldProps): BasicFormField<string> {
	const { defaultValue, description, label } = props;

	return {
		kind: "form",
		label,
		Input(props) {
			return <TextField {...props} description={description} isReadOnly={true} label={label} />;
		},
		defaultValue() {
			return defaultValue ?? "";
		},
		parse(value) {
			return parseAsNormalField(value);
		},
		serialize(value) {
			return { value: value === "" ? undefined : value };
		},
		validate(value) {
			return validate(value);
		},
		reader: {
			parse(value) {
				return validate(parseAsNormalField(value));
			},
		},
	};
}

function parseAsNormalField(value: FormFieldStoredValue): string {
	if (value === undefined) {
		return "";
	}
	if (typeof value !== "string") {
		throw new Error("Must be a string");
	}
	return value;
}

function validate(value: string): string {
	return value;
}

export const colorPicker = ColorPickerField;
export const identifier = IdentifierField;
