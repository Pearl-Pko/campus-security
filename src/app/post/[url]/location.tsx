import { View, Text } from "react-native";
import React, { useContext } from "react";
import PageWrapper from "@/component/basic/PageWrapper";
import Header from "@/component/basic/Header";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAP_API_KEY } from "@env";
import pallets from "@/constants/pallets";
import { UploadContext, UploadContextType } from "./_layout";
import { useRouter } from "expo-router";

export default function location() {
  const router = useRouter();
  const { setLocation } = useContext(UploadContext) as UploadContextType;

  return (
    <PageWrapper>
      <Header
        title="Add location"
        titleStyle={{ fontWeight: "bold", fontSize: 15 }}
        LeftIcon={<Ionicons name="close" size={25} />}
      />
      <GooglePlacesAutocomplete
        query={{
          key: GOOGLE_MAP_API_KEY,
          type: "establishment",
        }}
        placeholder="Search Location"
        suppressDefaultStyles={true}
        enablePoweredByContainer={false}
        fetchDetails={true}
        keepResultsAfterBlur={true}
      
        onPress={(data, details) => {
          setLocation(details);
          router.back();
        }}
        styles={{
          container: {
            marginTop: 15,
          },
          textInputContainer: {
            backgroundColor: pallets.colors.secondary,
            borderRadius: 10,
            padding: 5,
          },
          listView: {
            // backgroundColor: "red"
            // marginTop: 15,
            gap: 10,
          },
          row: {
            // height: 30
            paddingVertical: 10,
          },
        }}
        renderRow={(data) => {
          return (
            <View>
              <Text style={{ fontWeight: 600 }}>{data.structured_formatting.main_text}</Text>
              <Text style={{ color: "grey" }}>{data.structured_formatting.secondary_text}</Text>
            </View>
          );
        }}
      />
    </PageWrapper>
  );
}
