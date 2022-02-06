import { resolve } from 'path'
import { existsSync, readJsonSync } from 'fs-extra'
import { recursive as recursiveMerge } from 'merge'

export interface ConfigOptions {
	/**
	 * An Object providing types/extensions for generating different files
	 */
	lang: {
		spec?: 'ts' | 'js';
		script?: 'ts' | 'js';
		story?: 'ts' | 'js';
		style?: 'css' | 'scss' | 'sass' | 'stylus' | 'less';
		template?: 'html' | 'pug';
	};

	/**
	 * An Object providing configuration for generating different files
	 */
	generate: {
		separateFiles?: boolean;
		docFile?: boolean;
		specFile?: boolean;
		storyBook?: boolean;
	};

	/**
	 * Project's Root Directory
	 *
	 * Default: process.cwd()
	 */
	rootDir?: string;

	/**
	 * Project's Src Directory. Relative to projects Root Directory
	 *
	 * Default: "src/"
	 */
	srcDir: string;

	/**
	 * Project's Directory Structure. Relative to projects Src Directory
	 */
	dir: {
		component?: string;
		directive?: string;
	};

	config?: string;
}

const defaultConf: ConfigOptions = {
	lang: {
		spec: 'js',
		script: 'js',
		template: 'html',
		style: 'scss'
	},

	rootDir: process.cwd(),

	srcDir: 'src/',

	dir: {
		component: 'components',
		directive: 'directives'
	},

	generate: {
		separateFiles: false,
		docFile: false,
		specFile: false,
		storyBook: false
	}
}

export class Config {
	private readonly _options: ConfigOptions

	constructor(options: Partial<ConfigOptions> = {}) {
		const rootDir = options?.rootDir || process.cwd()
		let configFile = null

		if (options?.config) {
			configFile = options.config
		} else if (existsSync(resolve(rootDir, './.vuecrc'))) {
			configFile = './.vuecrc'
		} else if (existsSync(resolve(rootDir, './vuec.json'))) {
			configFile = './.vuec.json'
		}
		const userConf = configFile
				? readJsonSync(resolve(rootDir, configFile))
				: {}

		this._options = recursiveMerge(defaultConf, userConf, this.cliConfigOptions(options))
	}

	cliConfigOptions(options: any): Partial<ConfigOptions> {
		const conf: Partial<ConfigOptions> = {}

		if (options.typescript) {
			conf.lang = { spec: 'ts', script: 'ts', story: 'ts' }
		}
		if (options.template && ['html', 'pug'].includes(options.template)) {
			conf.lang = { ...(conf.lang || {}), template: options.template }
		}
		if (options.style && ['css', 'sass', 'scss', 'stylus', 'less'].includes(options.style)) {
			conf.lang = { ...(conf.lang || {}), style: options.style }
		}

		if (options.doc) {
			conf.generate = { ...(conf.generate || {}), docFile: true }
		}
		if (options.spec) {
			conf.generate = { ...(conf.generate || {}), specFile: true }
		}
		if (options.stories) {
			conf.generate = { ...(conf.generate || {}), storyBook: true }
		}
		if (options.separate) {
			conf.generate = { ...(conf.generate || {}), separateFiles: true }
		}
		if (options.dir) {
			conf.dir = options.directive
				? { ...(conf.dir || {}), directive: options.dir }
				: { ...(conf.dir || {}), component: options.dir }
		}

		return conf
	}

	get options(): ConfigOptions {
		return this._options;
	}
}

export default function (options?: Partial<ConfigOptions>) {
	return (new Config(options)).options
}
