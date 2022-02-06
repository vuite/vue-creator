import type { OptionDefinition } from 'command-line-usage'

export interface CreatorOptions {
	directive?: true;
	name: string;
	vue: 2 | 3;
}

export type ArgumentsList = Iterable<OptionDefinition> | OptionDefinition[]

const _default: OptionDefinition[] = [
	{
		name: 'template',
		type: String,
		group: 'options',
		description: 'set the Component template lang to html/pug'
	},
	{
		name: 'style',
		type: String,
		group: 'options',
		description: 'Set style language to (css, sass, scss, stylus, less)'
	},
	{
		name: 'dir',
		type: String,
		group: 'options',
		description: 'Base Directory for the new component/directive'
	},
	{
		name: 'fileName',
		type: String,
		group: 'options',
		description: 'File name for the new component'
	},
	{
		name: 'config',
		alias: 'c',
		type: String,
		group: 'options',
		description: 'Vue Creator Config File (.json) path'
	},
	{
		name: 'typescript',
		alias: 't',
		type: Boolean,
		group: 'options',
		description: 'Set the script language to TypeScript'
	},
	{
		name: 'directive',
		alias: 'd',
		type: Boolean,
		group: 'options',
		description: 'Generate Vue js directive'
	},
	{
		name: 'help',
		alias: 'h',
		type: Boolean,
		group: 'options',
		description: 'See help'
	},
	{
		name: 'doc',
		type: Boolean,
		group: 'options',
		description: 'Create Docs (.md) file for the component'
	},
	{
		name: 'spec',
		type: Boolean,
		group: 'options',
		description: 'Create Test file for the component'
	},
	{
		name: 'stories',
		type: Boolean,
		group: 'options',
		description: 'Create StoryBook file for the component'
	},
	{
		name: 'separate',
		type: Boolean,
		group: 'options',
		description: 'Create Component blocks in separate files'
	}
]

export default _default
