import chalk from 'chalk'
import pug from 'pug'
import Listr, { ListrContext, ListrTask } from 'listr'
import { existsSync, writeFileSync, mkdirSync } from 'fs-extra'
import { join as joinPath, relative, resolve } from 'path'
import { camelCase, paramCase, pascalCase } from 'change-case'

import type {ConfigOptions, CreatorOptions} from './config'


class TemplateCreator {
	private readonly _config: ConfigOptions

	private readonly _vueVersion: 2 | 3

	private readonly _templatesDir: string

	constructor(name: string, create: 'component' | 'directive', config: ConfigOptions, vueVersion: 2 | 3) {
		this._config = config
		this._vueVersion = vueVersion
		this._templatesDir = resolve(__dirname, '../templates')
		this.create(name, create)
	}

	private create(name: string, create: 'component' | 'directive') {
		const tasks = create === 'component'
			? this.componentCreationTasks(name)
			: this.directiveCreationTasks(name)

		tasks.run(this.config)
			.then(({ successMsg }) => {
				console.log(successMsg)
			})
			.catch(err => {
				console.error(err);
			})
	}

	/**
	 * Create Component Tasks
	 */
	private componentCreationTasks(name: string) {
		let compDir = this.createDirPath(this.config.dir.component || 'components')
		const data = this.componentRenderData(name)

		return new Listr([
			{
				title: 'Creating directory...',
				task: () => {
					if (!existsSync(compDir)) {
						this.createDir(compDir)
					}
					if (this.separateFiles) {
						compDir = joinPath(compDir, data.names.camel)
						this.createDir(compDir)
					}
				}
			},
			{
				title: 'Creating Component file(s)...',
				task: (ctx) => {
					if (this.separateFiles) {
						this.createFile(data.names.camel, compDir, (this.config.lang.style || 'css'), this.compileTemplate('style.pug', 'component', data))
					}
					this.createFile(data.names.pascal, compDir, 'vue', this.compileTemplate('vue.pug', 'component', data))

					ctx.successMsg = chalk.hex('#13c2c2').bold("\nComponent successfully created!\n")
				}
			}
		])
	}

	/**
	 * Create Directive Tasks
	 */
	private directiveCreationTasks(name: string) {
		return new Listr([
			{
				title: 'Creating Directive',
				task: (ctx) => new Promise((resolve) => {
					setTimeout(() => {
						ctx.successMsg = chalk.hex('#13c2c2').bold("\nDirective successfully created!\n")
						resolve(ctx)
					}, 2500)
				})
			}
		])
	}

	/**
	 * Create Directory
	 */
	private componentRenderData(name: string) {
		return {
			...this.config,
			names: {
				camel: camelCase(name),
				pascal: pascalCase(name),
				kebab: paramCase(name)
			},
			vue3: this.vueVersion === 3
		}
	}

	/**
	 * Create Directory
	 */
	private createDir(path: string) {
		if (existsSync(path)) {
			throw new Error(`A directory named ${name} already exists.`)
		} else {
			mkdirSync(path, { recursive: true })
		}
	}

	/**
	 * Create File
	 */
	private createFile(name: string, dir: string, fileType: string, template: string = '') {
		writeFileSync(this.createFilePath(name, dir, fileType), template)
	}

	/**
	 * Create Directory Path
	 */
	private createDirPath(base: string, name?: string): string {
		return !name
			? joinPath(this.srcDir, base)
			: joinPath(this.srcDir, base, name)
	}

	/**
	 * Create File Path
	 */
	private createFilePath(name: string, dir: string, fileType: string): string {
		return joinPath(dir, `${name}.${fileType}`);
	}

	/**
	 * Compile & render pug template
	 */
	private compileTemplate(name: string, dir: 'component' | 'directive', data: any) {
		return pug.compileFile(resolve(this.templatesDir, dir, name))(data)
	}

	get separateFiles(): boolean {
		const { docFile, separateFiles, specFile, storyBook } = this.config.generate

		return !!(docFile || specFile || storyBook || separateFiles)
	}

	get config() {
		return this._config
	}

	get srcDir(): string {
		return resolve(
			this.config.rootDir || process.cwd(),
			this.config.srcDir || './src/'
		)
	}

	get templatesDir() {
		return this._templatesDir
	}

	get vueVersion() {
		return this._vueVersion
	}
}

export default TemplateCreator
