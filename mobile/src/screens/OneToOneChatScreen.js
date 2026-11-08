import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AudioModule,
  RecordingPresets,
  createAudioPlayer,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useAdminData } from '../context/AdminDataContext';
import Icon2D from '../components/common/Icon2D';

const BLUE = '#2563EB';
const TEAL = '#0D9488';
const BG = '#F8FAFC';
const BORDER = '#E2E8F0';

const initialMessages = [
  { id: 'm1', text: 'Hello! How can I help you today?', sender: 'other', time: '10:24 AM', type: 'text' },
  { id: 'm2', text: 'Please confirm today’s Marga and Margee standard rates.', sender: 'me', time: '10:26 AM', type: 'text' },
  { id: 'm3', text: 'Rates are updated. You can continue entering hens on the customer ledger.', sender: 'other', time: '10:27 AM', type: 'text' },
];
export default function OneToOneChatScreen({ mode = 'user', currentUser, onBack }) {
  const isAdmin = mode === 'admin';
  const { staffUsers } = useAdminData();

  // Contacts for Admin mode
  const adminContacts = staffUsers && staffUsers.length > 0
    ? staffUsers.filter(u => u.role !== 'Super Admin').map(u => ({
      id: u.id,
      name: u.name,
      role: u.role,
      initials: u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      unread: u.id === 'usr-1' ? 2 : 0,
      preview: u.id === 'usr-1' ? 'Payment entry is updated.' : 'Ready for daily batch intake.',
    }))
    : [
      { id: 'u1', name: 'Vikram Singh', role: 'Field Operator', initials: 'VS', unread: 2, preview: 'Payment entry is updated.' },
      { id: 'u2', name: 'Amit Patel', role: 'Field Operator', initials: 'AP', unread: 0, preview: 'Thank you for the update.' },
      { id: 'u3', name: 'Rahul Parmar', role: 'Field Operator', initials: 'RP', unread: 1, preview: 'Please check today’s mandi rates.' },
    ];

  const [selectedContact, setSelectedContact] = useState(null);
  const [draft, setDraft] = useState('');
  const [messagesByContact, setMessagesByContact] = useState({});
  const [messages, setMessages] = useState(initialMessages);
  const [activePlayingId, setActivePlayingId] = useState(null);

  // Audio Recorder hook from expo-audio (SDK 57)
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder, 250);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.release();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  const activeContact = isAdmin ? selectedContact : { name: 'Hen Management Admin', role: 'Authorized Supervisor', initials: 'JV' };

  const currentMessages = isAdmin
    ? (selectedContact ? messagesByContact[selectedContact.id] || initialMessages : [])
    : messages;

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const message = {
      id: `text-${Date.now()}`,
      text: trimmed,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    if (isAdmin && selectedContact) {
      setMessagesByContact((previous) => ({
        ...previous,
        [selectedContact.id]: [...(previous[selectedContact.id] || initialMessages), message],
      }));
    } else {
      setMessages((previous) => [...previous, message]);
    }
    setDraft('');
  };

  const toggleAudioRecording = async () => {
    try {
      if (recorderState.isRecording) {
        const uri = await audioRecorder.stop();
        if (!uri) {
          Alert.alert('Recording Failed', 'No audio was captured. Please try recording again.');
          return;
        }
        const durationSec = Math.max(1, Math.round((recorderState.durationMillis || 1000) / 1000));
        const formattedDuration = `0:${durationSec < 10 ? '0' : ''}${durationSec}`;
        const message = {
          id: `audio-${Date.now()}`,
          sender: 'me',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'audio',
          audioUri: uri,
          duration: formattedDuration,
        };

        if (isAdmin && selectedContact) {
          setMessagesByContact((previous) => ({
            ...previous,
            [selectedContact.id]: [...(previous[selectedContact.id] || initialMessages), message],
          }));
        } else {
          setMessages((previous) => [...previous, message]);
        }
      } else {
        if (!AudioModule || !AudioModule.requestRecordingPermissionsAsync) {
          Alert.alert('Audio Unavailable', 'Audio recording is not supported in this runtime.');
          return;
        }
        const { granted } = await AudioModule.requestRecordingPermissionsAsync();
        if (!granted) {
          Alert.alert('Permission Required', 'Please enable microphone access in your settings to record audio.');
          return;
        }

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
      }
    } catch (error) {
      Alert.alert('Audio Note Error', error?.message || 'Could not toggle voice note recording.');
    }
  };

  const playAudioMessage = async (messageId, audioUri) => {
    try {
      if (activePlayingId === messageId) {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          setActivePlayingId(null);
        }
        return;
      }

      if (audioPlayerRef.current) {
        audioPlayerRef.current.release();
        audioPlayerRef.current = null;
      }

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      const player = createAudioPlayer(audioUri);
      audioPlayerRef.current = player;
      setActivePlayingId(messageId);

      player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          setActivePlayingId(null);
          player.release();
          audioPlayerRef.current = null;
        }
      });

      player.play();
    } catch (error) {
      setActivePlayingId(null);
      Alert.alert('Playback Error', 'Could not play this recorded voice message.');
    }
  };

  // Admin Contact Selection List View
  if (isAdmin && !selectedContact) {
    return (
      <View style={styles.container}>
        <View style={styles.pageHeadingRow}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon2D name="back" size={20} color={BLUE} />
            </TouchableOpacity>
          ) : null}
          <View>
            <Text style={styles.title}>Private Chats</Text>
            <Text style={styles.subtitle}>One-to-one conversations with field operators</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Only individual User ↔ Admin conversations are supported. Group chats are not available.
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.contactList}>
          {adminContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactRow}
              onPress={() => setSelectedContact(contact)}
              activeOpacity={0.75}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{contact.initials}</Text>
              </View>
              <View style={styles.contactDetails}>
                <View style={styles.contactTitleRow}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.timeText}>Active</Text>
                </View>
                <Text style={styles.previewText} numberOfLines={1}>
                  {contact.preview}
                </Text>
              </View>
              {contact.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{contact.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Active 1-to-1 Chat Thread View
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.chatHeader}>
        <TouchableOpacity
          onPress={() => (isAdmin ? setSelectedContact(null) : onBack?.())}
          style={styles.backButton}
          accessibilityLabel="Back"
        >
          <Icon2D name="back" size={20} color={BLUE} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{activeContact?.initials || 'JV'}</Text>
        </View>
        <View style={styles.headerContact}>
          <Text style={styles.contactName}>{activeContact?.name || 'Hen Management Admin'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Icon2D name="lock" size={12} color="#15803D" /><Text style={styles.onlineText}>Private 1-to-1 conversation</Text></View>
        </View>
      </View>

      <View style={styles.privacyBanner}>
        <Text style={styles.privacyText}>
          This conversation is for you and {isAdmin ? activeContact?.name : 'the authorized Admin'} only.
        </Text>
      </View>

      <ScrollView
        style={styles.messageScroll}
        contentContainerStyle={styles.messageContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateLabel}>TODAY</Text>
        {currentMessages.map((message) => {
          const isMine = message.sender === 'me';
          const isAudio = message.type === 'audio';
          const isPlaying = activePlayingId === message.id;

          return (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                isMine ? styles.myMessageRow : styles.otherMessageRow,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isMine ? styles.myMessageBubble : styles.otherMessageBubble,
                ]}
              >
                {isAudio ? (
                  <TouchableOpacity
                    style={styles.audioBubbleContent}
                    onPress={() => playAudioMessage(message.id, message.audioUri)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.playButtonCircle, isMine && styles.playButtonCircleMine]}>
                      <Icon2D
                        name={isPlaying ? 'pause' : 'play'}
                        size={16}
                        color={isMine ? BLUE : '#FFFFFF'}
                      />
                    </View>
                    <View style={styles.audioDetails}>
                      <View style={styles.audioWaveformRow}>
                        <View style={[styles.waveBar, { height: 8 }, isMine && styles.waveBarMine]} />
                        <View style={[styles.waveBar, { height: 16 }, isMine && styles.waveBarMine]} />
                        <View style={[styles.waveBar, { height: 12 }, isMine && styles.waveBarMine]} />
                        <View style={[styles.waveBar, { height: 20 }, isMine && styles.waveBarMine]} />
                        <View style={[styles.waveBar, { height: 14 }, isMine && styles.waveBarMine]} />
                        <View style={[styles.waveBar, { height: 10 }, isMine && styles.waveBarMine]} />
                        <View style={[styles.waveBar, { height: 18 }, isMine && styles.waveBarMine]} />
                        <View style={[styles.waveBar, { height: 6 }, isMine && styles.waveBarMine]} />
                      </View>
                      <Text style={[styles.audioDurationText, isMine && styles.messageTimeMine]}>
                        Voice message • {message.duration || '0:05'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.messageText, isMine && styles.messageTextMine]}>
                    {message.text}
                  </Text>
                )}

                <Text
                  style={[
                    styles.messageTime,
                    isMine && styles.messageTimeMine,
                  ]}
                >
                  {message.time}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.composer}>
        <TouchableOpacity
          style={[styles.audioButton, recorderState.isRecording && styles.audioButtonRecording]}
          onPress={toggleAudioRecording}
          accessibilityLabel={recorderState.isRecording ? 'Stop recording voice message' : 'Record voice message'}
        >
          <Icon2D
            name={recorderState.isRecording ? 'stop' : 'mic'}
            size={20}
            color={recorderState.isRecording ? '#FFFFFF' : BLUE}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder={recorderState.isRecording ? 'Recording audio...' : 'Write a message...'}
          placeholderTextColor="#94A3B8"
          editable={!recorderState.isRecording}
          multiline
          maxLength={2000}
        />

        <TouchableOpacity
          style={[styles.sendButton, (!draft.trim() || recorderState.isRecording) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!draft.trim() || recorderState.isRecording}
          accessibilityLabel="Send message"
        >
          <Icon2D name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.prototypeNote}>
        {recorderState.isRecording
          ? `Recording voice message • ${Math.max(1, Math.round((recorderState.durationMillis || 0) / 1000))}s • tap stop to send`
          : 'Prototype mode — messages and voice notes stay on this device.'}
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  pageHeadingRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: { color: '#0F172A', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#64748B', fontSize: 13, marginTop: 2 },
  notice: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noticeText: { color: '#1D4ED8', fontSize: 12, lineHeight: 18, fontWeight: '600' },
  contactList: { padding: 16, gap: 10 },
  contactRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: BLUE, fontWeight: '800', fontSize: 15 },
  contactDetails: { flex: 1 },
  contactTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contactName: { color: '#0F172A', fontWeight: '700', fontSize: 15 },
  timeText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  previewText: { color: '#64748B', fontSize: 13, marginTop: 3 },
  unreadBadge: {
    backgroundColor: TEAL,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerContact: { flex: 1 },
  onlineText: { color: TEAL, fontSize: 12, fontWeight: '600', marginTop: 1 },
  privacyBanner: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  privacyText: { color: '#64748B', fontSize: 11, textAlign: 'center', fontWeight: '500' },
  messageScroll: { flex: 1 },
  messageContent: { padding: 16, gap: 12 },
  dateLabel: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  messageRow: { flexDirection: 'row' },
  myMessageRow: { justifyContent: 'flex-end' },
  otherMessageRow: { justifyContent: 'flex-start' },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myMessageBubble: {
    backgroundColor: BLUE,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderBottomLeftRadius: 4,
  },
  messageText: { color: '#0F172A', fontSize: 14, lineHeight: 20 },
  messageTextMine: { color: '#FFFFFF' },
  messageTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  messageTimeMine: { color: '#BFDBFE' },
  audioBubbleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
    minWidth: 160,
  },
  playButtonCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonCircleMine: {
    backgroundColor: '#FFFFFF',
  },
  audioDetails: { flex: 1 },
  audioWaveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 4,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
  },
  waveBarMine: {
    backgroundColor: '#BFDBFE',
  },
  audioDurationText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 8,
  },
  audioButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioButtonRecording: {
    backgroundColor: '#DC2626',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  prototypeNote: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
});
