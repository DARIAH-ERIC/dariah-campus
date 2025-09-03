import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(_exec);

export async function getLastModifiedTimestamp(filePath: string): Promise<number | null> {
	const { stdout } = await exec(`git log -1 --format=%ai -- ${filePath}`);

	if (stdout) {
		return new Date(stdout.trim()).getTime();
	}

	return null;
}
