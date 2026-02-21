import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type Props = {
  onPress?: () => void;
  title?: string;
  color?: string;
};

const RedButton: React.FC<Props> = ({ onPress, title = 'Button', color = 'red' }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ color: 'white' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RedButton;