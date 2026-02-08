import { View, Text, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchAllEntries } from '@/services/database/queries';
import { getPhotoUri } from '@/services/storage/photoStorage';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function TimelineScreen() {
  const router = useRouter();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['entries'],
    queryFn: fetchAllEntries,
  });

  const handleCameraPress = () => {
    router.push('/camera');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <View style={styles.container}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>Grain</Text>
          <Pressable onPress={handleCameraPress}>
            <Text style={styles.plusButton}>+</Text>
          </Pressable>
        </View>

        {/* 空状態 */}
        <View style={styles.emptyState}>
          <Pressable onPress={handleCameraPress}>
            <Text style={styles.emptyIcon}>+</Text>
            <Text style={styles.emptyText}>タップして最初の1枚を撮影</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>Grain</Text>
        <Pressable onPress={handleCameraPress}>
          <Text style={styles.plusButton}>+</Text>
        </Pressable>
      </View>

      {/* タイムライン */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/entry/${item.id}`)}>
            <View style={styles.entryCard}>
              {/* 日付 */}
              <Text style={styles.entryDate}>
                {format(new Date(item.entryDate), 'M月d日(E)', { locale: ja })}
              </Text>

              {/* 写真 */}
              <Image
                source={{ uri: getPhotoUri(item.originalPhotoPath) }}
                style={styles.photo}
                resizeMode="cover"
              />

              {/* テキスト */}
              {item.journalText && (
                <Text style={styles.entryText} numberOfLines={1}>
                  {item.journalText}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
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
    paddingTop: 60, // Safe area
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  plusButton: {
    fontSize: 24,
    color: '#000000',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    color: '#000000',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 16,
  },
  entryCard: {
    marginBottom: 24,
  },
  entryDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F0F0F0',
  },
  entryText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    paddingHorizontal: 16,
  },
});
