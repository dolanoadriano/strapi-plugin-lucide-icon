import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'icon',
      plugin: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: getTranslation('icon-picker.label'),
        defaultMessage: "Icon",
      },
      intlDescription: {
        id: getTranslation('icon-picker.description'),
        defaultMessage: "Select any icon",
      },
      icon: PluginIcon,
      components: {
        Input: async () =>
          import('./components/IconPicker').then((module) => ({
            default: module.default,
          }))
      }}
    );
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: getTranslation(data),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};
