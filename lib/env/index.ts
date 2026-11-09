import { Result } from "better-result";
import * as v from "valibot";

import { ValidationError } from "#/lib/env/errors.ts";

const validationModes = ["build-args-only", "disabled", "enabled"] as const;

const ValidationModeSchema = v.fallback(v.picklist(validationModes), "enabled");

type ValidationMode = v.InferOutput<typeof ValidationModeSchema>;

// oxlint-disable-next-line node/no-process-env
const defaultMode = v.parse(ValidationModeSchema, process.env.ENV_VALIDATION);

const SharedSchema = v.object({
	NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "production"),
});

type SharedSchema = v.InferOutput<typeof SharedSchema>;

type PrefixedEntries<TPrefix extends string | undefined, T extends v.ObjectEntries> = {
	[K in keyof T]: TPrefix extends undefined ? T[K] : K extends `${TPrefix}${string}` ? T[K] : never;
};

type UnprefixedEntries<TPrefix extends string | undefined, T extends v.ObjectEntries> = {
	[K in keyof T]: TPrefix extends undefined ? T[K] : K extends `${TPrefix}${string}` ? never : T[K];
};

type PrefixedKeys<TPrefix extends string | undefined, T extends v.ObjectEntries> = {
	[K in keyof T]: TPrefix extends undefined ? K : K extends `${TPrefix}${string}` ? K : never;
}[keyof T];

type UnprefixedKeys<TPrefix extends string | undefined, T extends v.ObjectEntries> = {
	[K in keyof T]: TPrefix extends undefined ? K : K extends `${TPrefix}${string}` ? never : K;
}[keyof T];

export function define<
	TBuildArgsPrefix extends string | undefined,
	// oxlint-disable-next-line typescript/ban-types, typescript/no-empty-object-type
	TBuildArgs extends v.ObjectEntries = {},
	// oxlint-disable-next-line typescript/ban-types, typescript/no-empty-object-type
	TEnvVars extends v.ObjectEntries = {},
>(params: {
	buildArgsPrefix?: TBuildArgsPrefix;
	buildArgs?: v.ObjectSchema<PrefixedEntries<TBuildArgsPrefix, TBuildArgs>, undefined>;
	envVars?: v.ObjectSchema<UnprefixedEntries<TBuildArgsPrefix, TEnvVars>, undefined>;
}) {
	const { buildArgs, envVars } = params;

	return function validate(params: {
		environment: Record<
			PrefixedKeys<TBuildArgsPrefix, TBuildArgs> | UnprefixedKeys<TBuildArgsPrefix, TEnvVars>,
			unknown
		>;
		mode?: ValidationMode;
	}): Result<
		Readonly<v.InferOutput<v.ObjectSchema<TBuildArgs & TEnvVars, undefined>> & SharedSchema>,
		ValidationError
	> {
		const { environment: _environment, mode: _mode } = params;

		return Result.try({
			try: () => {
				const mode = _mode ?? defaultMode;

				const environment = {} as Record<string, unknown>;

				for (const [key, value] of Object.entries(_environment)) {
					if (value == null || value === "") {
						continue;
					}

					environment[key] = value;
				}

				if (mode === "disabled") {
					// oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-return
					return Object.freeze(environment as any);
				}

				const isClientEnvironment = "document" in globalThis;

				if (isClientEnvironment) {
					const Schema = v.object({ ...buildArgs?.entries, ...SharedSchema.entries });
					return Object.freeze(v.parse(Schema, environment));
				}

				switch (mode) {
					case "build-args-only": {
						const Schema = v.object({ ...buildArgs?.entries, ...SharedSchema.entries });
						return Object.freeze(v.parse(Schema, environment));
					}

					case "enabled": {
						const Schema = v.object({
							...buildArgs?.entries,
							...envVars?.entries,
							...SharedSchema.entries,
						});
						return Object.freeze(v.parse(Schema, environment));
					}
				}
			},
			catch: (cause) =>
				new ValidationError({
					cause,
					message: v.isValiError(cause) ? v.summarize(cause.issues) : undefined,
				}),
		});
	};
}
