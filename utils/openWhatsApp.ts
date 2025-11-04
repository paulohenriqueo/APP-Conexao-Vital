import { Alert, Linking } from 'react-native';

/**
 * Abre o WhatsApp com o número e mensagem informados.
 * @param phoneNumber Número de telefone no formato internacional (ex: 5511999999999)
 * @param message Mensagem opcional a ser enviada automaticamente
 */
export const openWhatsApp = async (phoneNumber: number | string, message?: string) => {
  try {
    if (!phoneNumber) {
      Alert.alert('Erro', 'Número de telefone não disponível.');
      return;
    }

    const phone = String(phoneNumber).replace(/\D/g, ''); // remove caracteres não numéricos
    let url = `https://api.whatsapp.com/send/?phone=+55${phone}`;

    if (message) {
      url += `&text=${encodeURIComponent(message)}`;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    }
  } catch (error) {
    console.error('Erro ao tentar abrir o WhatsApp:', error);
    Alert.alert('Erro', 'Algo deu errado ao tentar abrir o WhatsApp.');
  }
};
