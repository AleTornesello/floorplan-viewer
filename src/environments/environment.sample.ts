import { Environment } from '../app/shared/models/environment.model';

export const environment: Environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    key: 'YOUR_SUPABASE_KEY',
  },
};
