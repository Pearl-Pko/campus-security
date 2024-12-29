import { View, Text } from 'react-native'
import React from 'react'
import { useGetAllIncidents, useGetIncident, useGetUserIncidents } from '@/service/incident'
import PostList from '../PostList';

export default function Draft({uid} : {uid: string}) {
  const incidents = useGetUserIncidents(uid, true);

  return (
    <View style={{flex: 1}}>
      <PostList incidents={incidents}/>
    </View>
  )
}