module.exports = {
    meta: {
        docs: {
            description: "enforce sorted import declarations within modules",
            category: "ECMAScript 6",
            recommended: false
        },
        schema: [{
            type: "object",
            properties: {
                ignoreCase: {
                    type: "boolean"
                },
                memberSyntaxSortOrder: {
                    type: "array",
                    items: {
                        enum: ["react", "none", "all", "multiple", "single"]
                    },
                    uniqueItems: true,
                    minItems: 4,
                    maxItems: 5
                },
                groupOrder: {
                    type: "array",
                    items: {
                        enum: ["external", "internal", "type", "style"]
                    },
                    uniqueItems: true,
                    minItems: 4,
                    maxItems: 5
                },
                ignoreMemberSort: {
                    type: "boolean"
                }
            },
            additionalProperties: false
        }],

        fixable: "code"
    },

    create(context) {

        const configuration = context.options[0] || {},
            ignoreCase = configuration.ignoreCase || false,
            ignoreMemberSort = configuration.ignoreMemberSort || false,
            memberSyntaxSortOrder = configuration.memberSyntaxSortOrder || ["react", "single", "multiple", "all", "none"],
            groupOrder = configuration.groupOrder || ["external", "internal", "type", "style"],
            sourceCode = context.getSourceCode();
        let previousDeclaration = null;


        function usedGroupSyntax(node) {
            if (node.source.value.endsWith(".css") || node.source.value.endsWith(".scss") || node.source.value.endsWith(".less")) {
                return "style";
            } else if (node.source.value.startsWith(".")) {
                return "internal";
            }
            return "external";
        }
    
        function getGroupParameterGroupIndex(node) {
            return groupOrder.indexOf(usedGroupSyntax(node));
        }

        /**
         * Gets the used member syntax style.
         *
         * import "my-module.js" --> none
         * import * as myModule from "my-module.js" --> all
         * import {myMember} from "my-module.js" --> single
         * import {foo, bar} from  "my-module.js" --> multiple
         *
         * @param {ASTNode} node - the ImportDeclaration node.
         * @returns {string} used member parameter style, ["all", "multiple", "single"]
         */
        function usedMemberSyntax(node) {
            if (node.source.value === 'react') {
                return "react";
            } else if (node.specifiers.length === 0) {
                return "none";
            } else if (node.specifiers[0].type === "ImportNamespaceSpecifier") {
                return "all";
            } else if (node.specifiers.length === 1) {
                return "single";
            }
            return "multiple";

        }

        /**
         * Gets the group by member parameter index for given declaration.
         * @param {ASTNode} node - the ImportDeclaration node.
         * @returns {number} the declaration group by member index.
         */
        function getMemberParameterGroupIndex(node) {
            return memberSyntaxSortOrder.indexOf(usedMemberSyntax(node));
        }

        /**
         * Gets the local name of the first imported module.
         * @param {ASTNode} node - the ImportDeclaration node.
         * @returns {?string} the local name of the first imported module.
         */
        function getFirstLocalMemberName(node) {
            if (node.specifiers[0]) {
                return node.specifiers[0].local.name;
            }
            return null;

        }

        return {
            ImportDeclaration(node) {
                if (previousDeclaration) {
                    const currentMemberSyntaxGroupIndex = getMemberParameterGroupIndex(node),
                        previousMemberSyntaxGroupIndex = getMemberParameterGroupIndex(previousDeclaration),
                        currentGroupSyntaxGroupIndex = getGroupParameterGroupIndex(node),
                        previousGroupSyntaxGroupIndex = getGroupParameterGroupIndex(previousDeclaration);
                    let currentLocalMemberName = getFirstLocalMemberName(node),
                        previousLocalMemberName = getFirstLocalMemberName(previousDeclaration);

                    if (ignoreCase) {
                        previousLocalMemberName = previousLocalMemberName && previousLocalMemberName.toLowerCase();
                        currentLocalMemberName = currentLocalMemberName && currentLocalMemberName.toLowerCase();
                    }

                    // When the current declaration uses a different member syntax,
                    // then check if the ordering is correct.
                    // Otherwise, make a default string compare (like rule sort-vars to be consistent) of the first used local member name.
                    if (currentMemberSyntaxGroupIndex !== previousMemberSyntaxGroupIndex) {
                        if (currentMemberSyntaxGroupIndex < previousMemberSyntaxGroupIndex) {
                            context.report({
                                node,
                                message: "Expected '{{syntaxA}}' syntax before '{{syntaxB}}' syntax.",
                                data: {
                                    syntaxA: memberSyntaxSortOrder[currentMemberSyntaxGroupIndex],
                                    syntaxB: memberSyntaxSortOrder[previousMemberSyntaxGroupIndex]
                                }
                            });
                        }
                    } else {
                        if (previousLocalMemberName &&
                            currentLocalMemberName &&
                            currentLocalMemberName < previousLocalMemberName
                        ) {
                            context.report({
                                node,
                                message: "Imports should be sorted alphabetically."
                            });
                        }
                    }
                }

                sortMembers(ignoreMemberSort, node, ignoreCase, context, sourceCode);

                previousDeclaration = node;
            }
        };
    }
};

function sortMembers(ignoreMemberSort, node, ignoreCase, context, sourceCode) {
    if (!ignoreMemberSort) {
        const importSpecifiers = node.specifiers.filter(specifier => specifier.type === "ImportSpecifier");
        const getSortableName = ignoreCase ? specifier => specifier.local.name.toLowerCase() : specifier => specifier.local.name;
        const firstUnsortedIndex = importSpecifiers.map(getSortableName).findIndex((name, index, array) => array[index - 1] > name);
        if (firstUnsortedIndex !== -1) {
            context.report({
                node: importSpecifiers[firstUnsortedIndex],
                message: "Member '{{memberName}}' of the import declaration should be sorted alphabetically.",
                data: {
                    memberName: importSpecifiers[firstUnsortedIndex].local.name
                },
                fix(fixer) {
                    if (importSpecifiers.some(specifier => sourceCode.getCommentsBefore(specifier).length || sourceCode.getCommentsAfter(specifier).length)) {
                        // If there are comments in the ImportSpecifier list, don't rearrange the specifiers.
                        return null;
                    }
                    return fixer.replaceTextRange([importSpecifiers[0].range[0], importSpecifiers[importSpecifiers.length - 1].range[1]], importSpecifiers
                        .slice()
                        .sort((specifierA, specifierB) => {
                            const aName = getSortableName(specifierA);
                            const bName = getSortableName(specifierB);
                            return aName > bName ? 1 : -1;
                        })
                        .reduce((sourceText, specifier, index) => {
                            const textAfterSpecifier = index === importSpecifiers.length - 1 ?
                                "" :
                                sourceCode.getText().slice(importSpecifiers[index].range[1], importSpecifiers[index + 1].range[0]);
                            return sourceText + sourceCode.getText(specifier) + textAfterSpecifier;
                        }, ""));
                }
            });
        }
    }
}