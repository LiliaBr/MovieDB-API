module.exports = 
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "ignorePatterns": ["node_modules", "dist", "build"],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
	"parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
		"requireConfigFile": false,
    "sourceType": "module"
  },
  "plugins": ["react", "prettier", "import"],
  "rules": {
    "indent": "off",
    "prettier/prettier": [
			"warn", {
				"endOfLine": "auto"
      	}
		],
    //"linebreak-style": [0, "unix"],
    "quotes": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "import/no-unresolved": [2, { "caseSensitive": false }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "import/order": [
      2,
      {
        "groups": [
					[
						"builtin",
						"external"
					],
					[
						"parent",
						"internal",
						"sibling",
						"index",
						"unknown"
					]
				],
        "newlines-between": "always"
      }
    ]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
        "moduleDirectory": ["node_modules", "src/"]
      }
    }
  }
}
