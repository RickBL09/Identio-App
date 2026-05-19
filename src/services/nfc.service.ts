import { Platform } from 'react-native';

// Importación condicional para evitar errores en Expo Go
let NfcManager: any = null;
let NfcTech: any = null;
let Ndef: any = null;

try {
  const nfcModule = require('react-native-nfc-manager');
  NfcManager = nfcModule.default;
  NfcTech = nfcModule.NfcTech;
  Ndef = nfcModule.Ndef;
} catch (error) {
  console.warn('react-native-nfc-manager no está disponible. NFC no funcionará en Expo Go.');
}

export interface NfcStatus {
  isSupported: boolean;
  isEnabled: boolean;
}

export interface TagEvent {
  id?: string;
  techTypes?: string[];
  type?: string;
  [key: string]: any;
}

export class NfcService {
  private static instance: NfcService;
  private isInitialized = false;
  private isNfcAvailable = false;

  private constructor() {
    this.isNfcAvailable = NfcManager !== null && Platform.OS !== 'web';
  }

  static getInstance(): NfcService {
    if (!NfcService.instance) {
      NfcService.instance = new NfcService();
    }
    return NfcService.instance;
  }

  /**
   * Verifica si NFC está disponible en el entorno actual
   */
  isAvailable(): boolean {
    return this.isNfcAvailable;
  }

  /**
   * Inicializa el servicio NFC
   */
  async initialize(): Promise<void> {
    if (!this.isNfcAvailable) {
      throw new Error('NFC no está disponible en este entorno. Necesitas compilar la app nativa.');
    }

    if (this.isInitialized) {
      return;
    }

    try {
      await NfcManager.start();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing NFC:', error);
      throw new Error('No se pudo inicializar el servicio NFC');
    }
  }

  /**
   * Verifica el estado del NFC en el dispositivo
   */
  async checkStatus(): Promise<NfcStatus> {
    if (!this.isNfcAvailable) {
      return { isSupported: false, isEnabled: false };
    }

    try {
      const isSupported = await NfcManager.isSupported();
      let isEnabled = false;

      if (isSupported) {
        isEnabled = await NfcManager.isEnabled();
      }

      return { isSupported, isEnabled };
    } catch (error) {
      console.error('Error checking NFC status:', error);
      return { isSupported: false, isEnabled: false };
    }
  }

  /**
   * Lee un tag NFC
   */
  async readTag(): Promise<TagEvent> {
    if (!this.isNfcAvailable) {
      throw new Error('NFC no está disponible. Compila la app con EAS Build para usar NFC.');
    }

    try {
      // Asegurar que NFC está inicializado
      await this.initialize();

      // Solicitar tecnología NFC
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Obtener el tag
      const tag = await NfcManager.getTag();

      if (!tag) {
        throw new Error('No se detectó ningún tag NFC');
      }

      return tag;
    } catch (error) {
      console.error('Error reading NFC tag:', error);
      throw error;
    } finally {
      // Siempre cancelar la solicitud de tecnología
      await this.cancelRequest();
    }
  }

  /**
   * Escribe un token de acceso en un tag NFC
   * @param token El token de acceso a escribir
   */
  async writeAccessToken(token: string): Promise<void> {
    if (!this.isNfcAvailable) {
      throw new Error('NFC no está disponible. Compila la app con EAS Build para usar NFC.');
    }

    try {
      // Asegurar que NFC está inicializado
      await this.initialize();

      // Solicitar tecnología NFC para escritura
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Crear mensaje NDEF con el token
      const bytes = Ndef.encodeMessage([
        Ndef.textRecord(token)
      ]);

      if (!bytes) {
        throw new Error('No se pudo codificar el mensaje NDEF');
      }

      // Escribir en el tag
      await NfcManager.ndefHandler.writeNdefMessage(bytes);

      console.log('Token escrito exitosamente en el tag NFC');
    } catch (error) {
      console.error('Error writing to NFC tag:', error);
      throw error;
    } finally {
      // Siempre cancelar la solicitud de tecnología
      await this.cancelRequest();
    }
  }

  /**
   * Cancela la solicitud de tecnología NFC actual
   */
  async cancelRequest(): Promise<void> {
    if (!this.isNfcAvailable) {
      return;
    }

    try {
      await NfcManager.cancelTechnologyRequest();
    } catch (error) {
      // Ignorar errores al cancelar
      console.debug('Error canceling NFC request:', error);
    }
  }

  /**
   * Abre la configuración de NFC del dispositivo
   */
  async openSettings(): Promise<void> {
    if (!this.isNfcAvailable) {
      throw new Error('NFC no está disponible en este entorno');
    }

    try {
      await NfcManager.goToNfcSetting();
    } catch (error) {
      console.error('Error opening NFC settings:', error);
      throw new Error('No se pudo abrir la configuración de NFC');
    }
  }

  /**
   * Limpia y cierra el servicio NFC
   */
  async cleanup(): Promise<void> {
    if (!this.isNfcAvailable) {
      return;
    }

    try {
      await this.cancelRequest();
      this.isInitialized = false;
    } catch (error) {
      console.error('Error cleaning up NFC service:', error);
    }
  }
}

export const nfcService = NfcService.getInstance();

// Made with Bob
