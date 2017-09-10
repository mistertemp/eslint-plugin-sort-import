const registerNode = (context, node, name, imported) => {
    imported.push(node);
console.log(context, node, name, imported);
}

module.exports = {
	meta: {
		docs: {},
		schema: [],
	},
	create: context => {
        let imported = [];
        console.log('cont', context);
		return {
			ImportDeclaration: node => {
				if (node.specifiers.length) { // Ignoring unassigned imports
					const name = node.source.value
					registerNode(context, node, name, imported)
				}
			},
		}
	},
}
