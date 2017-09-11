const rule = require("../order-imports"),
RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("order-imports", rule, {
    valid: [
        "import variable from 'react';",
    ],

    invalid: [
        {
            code: "var invalidVariable = true",
            errors: [ { message: "Unexpected invalid variable." } ]
        },
        {
            code: "var invalidVariable = true",
            errors: [ { message: /^Unexpected.+variable/ } ]
        }
    ]
});