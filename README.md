# eslint-plugin-mistertemp

[![Travis build status](http://img.shields.io/travis/lzientek/eslint-plugin-mistertemp/master.svg?style=flat-square)](https://travis-ci.org/lzientek/eslint-plugin-mistertemp)
[![NPM version](http://img.shields.io/npm/v/eslint-plugin-mistertemp.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-mistertemp)

mistertemp eslint

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-mistertemp`:

```
$ npm install eslint-plugin-mistertemp --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-mistertemp` globally.

## Usage

Add `mistertemp` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "mistertemp"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "mistertemp/order-import":  ["error", {
            "ignoreCase": true,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": ["react", "single", "multiple", "all", "none" ]
        }]
    }
}
```

## Supported Rules

* Fill in provided rules here





