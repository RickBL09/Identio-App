import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View, Linking } from 'react-native';
import { useNfcAccess } from '@/features/access/hooks/useNfcAccess';
import { nfcService } from '@/services/nfc.service';

export default function NfcScanScreen() {
  const {
    isLoading,
    isNfcSupported,
    isNfcEnabled,
    scanAccess,
    checkNfcStatus,
    openNfcSettings
  } = useNfcAccess();
  const [result, setResult] = useState('Sin lectura');
  const [error, setError] = useState<string | null>(null);
  const [isNfcAvailable, setIsNfcAvailable] = useState(true);

  useEffect(() => {
    // Verificar si NFC está disponible en el entorno
    const available = nfcService.isAvailable();
    setIsNfcAvailable(available);
    
    if (available) {
      // Verificar estado de NFC al montar el componente
      checkNfcStatus();
    }
  }, []);

  const getNfcStatusMessage = () => {
    if (!isNfcAvailable) {
      return '⚠️ NFC requiere compilación nativa (EAS Build)';
    }
    if (isNfcSupported === null) {
      return 'Verificando disponibilidad de NFC...';
    }
    if (isNfcSupported === false) {
      return '❌ NFC no está soportado en este dispositivo';
    }
    if (isNfcEnabled === false) {
      return '⚠️ NFC está deshabilitado';
    }
    return '✅ NFC está habilitado y listo';
  };

  const getNfcStatusColor = () => {
    if (!isNfcAvailable) return '#ffa500';
    if (isNfcSupported === null) return '#c3cbe0';
    if (isNfcSupported === false) return '#ff6b6b';
    if (isNfcEnabled === false) return '#ffa500';
    return '#4ade80';
  };

  const openEasBuildDocs = () => {
    Linking.openURL('https://docs.expo.dev/build/introduction/');
  };

  const onScan = async () => {
    try {
      setError(null);
      setResult('Escaneando...');
      
      const response = await scanAccess();
      setResult(
        `${response.allowed ? '✅ Acceso Permitido' : '❌ Acceso Denegado'} en ${response.location_id}`
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Error al escanear NFC';
      setError(errorMessage);
      setResult('Error en el escaneo');
      
      // Si el error es porque NFC está deshabilitado, ofrecer abrir configuración
      if (errorMessage.includes('deshabilitado')) {
        Alert.alert(
          'NFC Deshabilitado',
          'Para usar esta función, necesitas habilitar NFC en la configuración de tu dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Abrir Configuración',
              onPress: () => openNfcSettings()
            }
          ]
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const handleRefreshStatus = async () => {
    await checkNfcStatus();
  };

  const canScan = isNfcAvailable && isNfcSupported === true && isNfcEnabled === true && !isLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escaneo NFC</Text>
      
      {/* Estado del NFC */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Estado del NFC:</Text>
        <Text style={[styles.statusText, { color: getNfcStatusColor() }]}>
          {getNfcStatusMessage()}
        </Text>
        {isNfcSupported === null && isNfcAvailable && (
          <ActivityIndicator size="small" color="#4ade80" style={styles.loader} />
        )}
        {!isNfcAvailable && (
          <Text style={styles.warningText}>
            📱 Estás usando Expo Go. Para usar NFC, necesitas compilar la app con EAS Build.
          </Text>
        )}
      </View>

      {/* Resultado del escaneo */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Resultado:</Text>
        <Text style={styles.resultText}>{result}</Text>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        {!isNfcAvailable && (
          <Pressable
            style={[styles.button, styles.infoButton]}
            onPress={openEasBuildDocs}
          >
            <Text style={styles.buttonText}>📚 Ver Documentación EAS Build</Text>
          </Pressable>
        )}

        {isNfcAvailable && !isNfcEnabled && isNfcSupported && (
          <Pressable
            style={[styles.button, styles.settingsButton]}
            onPress={openNfcSettings}
          >
            <Text style={styles.buttonText}>⚙️ Abrir Configuración NFC</Text>
          </Pressable>
        )}

        {isNfcAvailable && (
          <Pressable
            style={styles.button}
            onPress={handleRefreshStatus}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>🔄 Verificar Estado NFC</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.button, styles.scanButton, !canScan && styles.buttonDisabled]}
          onPress={onScan}
          disabled={!canScan}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '⏳ Escaneando...' : '📱 Iniciar Escaneo'}
          </Text>
        </Pressable>

        <Pressable style={[styles.button, styles.closeButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>❌ Cerrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    color: '#e9eef7',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: '#0f1729',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2b3d6f',
    gap: 8,
  },
  statusLabel: {
    color: '#8b95b0',
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 8,
  },
  resultContainer: {
    backgroundColor: '#0f1729',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2b3d6f',
    gap: 8,
    minHeight: 100,
  },
  resultLabel: {
    color: '#8b95b0',
    fontSize: 14,
    fontWeight: '600',
  },
  resultText: {
    color: '#c3cbe0',
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  warningText: {
    color: '#ffa500',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 12,
  },
  infoButton: {
    backgroundColor: '#1e40af',
    borderColor: '#3b82f6',
  },
  button: {
    borderWidth: 1,
    borderColor: '#2b3d6f',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#0f1729',
  },
  scanButton: {
    backgroundColor: '#1e3a8a',
    borderColor: '#3b82f6',
  },
  settingsButton: {
    backgroundColor: '#854d0e',
    borderColor: '#fbbf24',
  },
  closeButton: {
    backgroundColor: '#1f1f1f',
    borderColor: '#404040',
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#1f1f1f',
  },
  buttonText: {
    color: '#d3dbec',
    fontWeight: '600',
    fontSize: 16,
  },
});
