const rule = require("../order-imports"),
    RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester({
    parser: 'babel-eslint'
});

ruleTester.run("order-imports", rule, {
    valid: [
        "import variable from 'react';\n",
        "import a from 'autre';\n" +
        "import be from 'machin';\n" +
        "import { ab, b, c} from 'truc';",
        "import a from 'autre';\n" +
        "import be from './machin';\n" +
        "import { ab, b, c} from './truc';" +
        "import type { bb, bc, bdc} from './truc';",
        {
            code: "import variable from 'react';\n\n" +
                "import a from './autre3';\n\n" +
                "import type be from 'machin';\n\n",
            options: [{
                newLineBetweenGroups: true
            }]
        }
    ],

    invalid: [{
            code: "import b from 'machin';\n" +
                "import react from 'react';\n" +
                "import { ab, bb, c} from 'proptypes';\n",
            errors: [{
                message: "Expected 'react' syntax before 'single' syntax."
            }]
        },
        {
            code: "import react from 'react';\n" +
                "import { ab, bb, c} from 'proptypes';\n" +
                "import b from 'machin';\n",
            errors: [{
                message: "Expected 'single' syntax before 'multiple' syntax."
            }]
        },
        {
            code: "import react from 'react';\n" +
                "import b from 'machin';\n" +
                "import { bb, ab, c} from 'proptypes';\n",
            errors: [{
                message: "Member 'ab' of the import declaration should be sorted alphabetically."
            }]
        },
        {
            code: "import react from 'react';\n" +
                "import b from './machin';\n" +
                "import { ab, c} from 'proptypes';\n",
            errors: [{
                message: "Expected 'external' syntax before 'internal' syntax."
            }]
        },
        {
            code: "import react from 'react';\n" +
                "import type { ab, c} from 'proptypes';\n" +
                "import b from './machin';\n",
            errors: [{
                message: "Expected 'internal' syntax before 'type' syntax."
            }]
        },
        {
            code: "import react from 'react';\n" +
                "import 'proptypes.scss';\n" +
                "import b from './machin';\n",
            errors: [{
                message: "Expected 'internal' syntax before 'style' syntax."
            }]
        },
    ]
});