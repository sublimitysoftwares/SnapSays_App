import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import "../global.css";

export default function Index() {
  const query = useQuery({ queryKey: ['todos'], queryFn: () => fetch('https://jsonplaceholder.typicode.com/todos/1').then(res => res.json()) })
  // console.log(query.data)
  return (
    <View
      className=" h-full"
    >
      <Text className="text-primary">Sumit gyyy</Text>
    </View>
  );
}
