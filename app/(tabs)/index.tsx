import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { produtos } from '../../src/data/produtos';
import { bebidas } from '../../src/data/bebidas';

export default function App() {
  // ==== GRENCIAMENTO DE ESTADO ====
  // Armazenamos o ID de seleção de produto e bebida que comandam os select inputs (pickers).
  const [produtoId, setProdutoId] = useState(produtos[0].id);
  const [bebidaId, setBebidaId] = useState(bebidas[0].id);
  
  // Controle de visibilidade dos modais de interface e confirmação.
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // ==== DERIVAÇÃO DE VALORES ====
  // Localizamos o objeto completo selecionado no picker local para renderizar as imagens na interface e somar o total.
  const produtoSelecionado = produtos.find((p) => p.id === produtoId);
  const bebidaSelecionada = bebidas.find((b) => b.id === bebidaId);

  // O Total é derivado em tempo real, evitando a criação de novos estados dessincronizados.
  const valorTotal = (produtoSelecionado?.preco || 0) + (bebidaSelecionada?.preco || 0);

  // ==== FUNÇÕES DE AÇÃO UI ====
  
  // Exibimos a tela final de resumo do checkout
  const abrirModal = () => {
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
  };

  // Simula efetivação do pedido para a cozinha, exibindo com curto delay o modal de sucesso.
  const finalizarPedido = () => {
    setModalVisible(false); // Esconde modal de revisão de preço
    setTimeout(() => {
      setSuccessModalVisible(true); // Após curto MS de animação, exibe aviso definitivo
    }, 400);
  };

  const fecharSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../src/assets/logo_WSP_FOOD_Sem_fundo.svg')}
            contentFit="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Faça seu pedido</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comida</Text>
          <View style={styles.pickerContainer}>
            <Picker
              accessibilityRole="combobox"
              accessibilityLabel="Seletor de lanches"
              accessibilityHint="Abre uma lista para você escolher o lanche"
              mode="dialog"
              style={styles.picker}
              itemStyle={{ color: '#FFFFFF' }}
              dropdownIconColor="#E0E0E0"
              selectedValue={produtoId}
              onValueChange={(itemValue) => setProdutoId(itemValue)}
            >
              {produtos.map((p) => (
                <Picker.Item key={p.id} label={p.nome} value={p.id} color="#FFFFFF" />
              ))}
            </Picker>
          </View>
          {produtoSelecionado && (
            <View style={styles.itemDetail}>
              <Image source={produtoSelecionado.imagem} style={styles.image} contentFit="contain" />
              <Text style={styles.price}>R$ {produtoSelecionado.preco.toFixed(2)}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bebida</Text>
          <View style={styles.pickerContainer}>
            <Picker
              accessibilityRole="combobox"
              accessibilityLabel="Seletor de bebidas"
              accessibilityHint="Abre uma lista para você escolher a bebida"
              mode="dialog"
              style={styles.picker}
              itemStyle={{ color: '#FFFFFF' }}
              dropdownIconColor="#E0E0E0"
              selectedValue={bebidaId}
              onValueChange={(itemValue) => setBebidaId(itemValue)}
            >
              {bebidas.map((b) => (
                <Picker.Item key={b.id} label={b.nome} value={b.id} color="#FFFFFF" />
              ))}
            </Picker>
          </View>
          {bebidaSelecionada && (
            <View style={styles.itemDetail}>
              <Image source={bebidaSelecionada.imagem} style={styles.image} contentFit="contain" />
              <Text style={styles.price}>R$ {bebidaSelecionada.preco.toFixed(2)}</Text>
            </View>
          )}
        </View>

        <View style={styles.summarySection} accessibilityLiveRegion="polite">
          <Text style={styles.summaryText}>
            Pedido: {produtoSelecionado?.nome} + {bebidaSelecionada?.nome}
          </Text>
          <Text style={styles.totalText}>Total: R$ {valorTotal.toFixed(2)}</Text>
          
          {/* BOTÃO PARA ABRIR O REVISÃO DE PEDIDOS. Ao clicar aciona 'abrirModal' */}
          <TouchableOpacity onPress={abrirModal} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Revisar pedido completo" accessibilityHint="Abre uma tela com o resumo do seu pedido">
            <LinearGradient
              colors={['#FF007F', '#8A2BE2', '#00FFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Revisar pedido</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Modal Customizado de Confirmação (Resumo antes da aprovação) */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={fecharModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirme seu Pedido</Text>

              <View style={styles.modalItemsInfo}>
                <View style={styles.modalItemRow}>
                  <Text style={styles.modalItemText}>{produtoSelecionado?.nome}</Text>
                  <Text style={styles.modalItemPrice}>R$ {produtoSelecionado?.preco.toFixed(2)}</Text>
                </View>
                <View style={styles.modalItemRow}>
                  <Text style={styles.modalItemText}>{bebidaSelecionada?.nome}</Text>
                  <Text style={styles.modalItemPrice}>R$ {bebidaSelecionada?.preco.toFixed(2)}</Text>
                </View>
              </View>

              <Text style={styles.modalTotalText}>Total a pagar: R$ {valorTotal.toFixed(2)}</Text>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity onPress={fecharModal} style={styles.modalBackButton} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Voltar a tela anterior e cancelar validação" accessibilityHint="Retorna para tela principal e cancela fechamento">
                  <Text style={styles.modalBackButtonText}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={finalizarPedido} activeOpacity={0.8} style={styles.modalConfirmWrap} accessibilityRole="button" accessibilityLabel="Confirmar fechamento do pedido e enviar" accessibilityHint="Envia pedido de forma definitiva para cozinha">
                  <LinearGradient
                    colors={['#FF007F', '#8A2BE2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalConfirmButton}
                  >
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

        {/* Modal de Sucesso */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={fecharSuccessModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { alignItems: 'center', paddingVertical: 40 }]}>
              <Ionicons name="checkmark-circle" size={80} color="#00FFFF" style={{ marginBottom: 20 }} />
              <Text style={styles.modalTitle}>Pedido Confirmado!</Text>
              <Text style={styles.modalSuccessText}>
                Seu pedido foi recebido com sucesso e já está sendo preparado pela nossa cozinha!
              </Text>

              <TouchableOpacity onPress={fecharSuccessModal} activeOpacity={0.8} style={{ width: '100%' }} accessibilityRole="button" accessibilityLabel="Fechar e começar uma nova compra" accessibilityHint="Retorna para tela inicial com seleção zerada">
                <LinearGradient
                  colors={['#FF007F', '#8A2BE2', '#00FFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalConfirmButton}
                >
                  <Text style={styles.buttonText}>Nova Compra</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  logo: {
    height: 70,
    width: '70%',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#8A2BE2',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    overflow: 'hidden',
    minHeight: 48,
    justifyContent: 'center',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: '#1E1E1E',
    minHeight: 48,
  },
  itemDetail: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summarySection: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#E0E0E0',
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF007F',
  },
  button: {
    paddingVertical: 14,
    minHeight: 48,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  /* Estilos do Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    borderColor: '#8A2BE2',
    borderWidth: 1,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalItemsInfo: {
    backgroundColor: '#121212',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  modalItemText: {
    color: '#E0E0E0',
    fontSize: 16,
    flex: 1,
  },
  modalSuccessText: {
    color: '#E0E0E0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  modalItemPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalTotalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF007F',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBackButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingVertical: 12,
    minHeight: 48,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackButtonText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalConfirmWrap: {
    flex: 1,
  },
  modalConfirmButton: {
    paddingVertical: 12,
    minHeight: 48,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
