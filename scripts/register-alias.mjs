import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./_alias-hook.mjs', pathToFileURL(`${import.meta.dirname}/`));
