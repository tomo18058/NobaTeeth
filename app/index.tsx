    import { useEffect, useState } from "react";
    import { View, Text, Button, StyleSheet } from "react-native";
    import AsyncStorage from "@react-native-async-storage/async-storage";

    export default function HomeScreen() {
    const [lastBrushed, setLastBrushed] = useState<string | null>(null);
    const [mood, setMood] = useState<number>(0); // 0 = ご機嫌, 100 = 激おこ
    const [message, setMessage] = useState<string>("");

    // 機嫌によるメッセージ生成
    const getMessage = (score: number) => {
        if (score < 20) return "今日も磨いてくれて嬉しいわ😊";
        if (score < 50) return "最近サボってない？🤔";
        if (score < 80) return "ねぇ、本当に磨いてる？？😡";
        return "最悪！虫歯製造機になる気？！😱";
    };

    // 起動時にデータ読み込み
    useEffect(() => {
        (async () => {
        const last = await AsyncStorage.getItem("lastBrushed");
        const moodStr = await AsyncStorage.getItem("mood");
        const moodValue = moodStr ? Number(moodStr) : 0;

        setLastBrushed(last);
        setMood(moodValue);
        setMessage(getMessage(moodValue));
        })();
    }, []);

    // 「磨いた！」ボタン押下
    const onBrush = async () => {
        const now = new Date().toLocaleString();
        await AsyncStorage.setItem("lastBrushed", now);
        await AsyncStorage.setItem("mood", "0"); // ご機嫌に戻す

        setLastBrushed(now);
        setMood(0);
        setMessage(getMessage(0));
    };

    // 機嫌が悪化する処理（後で時間経過で悪化させる）
    const worsenMood = async () => {
        const newMood = Math.min(mood + 10, 100);
        await AsyncStorage.setItem("mood", String(newMood));
        setMood(newMood);
        setMessage(getMessage(newMood));
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>🪥 Brush Bully</Text>

        <Text style={styles.info}>
            最後に磨いた時間：{lastBrushed ?? "まだないよ！"}
        </Text>
        <Text style={styles.mood}>機嫌スコア：{mood}</Text>

        <View style={{ marginTop: 20 }}>
            <Button title="磨いた！" onPress={onBrush} />
        </View>

        <View style={{ marginTop: 40 }}>
            <Text style={styles.message}>{message}</Text>
        </View>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
    },
    mood: {
        fontSize: 16,
        marginTop: 10,
    },
    message: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        maxWidth: 300,
    },
    });
