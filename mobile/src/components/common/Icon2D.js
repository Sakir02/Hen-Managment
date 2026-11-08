import React from 'react';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Clean 2D Vector Icon Component
 * Enforces flat, modern 2D vector icons throughout the entire application.
 */
export default function Icon2D({ name, size = 20, color = '#2563EB', style }) {
  // Mapping of common semantic names to 2D vector icons
  switch (name) {
    case 'home':
      return <Ionicons name="home-outline" size={size} color={color} style={style} />;
    case 'customers':
    case 'users':
    case 'people':
      return <Ionicons name="people-outline" size={size} color={color} style={style} />;
    case 'hens':
    case 'hen':
    case 'bird':
    case 'rooster':
    case 'marga':
    case 'margee':
      return <MaterialCommunityIcons name="feather" size={size} color={color} style={style} />;
    case 'payments':
    case 'payment':
    case 'billing':
    case 'cash':
    case 'money':
      return <Ionicons name="cash-outline" size={size} color={color} style={style} />;
    case 'card':
    case 'credit-card':
      return <Ionicons name="card-outline" size={size} color={color} style={style} />;
    case 'scale':
    case 'weight':
      return <MaterialCommunityIcons name="scale-bathroom" size={size} color={color} style={style} />;
    case 'search':
      return <Ionicons name="search-outline" size={size} color={color} style={style} />;
    case 'bell':
    case 'notification':
      return <Ionicons name="notifications-outline" size={size} color={color} style={style} />;
    case 'settings':
      return <Ionicons name="settings-outline" size={size} color={color} style={style} />;
    case 'user':
    case 'profile':
      return <Ionicons name="person-outline" size={size} color={color} style={style} />;
    case 'phone':
    case 'call':
      return <Ionicons name="call-outline" size={size} color={color} style={style} />;
    case 'trash':
    case 'delete':
      return <Ionicons name="trash-outline" size={size} color={color} style={style} />;
    case 'edit':
      return <Ionicons name="create-outline" size={size} color={color} style={style} />;
    case 'add':
    case 'plus':
      return <Ionicons name="add" size={size} color={color} style={style} />;
    case 'close':
    case 'clear':
    case 'cross':
      return <Ionicons name="close" size={size} color={color} style={style} />;
    case 'check':
    case 'checkmark':
      return <Ionicons name="checkmark-circle-outline" size={size} color={color} style={style} />;
    case 'check-simple':
      return <Ionicons name="checkmark" size={size} color={color} style={style} />;
    case 'calendar':
      return <Ionicons name="calendar-outline" size={size} color={color} style={style} />;
    case 'camera':
      return <Ionicons name="camera-outline" size={size} color={color} style={style} />;
    case 'image':
    case 'gallery':
      return <Ionicons name="image-outline" size={size} color={color} style={style} />;
    case 'eye':
      return <Ionicons name="eye-outline" size={size} color={color} style={style} />;
    case 'eye-off':
      return <Ionicons name="eye-off-outline" size={size} color={color} style={style} />;
    case 'chat':
      return <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} style={style} />;
    case 'mic':
      return <Ionicons name="mic-outline" size={size} color={color} style={style} />;
    case 'stop':
      return <Ionicons name="stop-circle-outline" size={size} color={color} style={style} />;
    case 'play':
      return <Ionicons name="play-circle-outline" size={size} color={color} style={style} />;
    case 'pause':
      return <Ionicons name="pause-circle-outline" size={size} color={color} style={style} />;
    case 'logout':
      return <Ionicons name="log-out-outline" size={size} color={color} style={style} />;
    case 'help':
    case 'support':
      return <Ionicons name="help-circle-outline" size={size} color={color} style={style} />;
    case 'shield':
    case 'admin':
      return <Ionicons name="shield-checkmark-outline" size={size} color={color} style={style} />;
    case 'rates':
    case 'trending-up':
      return <Ionicons name="trending-up-outline" size={size} color={color} style={style} />;
    case 'history':
    case 'audit':
      return <Ionicons name="time-outline" size={size} color={color} style={style} />;
    case 'back':
      return <Ionicons name="arrow-back-outline" size={size} color={color} style={style} />;
    case 'more':
      return <Ionicons name="grid-outline" size={size} color={color} style={style} />;
    case 'receipt':
      return <Ionicons name="receipt-outline" size={size} color={color} style={style} />;
    case 'lock':
      return <Ionicons name="lock-closed-outline" size={size} color={color} style={style} />;
    case 'key':
      return <Ionicons name="key-outline" size={size} color={color} style={style} />;
    case 'warning':
    case 'alert':
      return <Ionicons name="alert-circle-outline" size={size} color={color} style={style} />;
    case 'info':
      return <Ionicons name="information-circle-outline" size={size} color={color} style={style} />;
    case 'refresh':
    case 'sync':
      return <Ionicons name="sync-outline" size={size} color={color} style={style} />;
    case 'tag':
      return <Ionicons name="pricetag-outline" size={size} color={color} style={style} />;
    case 'document':
      return <Ionicons name="document-text-outline" size={size} color={color} style={style} />;
    case 'sparkles':
      return <Ionicons name="sparkles-outline" size={size} color={color} style={style} />;
    default:
      return <Feather name="circle" size={size} color={color} style={style} />;
  }
}
