import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
} from 'react-native';
import { color } from '../../common/color'; // Use your defined color
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import chatIcon from '../../../assets/Image/chat.png';
import callIcon from '../../../assets/Image/phone-call.png';
import emailIcon from '../../../assets/Image/email.png';
import downIcon from '../../../assets/Image/down.png';
import Appheader from '../../component/AppHeader/appheader';
import { Image } from 'react-native';

const CustomerSupport = ({ navigation }) => {
    const openDial = () => {
        Linking.openURL(`tel:+919108800604`);
    };
    const [openIndex, setOpenIndex] = useState(null);

    const openEmail = () => {
        Linking.openURL('mailto:support@groww.in');
    };

    const faqData = [
        {
            question: 'How do I reset my password?',
            answer: 'You can reset your password from the login screen using "Forgot Password" option.',
        },
        {
            question: 'How to withdraw funds?',
            answer: 'Go to the Wallet section and click on "Withdraw", then enter the amount and confirm.',
        },
        {
            question: 'How to update my KYC?',
            answer: 'You can update KYC details under "My Account > KYC Update".',
        },
        {
            question: 'How to delete?',
            answer: 'You can update KYC details under "My Account > KYC Update".',
        },
    ];
    return (
        <View style={styles.container}>
            <Appheader onPress={() => navigation.goBack()} header="Finovate Help" />

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.heading}>Contact us 24x7</Text>

                <View style={styles.contactBox}>
                    <TouchableOpacity style={styles.chatBox}>
                        <Image style={{ height: 25, width: 25, tintColor: 'green' }} source={chatIcon} resizeMode='' />
                        <View style={styles.contactText}>
                            <Text style={styles.contactTitle}>Chat with us</Text>
                            <Text style={styles.contactSubtitle}>Get an instant reply</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.iconBox} onPress={openDial}>
                            <Image style={{ height: 25, width: 25, tintColor: 'green' }} source={callIcon} resizeMode='' />
                            <Text style={styles.subText}>Call us</Text>
                            <Text style={styles.detailText}>+91 9108800604</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconBox} onPress={openEmail}>
                            <Image style={{ height: 25, width: 25, tintColor: 'green' }} source={emailIcon} resizeMode='' />
                            <Text style={styles.subText}>Email us</Text>
                            <Text style={styles.detailText}>support@groww.in</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>FAQs</Text>

                {faqData.map((item, index) => (
                    <View key={index} style={styles.accordionItem}>
                        <TouchableOpacity
                            onPress={() => setOpenIndex(openIndex === index ? null : index)}
                            style={styles.faqHeader}
                        >
                            <Text style={styles.faqQuestion}>{item.question}</Text>
                            <Image style={{ height: 25, width: 25, tintColor: 'green', transform: [{ rotate:openIndex === index? '180deg' :'0deg'}], }} source={downIcon} resizeMode='' />

                        </TouchableOpacity>
                        {openIndex === index && (
                            <Text style={styles.faqAnswer}>{item.answer}</Text>
                        )}
                    </View>
                ))}

                {/* <View style={styles.bottomTabs}>
                    {['Past queries', 'Feedback', 'Grievance'].map((tab, i) => (
                        <TouchableOpacity key={i} style={styles.bottomTab}>
                            <Text style={styles.tabText}>{tab}</Text>
                            <Icon name="chevron-right" size={20} color="white" />
                        </TouchableOpacity>
                    ))}
                </View> */}
            </ScrollView>
        </View>
    );
};

export default CustomerSupport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.color_black,
    },
    heading: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
        marginBottom: 15,
    },
    contactBox: {
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 12,
        marginBottom: 25,
    },
    chatBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    contactText: {
        marginLeft: 15,
    },
    contactTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    contactSubtitle: {
        color: '#aaa',
        fontSize: 13,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconBox: {
        width: '48%',
        backgroundColor: '#2a2a2a',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    subText: {
        color: 'white',
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    detailText: {
        color: '#ccc',
        fontSize: 13,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    faqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    faqText: {
        color: 'white',
        marginLeft: 15,
        fontSize: 15,
    },
    bottomTabs: {
        marginTop: 20,
    },
    bottomTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderTopColor: '#333',
        borderTopWidth: 1,
    },
    tabText: {
        color: 'white',
        fontSize: 14,
    },
    accordionItem: {
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    faqAnswer: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 10,
        lineHeight: 20,
    },

});
