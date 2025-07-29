// App.js
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

];

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

  // ── 起動時に読み込む ──
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('@stats');
        if (json) setStats(JSON.parse(json));
      } catch (e) {
        console.error('読み込みエラー:', e);
      }
    })();
  }, []);

  const updateCount = (stageName, key, delta) => {
    setStats(prevStats => {
      const updated = prevStats[selectedRule].map(stage =>
        stage.stage === stageName
          ? { ...stage, [key]: Math.max(0, stage[key] + delta) }
          : stage
      );
      const newStats = { ...prevStats, [selectedRule]: updated };
      // ── 変更があったら保存 ──
      AsyncStorage.setItem('@stats', JSON.stringify(newStats)).catch(e =>
        console.error('保存エラー:', e)
      );
      return newStats;
    });
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

  // ── 勝率順ソート ──
  const sortedStats = [...stats[selectedRule]].sort((a, b) => {
    const rate = x => x.win + x.lose > 0 ? x.win / (x.win + x.lose) : 0;
    return rate(b) - rate(a);
  });

  return (
    <View style={styles.container}>
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
      <ScrollView>
        <FlatList
          data={sortedStats}
          keyExtractor={item => item.stage}
          renderItem={renderItem}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
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
});
