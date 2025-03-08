## 例子
```js
const {JsonEnvConfig, load, autoDef} = require('json5env')


const isProduction = ['production', 'prod'].includes(process.env.NODE_ENV)

const json5envConfig = new JsonEnvConfig()
const isDebug = Boolean(process.env['BUILD_DEBUG'])
const j5env = load(json5envConfig)
const {exec} = autoDef(
    json5envConfig,
    {
        defFileName: 'def.js',
        custom: {
            IS_DEV: !isProduction,
            BUILD_DEBUG: isDebug
        },
        customSetter: j5env.setEnv
    }
)
exec()
// ...
module: {
    rules: [
        {
            test: /\.js$/,
            use: [
                {
                    loader: path.resolve(__dirname, './globalDefConfigLoader.js'),
                    options: {
                        triggerChange: 1
                    }
                }
            ]
        }
    ]
}
// ...
```
