import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [journalText, setJournalText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // TODO: エントリーデータをフェッチ
  const entry = {
    id,
    entryDate: new Date().toISOString().split('T')[0],
    journalText: '今日も同じ場所から。',
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    // TODO: テキストを保存
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Pressable onPress={handleBack}>
          <Text style={styles.backButton}>{'<'}</Text>
        </Pressable>
        <Text style={styles.title}>
          {format(new Date(entry.entryDate), 'M月d日(E)', { locale: ja })}
        </Text>
        <Pressable onPress={() => {}}>
          <Text style={styles.menuButton}>•••</Text>
        </Pressable>
      </View>

      <ScrollView>
        {/* 写真プレースホルダー */}
        <View style={styles.photoPlaceholder} />

        {/* メタ情報 */}
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>📷 15:24撮影</Text>
        </View>

        {/* ジャーナルテキスト */}
        <View style={styles.textContainer}>
          {isEditing ? (
            <View>
              <TextInput
                style={styles.textInput}
                value={journalText}
                onChangeText={setJournalText}
                placeholder="メモを編集..."
                placeholderTextColor="#999999"
                multiline
                autoFocus
                maxLength={5000}
              />
              <Pressable onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>保存</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => setIsEditing(true)}>
              <Text style={styles.journalText}>
                {entry.journalText || 'メモを追加...'}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    fontSize: 20,
    color: '#000000',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  menuButton: {
    fontSize: 20,
    color: '#000000',
  },
  photoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F0F0F0',
  },
  metaContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  metaText: {
    fontSize: 15,
    color: '#666666',
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  journalText: {
    fontSize: 17,
    color: '#000000',
    lineHeight: 24,
  },
  textInput: {
    fontSize: 17,
    color: '#000000',
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
