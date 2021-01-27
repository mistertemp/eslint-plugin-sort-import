# eslint-plugin-sort-import

[![Travis build status](http://img.shields.io/travis/mistertemp/eslint-plugin-sort-import/master.svg?style=flat-square)](https://travis-ci.org/mistertemp/eslint-plugin-sort-import)
[![NPM version](http://img.shields.io/npm/v/eslint-plugin-sort-import.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-sort-import)

sort-import eslint

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-sort-import`:

```
$ npm install eslint-plugin-sort-import --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-sort-import` globally.

## Usage

Add `sort-import` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["sort-import"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "sort-import/order-import": [
      "error",
      {
        "ignoreCase": true,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["react", "single", "multiple", "all", "none"]
      }
    ]
  }
}
```

## Supported Rules

- Fill in provided rules here
