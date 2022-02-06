import chalk from 'chalk'
import inquirer from 'inquirer'

import TemplateCreator from './TemplateCreator'
import { ConfigOptions, CreatorOptions } from './config'

class TemplateFactory {
	/**
	 * Factory to generate the templates
	 */
	static create(config: ConfigOptions, options: CreatorOptions) {
		inquirer.prompt([
			{
				type: 'input',
				name: 'dir',
				default: () => (options.directive ? config.dir.directive : config.dir.component),
				message: 'Directory where ' + (options.directive ? 'Directive' : 'Component') + ' file(s) will be created -- relative to "srcDir": '
			}
		]).then(({ dir }) => {
			if (options.directive) {
				config.dir.directive = dir
			} else {
				config.dir.component = dir
			}

			inquirer
				.prompt([
					{
						type: 'confirm',
						name: 'isSure',
						message: 'Are you sure create ' + (options.directive ? 'Directive' : 'Component') + `: ${options.name}`
					}
				])
				.then(({ isSure }) => {
					if (isSure) {
						if (!options.directive) { // Generate Vue component
							return new TemplateCreator(options.name, 'component', config, options.vue)
						}
						else { // Generate Vue directive
							return new TemplateCreator(options.name, 'directive', config, options.vue)
						}
					} else {
						console.log(chalk.hex('#13c2c2').bold('You canceled!'))
					}
				})
		})
	}
}

export default TemplateFactory
