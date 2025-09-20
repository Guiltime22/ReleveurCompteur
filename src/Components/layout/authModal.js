import React, { useState } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/global/colors';

const { height: screenHeight } = Dimensions.get('window');

const AuthModal = ({ visible, onAuthenticate, onCancel, isLoading }) => {
    const [password, setPassword] = useState(''); // Pré-rempli pour test
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // ✅ Texte visible par défaut

    const handleSubmit = async () => {
        if (!password.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir le mot de passe');
            return;
        }

        try {
            await onAuthenticate(password);
            setPassword(''); // Reset après succès
        } catch (error) {
            Alert.alert('Erreur d\'authentification', error.message || 'Mot de passe incorrect');
        }
    };

    const handleCancel = () => {
        setPassword('');
        onCancel();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <Modal 
            visible={visible} 
            transparent 
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.modal}>
                        {/* ✅ Header plus grand et plus visible */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="lock-closed" size={40} color={COLORS.primary} />
                            </View>
                            <Text style={styles.title}>Authentification</Text>
                            <Text style={styles.subtitle}>Firmware 5.1</Text>
                        </View>
                        
                        {/* ✅ Description plus claire */}
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}>
                                Saisissez le mot de passe de l'équipement pour accéder aux données et fonctionnalités.
                            </Text>
                        </View>
                        
                        {/* ✅ Input amélioré avec visibilité */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Mot de passe</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Saisissez le mot de passe"
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!isPasswordVisible}
                                    autoFocus={true}
                                    onSubmitEditing={handleSubmit}
                                    editable={!isLoading}
                                    returnKeyType="done"
                                />
                                <TouchableOpacity 
                                    style={styles.eyeButton}
                                    onPress={togglePasswordVisibility}
                                    disabled={isLoading}
                                >
                                    <Ionicons 
                                        name={isPasswordVisible ? "eye" : "eye-off"} 
                                        size={24} 
                                        color="#666" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {/* ✅ Boutons plus grands et accessibles */}
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity 
                                style={[styles.button, styles.cancelButton]} 
                                onPress={handleCancel}
                                disabled={isLoading}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelText}>Annuler</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[
                                    styles.button, 
                                    styles.submitButton, 
                                    (!password.trim() || isLoading) && styles.disabledButton
                                ]}
                                onPress={handleSubmit}
                                disabled={isLoading || !password.trim()}
                                activeOpacity={0.7}
                            >
                                {isLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color="white" size="small" />
                                        <Text style={styles.loadingText}>Connexion...</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.submitText}>Se connecter</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* ✅ Info supplémentaire */}
                        <Text style={styles.footerText}>
                            EnerGyria v5.1.0
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        minHeight: screenHeight,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '600',
    },
    descriptionContainer: {
        marginBottom: 25,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        lineHeight: 22,
        marginBottom: 10,
    },
    hint: {
        fontSize: 14,
        textAlign: 'center',
        color: COLORS.warning,
        fontWeight: '600',
        backgroundColor: COLORS.warning + '20',
        padding: 10,
        borderRadius: 8,
    },
    inputContainer: {
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        paddingRight: 60, // Space for eye icon
        fontSize: 18,
        backgroundColor: '#f9f9f9',
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        padding: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 55,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: '#ddd',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    disabledButton: {
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    },
    cancelText: {
        color: '#666',
        fontWeight: '700',
        fontSize: 16,
    },
    submitText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    loadingText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    footerText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        fontStyle: 'italic',
    },
});

export default AuthModal;
