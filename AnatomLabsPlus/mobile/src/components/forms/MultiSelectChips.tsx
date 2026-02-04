import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ChipOption {
  id: string;
  name: string;
  description?: string;
  severity?: string;
}

interface MultiSelectChipsProps {
  title: string;
  options: ChipOption[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  maxSelections?: number;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
  accentColor?: string;
}

const COLORS = {
  background: '#0a0a0a',
  surface: '#1a1a1a',
  surfaceLight: '#2a2a2a',
  primary: '#e74c3c',
  text: '#ffffff',
  textSecondary: '#888888',
  textTertiary: '#666666',
  border: '#333333',
};

export default function MultiSelectChips({
  title,
  options,
  selectedIds,
  onSelectionChange,
  maxSelections,
  collapsible = true,
  initiallyExpanded = false,
  accentColor = COLORS.primary,
}: MultiSelectChipsProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const toggleSelection = (id: string) => {
    const isSelected = selectedIds.includes(id);

    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      // Add to selection (check max limit)
      if (maxSelections && selectedIds.length >= maxSelections) {
        return; // Don't add if at max
      }
      onSelectionChange([...selectedIds, id]);
    }
  };

  const getSeverityColor = (severity?: string): string => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '#e74c3c';
      case 'moderate':
        return '#f39c12';
      case 'low':
        return '#3498db';
      default:
        return accentColor;
    }
  };

  const renderChip = (option: ChipOption) => {
    const isSelected = selectedIds.includes(option.id);
    const chipColor = option.severity ? getSeverityColor(option.severity) : accentColor;

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.chip,
          isSelected && { backgroundColor: chipColor + '30', borderColor: chipColor },
        ]}
        onPress={() => toggleSelection(option.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.chipText,
            isSelected && { color: chipColor },
          ]}
        >
          {option.name}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={chipColor}
            style={styles.chipIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  const selectedCount = selectedIds.length;
  const hasSelections = selectedCount > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={collapsible ? toggleExpand : undefined}
        activeOpacity={collapsible ? 0.7 : 1}
      >
        <View style={styles.headerLeft}>
          {collapsible && (
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={20}
              color={COLORS.textSecondary}
              style={styles.expandIcon}
            />
          )}
          <Text style={styles.title}>{title}</Text>
          {hasSelections && (
            <View style={[styles.countBadge, { backgroundColor: accentColor + '30' }]}>
              <Text style={[styles.countText, { color: accentColor }]}>
                {selectedCount}
              </Text>
            </View>
          )}
        </View>
        {maxSelections && (
          <Text style={styles.maxText}>
            {selectedCount}/{maxSelections}
          </Text>
        )}
      </TouchableOpacity>

      {/* Selected Preview (when collapsed) */}
      {!isExpanded && hasSelections && (
        <View style={styles.selectedPreview}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedIds.map(id => {
              const option = options.find(o => o.id === id);
              if (!option) return null;
              return (
                <View
                  key={id}
                  style={[styles.previewChip, { backgroundColor: accentColor + '20' }]}
                >
                  <Text style={[styles.previewChipText, { color: accentColor }]}>
                    {option.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleSelection(id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={14} color={accentColor} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Options Grid (when expanded) */}
      {(isExpanded || !collapsible) && (
        <View style={styles.chipsContainer}>
          {options.map(renderChip)}
        </View>
      )}
    </View>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
  badge?: string;
}

export function CollapsibleSection({
  title,
  children,
  initiallyExpanded = false,
  badge,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Ionicons
            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
            size={20}
            color={COLORS.textSecondary}
            style={styles.expandIcon}
          />
          <Text style={styles.sectionTitle}>{title}</Text>
          {badge && (
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{badge}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  countBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  maxText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  selectedPreview: {
    marginTop: 4,
    marginBottom: 8,
  },
  previewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  previewChipText: {
    fontSize: 12,
    marginRight: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  chipIcon: {
    marginLeft: 6,
  },
  // CollapsibleSection styles
  sectionContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surfaceLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '30',
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sectionContent: {
    padding: 16,
  },
});
