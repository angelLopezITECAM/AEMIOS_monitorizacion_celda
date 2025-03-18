import postcssPresetEnv from 'postcss-preset-env';
import postcssNested from 'postcss-nested'

export default {
  plugins: [
    postcssNested(),
    postcssPresetEnv({
      features: {
        'nesting-rules': true,
        'custom-properties': true,
      }
    })
  ],
}