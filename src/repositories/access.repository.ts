import { AccessApiService } from '@/services/access.api.service';

export const AccessRepository = {
  scanNfc: () => AccessApiService.scanNfc(),
};
