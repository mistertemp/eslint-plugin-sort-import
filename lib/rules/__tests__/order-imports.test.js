const rule = require("../order-imports"),
RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } });
ruleTester.run("order-imports", rule, {
    valid: [
        "import variable from 'react';\n",
        "import a from 'autre';\n"+
        "import be from 'machin';\n"+
        "import { ab, b, c} from 'truc';"
    ],

    invalid: [
        {
            code: "import b from 'machin';\n"+
                "import react from 'react';\n"+
                "import { ab, bb, c} from 'proptypes';\n",
            errors: [ { message: "Expected 'react' syntax before 'single' syntax." } ]
        },
        {
            code: "import react from 'react';\n"+
                "import { ab, bb, c} from 'proptypes';\n"+
                "import b from 'machin';\n",
            errors: [ { message: "Expected 'single' syntax before 'multiple' syntax." } ]
        },
        {
            code: "import react from 'react';\n"+
                "import b from 'machin';\n"+
                "import { bb, ab, c} from 'proptypes';\n",
            errors: [ { message: "Member 'ab' of the import declaration should be sorted alphabetically." } ]
        },
    ]
});