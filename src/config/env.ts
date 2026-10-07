import Constants from 'expo-constants';

import { parseEnv } from './parseEnv';

export const env = parseEnv(Constants.expoConfig?.extra);
