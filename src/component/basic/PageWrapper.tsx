import { View, Text } from 'react-native'
import React from 'react'

export default function PageWrapper({children} : React.PropsWithChildren) {
  return (
    <View style={{flex: 1, padding: 15, backgroundColor: "white"}}>
      {children}
    </View>
  )
}