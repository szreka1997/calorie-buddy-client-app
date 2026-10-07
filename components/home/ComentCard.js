import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import Card from "../UI/Card";
import CommentItem from "./CommentItem";
import { buildDeficitMessages } from "../../utils/goalUtils";
import { StyleSheet } from "react-native";

function CommentCard({
  kcalDeficit,
  proteinDeficit,
  carbsDeficit,
  fatDeficit,
  sugarDeficit,
  addedSugarDeficit,
  accent = false,
}) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messages = buildDeficitMessages(
      kcalDeficit,
      proteinDeficit,
      carbsDeficit,
      fatDeficit,
      sugarDeficit,
      addedSugarDeficit,
    );

    setMessages([...messages]);
  }, [
    kcalDeficit,
    proteinDeficit,
    carbsDeficit,
    fatDeficit,
    sugarDeficit,
    addedSugarDeficit,
  ]);

  return (
    <Card style={styles.container}>
      <ScrollView>
        {messages.map((message, index, array) => {
          return (
            <CommentItem
              key={index}
              item={message}
              isLast={index === array.length - 1}
              accent={accent}
            />
          );
        })}
      </ScrollView>
    </Card>
  );
}

export default CommentCard;

const styles = StyleSheet.create({
  container: {
    maxHeight: 250,
  },
});
