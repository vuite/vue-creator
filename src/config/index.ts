import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import commandLineUsage from 'command-line-usage'

import config, { ConfigOptions } from './userConfig'
import settings, { SystemSettings } from './settings'
import arguments, { ArgumentsList, CreatorOptions } from './arguments'

const sections = {
	banner: {
		raw: true,
		content: figlet.textSync('Vue Creator', {
			font: 'ANSI Shadow',
			horizontalLayout: 'default',
			verticalLayout: 'default'
		})
	},
	options: {
		header: 'Options',
		optionList: arguments,
		tableOptions: {
			columns: [
				{ name: 'option', noWrap: true, padding: { left: '🔥  ', right: '' }, width: 30 },
				{ name: 'description', width: 80 }
			]
		}
	},
	commands: {
		header: 'Synopsis',
		content: [
			'$ vuec <name> [Options]'
		]
	},
	examples: {
		header: 'Examples',
		content: [
			{
				desc: '$ vuec TestComponent -d test-component',
				example: 'Create a vue component in separate files.'
			},
			{
				desc: '$ vuec Example -c config/creator.json',
				example: 'Use different config file instead .vuecrc or vuec.json'
			}
		]
	},
	footer: {
		content: `\n${chalk.bold('Read Docs:')} ${chalk.underline.blue('https://github.com/vuite/vue-creator')}\n`
	}
}

/**
 * Display with banner & footer
 */
function display (content?: commandLineUsage.Content | string | true, error: boolean = false) {
	clear()
	const banner = !error
		? { ...sections.banner, content: chalk.green(sections.banner.content) }
		: { ...sections.banner, content: chalk.red(sections.banner.content) }

	if (!content) {
		console.log(commandLineUsage([banner, sections.commands, sections.options, sections.examples]))
		console.log(sections.footer.content)
	} else if (content === true) {
		console.log(banner.content)
	} else {
		content = typeof content === 'string'
			? { content: content }
			: content

		let secs = !error
			? [banner, content, sections.footer]
			: [banner, content, sections.commands, sections.options, sections.examples]

		console.log(commandLineUsage(secs))
		console.log(sections.footer.content)
	}
}

export {
	arguments,
	config,
	settings,
	display
}

export type {
	ArgumentsList,
	ConfigOptions,
	CreatorOptions,
	SystemSettings
}
