import chalk from 'chalk'
import { resolve } from 'path'
import { existsSync } from 'fs-extra'
import commandLineArgs from 'command-line-args'
import TemplateFactory from './TemplateFactory'
import { arguments, config, display, settings } from './config'

try {
	const { options } = commandLineArgs([
		...arguments,
		{ name: 'name', type: String, group: 'options', defaultOption: true }
	])

	if (!Object.keys(options).length || options.help) {
		display()
	} else if (options.config && !existsSync(resolve(process.cwd(), options.config))) {
		display(chalk.red(`{bold NOT_FOUND_EXCEPTION:} Defined configuration file not exists OR supported!`), true)
	} else {
		const { vue } = settings()
		if (!vue) {
			display(chalk.red(`{bold NOT_INSTALLED_EXCEPTION:} VueJS 2 or 3 required!`), true)
		} else {
			display(true)
			TemplateFactory.create(config(options), {
				vue,
				name: options.name,
				directive: options.directive || undefined
			})
		}
	}
} catch (e: any) {
	display(chalk.red(`{bold ${e.name}_EXCEPTION:} ${e.message}`), true)
}


export { ArgumentsList, ConfigOptions, CreatorOptions, SystemSettings } from './config'
