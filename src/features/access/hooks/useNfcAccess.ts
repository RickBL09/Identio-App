import { useEffect, useState } from 'react';

import { AccessRepository } from '@/repositories/access.repository';
import { nfcService } from '@/services/nfc.service';
import { accessTokenService } from '@/services/access-token.service';

export function useNfcAccess() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNfcSupported, setIsNfcSupported] = useState<boolean | null>(null);
  const [isNfcEnabled, setIsNfcEnabled] = useState<boolean>(false);

  useEffect(() => {
    checkNfcStatus();
    return () => {
      // Limpiar al desmontar
      nfcService.cleanup();
    };
  }, []);

  const checkNfcStatus = async () => {
    try {
      const status = await nfcService.checkStatus();
      setIsNfcSupported(status.isSupported);
      setIsNfcEnabled(status.isEnabled);
    } catch (error) {
      console.error('Error checking NFC status:', error);
      setIsNfcSupported(false);
      setIsNfcEnabled(false);
    }
  };

  const scanAccess = async () => {
    setIsLoading(true);
    try {
      // Verificar estado de NFC antes de escanear
      await checkNfcStatus();

      if (!isNfcSupported) {
        throw new Error('NFC no está soportado en este dispositivo');
      }

      if (!isNfcEnabled) {
        throw new Error('NFC está deshabilitado. Por favor, actívalo en la configuración');
      }

      // Leer tag NFC
      const tag = await nfcService.readTag();
      console.log('NFC Tag detected:', tag);

      // Hacer la llamada al API con los datos del tag
      const response = await AccessRepository.scanNfc();
      
      return response;
    } catch (error) {
      console.error('Error scanning NFC:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const transmitAccessToken = async () => {
    setIsLoading(true);
    try {
      // Verificar estado de NFC antes de transmitir
      await checkNfcStatus();

      if (!isNfcSupported) {
        throw new Error('NFC no está soportado en este dispositivo');
      }

      if (!isNfcEnabled) {
        throw new Error('NFC está deshabilitado. Por favor, actívalo en la configuración');
      }

      // Obtener el token de acceso
      const token = accessTokenService.getAccessToken();
      if (!token) {
        throw new Error('No hay token de acceso válido. Por favor, verifica tu identidad primero.');
      }

      // Transmitir el token vía NFC
      await nfcService.writeAccessToken(token);
      
      console.log('Token transmitido exitosamente vía NFC');
      return { success: true, message: 'Token transmitido exitosamente' };
    } catch (error) {
      console.error('Error transmitting access token:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const openNfcSettings = async () => {
    try {
      await nfcService.openSettings();
    } catch (error) {
      console.error('Error opening NFC settings:', error);
    }
  };

  return {
    isLoading,
    isNfcSupported,
    isNfcEnabled,
    scanAccess,
    transmitAccessToken,
    checkNfcStatus,
    openNfcSettings
  };
}
