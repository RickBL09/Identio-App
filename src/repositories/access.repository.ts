import { AccessService } from '@/services/access.service';
import { AccessApiService } from '@/services/access.api.service';
import { ENV } from '@/constants/env';

export const AccessRepository = {
  scanNfc: () => (ENV.USE_MOCK_API ? AccessService.scanNfc() : AccessApiService.scanNfc()),
};
