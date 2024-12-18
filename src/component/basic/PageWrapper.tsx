import { View, Text, StyleProp, ViewStyle } from 'react-native'
import React from 'react'

export default function PageWrapper({children, style} : React.PropsWithChildren<{style?: StyleProp<ViewStyle>}>) {
  return (
    <View style={[{flex: 1, padding: 15, backgroundColor: "white"}, style]}>
      {children}
    </View>
  )
}