<<<<<<< HEAD
// App.js
=======
>>>>>>> feat: 本日の成績を日付で自動リセット
import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, FlatList,
  StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RULES = ['ガチエリア', 'ガチヤグラ', 'ガチホコ', 'ガチアサリ'];
const STAGES = [
  'ユノハナ大渓谷', 'ゴンズイ地区', 'ヤガラ市場', 'ナメロウ金属', 'マサバ海峡大橋',
  'キンメダイ美術館', 'マヒマヒリゾート＆スパ', '海女美術大学', 'チョウザメ造船', 'ザトウマーケット',
  'スメーシーワールド', 'ヒラメが丘団地', 'マンタマリア号', 'マテガイ放水路', 'クサヤ温泉',
  'タカアシ経済特区', 'コンブトラック', 'バイガイ亭',  'カジキ空港', 'タラポートショッピングパーク',
  'オヒョウ海運','ナンプラー遺跡','デカライン高架下','リュウグウターミナル','ネギトロ炭鉱'
<<<<<<< HEAD

];

=======
];

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

>>>>>>> feat: 本日の成績を日付で自動リセット
const createInitialData = () => {
  const data = {};
  RULES.forEach(rule => {
    data[rule] = STAGES.map(stage => ({ stage, win: 0, lose: 0 }));
  });
  return data;
};

export default function App() {
  const [stats, setStats] = useState(createInitialData());
  const [selectedRule, setSelectedRule] = useState(RULES[0]);
<<<<<<< HEAD

  // ── 起動時に読み込む ──
=======
  const [dailyStats, setDailyStats] = useState({ win: 0, lose: 0 });
  const [lastUpdatedDate, setLastUpdatedDate] = useState(getToday());

>>>>>>> feat: 本日の成績を日付で自動リセット
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('@stats');
<<<<<<< HEAD
        if (json) setStats(JSON.parse(json));
=======
        const dailyJson = await AsyncStorage.getItem('@dailyStats');
        const dateJson = await AsyncStorage.getItem('@lastUpdatedDate');

        if (json) setStats(JSON.parse(json));

        const today = getToday();

        if (dateJson !== today) {
          // 日付が違う → 本日の成績をリセット
          const resetStats = { win: 0, lose: 0 };
          setDailyStats(resetStats);
          await AsyncStorage.setItem('@dailyStats', JSON.stringify(resetStats));
          await AsyncStorage.setItem('@lastUpdatedDate', today);
          setLastUpdatedDate(today);
        } else {
          // 同じ日付なら保存された値を反映
          if (dailyJson) setDailyStats(JSON.parse(dailyJson));
          setLastUpdatedDate(dateJson);
        }
>>>>>>> feat: 本日の成績を日付で自動リセット
      } catch (e) {
        console.error('読み込みエラー:', e);
      }
    })();
  }, []);

<<<<<<< HEAD
=======

>>>>>>> feat: 本日の成績を日付で自動リセット
  const updateCount = (stageName, key, delta) => {
    setStats(prevStats => {
      const updated = prevStats[selectedRule].map(stage =>
        stage.stage === stageName
          ? { ...stage, [key]: Math.max(0, stage[key] + delta) }
          : stage
      );
      const newStats = { ...prevStats, [selectedRule]: updated };
<<<<<<< HEAD
      // ── 変更があったら保存 ──
=======
>>>>>>> feat: 本日の成績を日付で自動リセット
      AsyncStorage.setItem('@stats', JSON.stringify(newStats)).catch(e =>
        console.error('保存エラー:', e)
      );
      return newStats;
    });
<<<<<<< HEAD
=======

    setDailyStats(prev => {
      const newDaily = {
        ...prev,
        [key]: Math.max(0, prev[key] + delta)
      };
      AsyncStorage.setItem('@dailyStats', JSON.stringify(newDaily)).catch(e =>
        console.error('保存エラー:', e)
      );
      return newDaily;
    });

    const today = getToday();
    if (today !== lastUpdatedDate) {
      setDailyStats({ win: 0, lose: 0 });
      AsyncStorage.setItem('@dailyStats', JSON.stringify({ win: 0, lose: 0 }));
    }
    setLastUpdatedDate(today);
    AsyncStorage.setItem('@lastUpdatedDate', today);
>>>>>>> feat: 本日の成績を日付で自動リセット
  };

  const renderItem = ({ item }) => {
    const total = item.win + item.lose;
    const winRate = total > 0
      ? ((item.win / total) * 100).toFixed(1)
      : '0.0';
    return (
      <View style={styles.stageRow}>
        <Text style={styles.stageName}>{item.stage}</Text>
        <Text style={styles.count}>勝: {item.win}</Text>
        <Button title="＋" onPress={() => updateCount(item.stage, 'win', 1)} />
        <Button title="－" onPress={() => updateCount(item.stage, 'win', -1)} />
        <Text style={styles.count}>負: {item.lose}</Text>
        <Button title="＋" onPress={() => updateCount(item.stage, 'lose', 1)} />
        <Button title="－" onPress={() => updateCount(item.stage, 'lose', -1)} />
        <Text style={styles.rate}>勝率: {winRate}%</Text>
      </View>
    );
  };

<<<<<<< HEAD
  // ── 勝率順ソート ──
=======
>>>>>>> feat: 本日の成績を日付で自動リセット
  const sortedStats = [...stats[selectedRule]].sort((a, b) => {
    const rate = x => x.win + x.lose > 0 ? x.win / (x.win + x.lose) : 0;
    return rate(b) - rate(a);
  });

<<<<<<< HEAD
  return (
    <View style={styles.container}>
=======
  const totalToday = dailyStats.win + dailyStats.lose;
  const todayRate = totalToday > 0
    ? ((dailyStats.win / totalToday) * 100).toFixed(1)
    : '0.0';

  return (
    <View style={styles.container}>
      {/* 本日の成績 */}
      <View style={styles.todayRow}>
        <Text style={styles.todayText}>本日の成績：</Text>
        <Text style={styles.todayText}>勝: {dailyStats.win}</Text>
        <Text style={styles.todayText}>負: {dailyStats.lose}</Text>
        <Text style={styles.todayText}>勝率: {todayRate}%</Text>
      </View>

      {/* ルール切り替えタブ */}
>>>>>>> feat: 本日の成績を日付で自動リセット
      <View style={styles.tabRow}>
        {RULES.map(rule => (
          <TouchableOpacity
            key={rule}
            style={[styles.tab, selectedRule === rule && styles.activeTab]}
            onPress={() => setSelectedRule(rule)}
          >
            <Text style={styles.tabText}>{rule}</Text>
          </TouchableOpacity>
        ))}
      </View>
<<<<<<< HEAD
      <ScrollView>
        <FlatList
          data={sortedStats}
          keyExtractor={item => item.stage}
          renderItem={renderItem}
        />
      </ScrollView>
=======

      <FlatList
  data={sortedStats}
  keyExtractor={item => item.stage}
  renderItem={renderItem}
  contentContainerStyle={{ paddingBottom: 100 }}
/>

>>>>>>> feat: 本日の成績を日付で自動リセット
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
<<<<<<< HEAD
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tab: { padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  activeTab: { backgroundColor: '#2196F3' },
  tabText: { color: '#000', fontWeight: 'bold' },
  stageRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    alignItems: 'center', marginBottom: 10, paddingHorizontal: 10
  },
  stageName: { width: '30%', fontWeight: 'bold' },
  count: { width: '10%', textAlign: 'center' },
  rate: { width: '20%', textAlign: 'right', fontWeight: 'bold' },
=======
  todayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f8ff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  todayText: { fontWeight: 'bold' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  tab: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5
  },
  activeTab: { backgroundColor: '#2196F3' },
  tabText: { color: '#000', fontWeight: 'bold' },
  stageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  stageName: { width: '30%', fontWeight: 'bold' },
  count: { width: '10%', textAlign: 'center' },
  rate: { width: '20%', textAlign: 'right', fontWeight: 'bold' }
>>>>>>> feat: 本日の成績を日付で自動リセット
});
