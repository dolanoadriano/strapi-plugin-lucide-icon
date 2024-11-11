import { PLUGIN_ID } from './../../admin/src/pluginId';
import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'icon',
    plugin: PLUGIN_ID,
    type: 'string',
  });
};

export default register;
