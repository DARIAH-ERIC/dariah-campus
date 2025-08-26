/* eslint-disable react-x/prefer-read-only-props */

import { TextField } from "@keystar/ui/text-field";
import type { BasicFormField, FormFieldStoredValue } from "@keystatic/core";

interface ReadonlyFieldProps {
	defaultValue?: string;
	description?: string;
	label: string;
}

function ReadonlyField(props: ReadonlyFieldProps): BasicFormField<string> {
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

export const readonly = ReadonlyField;
