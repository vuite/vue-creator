import { existsSync } from 'fs-extra'
import { resolve } from 'path'

export interface SystemSettings {
	vue: 2 | 3 | undefined
}

export function vueVersion () {
	const vuePath = resolve(process.cwd(), 'node_modules/vue/package.json')
	if (!existsSync(vuePath)) {
		throw new Error('Vue JS version 2 || 3 is required!')
	}

	const { version } = require(vuePath)
	return version.startsWith('3') ? 3 : 2
}

export default function settings (): SystemSettings {
	return {
		vue: vueVersion()
	}
}
