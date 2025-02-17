export type ValidationErrors = Record<string, string | Array<string>>;

export interface InitialActionState {
	status: "initial";
	timestamp: null;
	formData: FormData | null;
}

export function createInitialActionState({
	formData,
}: Partial<Pick<InitialActionState, "formData">>): InitialActionState {
	return {
		status: "initial",
		timestamp: null,
		formData: formData ?? null,
	};
}

export interface SuccessActionState {
	status: "success";
	timestamp: number;
	message: string | Array<string> | null;
	formData: FormData | null;
}

export function createSuccessActionState({
	formData,
	message,
}: Partial<Pick<SuccessActionState, "formData" | "message">>): SuccessActionState {
	return {
		status: "success",
		timestamp: Date.now(),
		message: message ?? null,
		formData: formData ?? null,
	};
}

export interface ErrorActionState {
	status: "error";
	timestamp: number;
	message: string | Array<string> | null;
	errors: Partial<Record<string, string | Array<string>>>;
	formData: FormData | null;
}

export function createErrorActionState({
	errors,
	formData,
	message,
}: Partial<Pick<ErrorActionState, "errors" | "formData" | "message">>): ErrorActionState {
	return {
		status: "error",
		timestamp: Date.now(),
		message: message ?? null,
		errors: errors ?? {},
		/** @see https://github.com/facebook/react/issues/29034 */
		formData: formData ?? null,
	};
}

export type ActionState = InitialActionState | SuccessActionState | ErrorActionState;

export function getSuccessMessage(state: ActionState): string | Array<string> | null | undefined {
	return state.status === "success" ? state.message : undefined;
}

export function getErrorMessage(state: ActionState): string | Array<string> | null | undefined {
	return state.status === "error" ? state.message : undefined;
}

export function getFieldErrors(
	state: ActionState,
): Record<string, string | Array<string>> | undefined {
	return state.status === "error"
		? /** `valibot` validation errors include `undefined`, but `react-aria-components` don't.  */
			(state.errors as Record<string, string | Array<string>>)
		: undefined;
}
