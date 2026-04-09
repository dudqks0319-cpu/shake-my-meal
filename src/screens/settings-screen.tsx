import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { menuDataset } from '@/src/data/menu-dataset';
import { categoryLabels, type MenuCategory, type PartySize } from '@/src/domain/menu-types';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  toggleCategory,
  toggleExcludedMenuId,
} from '@/src/services/settings-storage';
import { theme } from '@/src/styles/theme';

const partyModes: { label: string; value: PartySize }[] = [
  { label: '혼밥', value: 'solo' },
  { label: '2인', value: 'duo' },
  { label: '단체', value: 'group' },
];

export function SettingsScreen() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const updateSettings = (nextSettings: typeof settings) => {
    setSettings(nextSettings);
    void saveSettings(nextSettings);
  };

  const excludedMenus = menuDataset.filter((menu) => settings.excludedMenuIds.includes(menu.id));
  const filteredMenus = menuDataset
    .filter((menu) => menu.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .slice(0, searchQuery.trim() ? 12 : 8);
  const categoryCount = settings.enabledCategories.length;

  return (
    <ScreenShell contentContainerStyle={styles.container}>
      <Text style={styles.title}>설정</Text>
      <View style={styles.summaryRow}>
        <SummaryChip label={`제외 메뉴 ${excludedMenus.length}개`} />
        <SummaryChip label={`카테고리 ${categoryCount}개 활성`} />
      </View>

      <Section title="NO 리스트">
        <Text style={styles.helperText}>오늘 절대 먹기 싫은 메뉴를 골라서 추천에서 제외해요.</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="메뉴 이름 검색"
          placeholderTextColor={theme.colors.inkSoft}
          style={styles.input}
        />
        <View style={styles.chips}>
          {filteredMenus.map((menu) => {
            const selected = settings.excludedMenuIds.includes(menu.id);

            return (
              <PrimaryButton
                key={menu.id}
                label={`${menu.emoji} ${menu.name}`}
                variant={selected ? 'solid' : 'ghost'}
                onPress={() =>
                  updateSettings({
                    ...settings,
                    excludedMenuIds: toggleExcludedMenuId(settings.excludedMenuIds, menu.id),
                  })
                }
              />
            );
          })}
        </View>
        <View style={styles.selectedWrap}>
          <Text style={styles.selectedTitle}>제외 중인 메뉴</Text>
          {excludedMenus.length > 0 ? (
            <View style={styles.chips}>
              {excludedMenus.map((menu) => (
                <PrimaryButton
                  key={menu.id}
                  label={`${menu.emoji} ${menu.name}`}
                  variant="soft"
                  onPress={() =>
                    updateSettings({
                      ...settings,
                      excludedMenuIds: toggleExcludedMenuId(settings.excludedMenuIds, menu.id),
                    })
                  }
                />
              ))}
            </View>
          ) : (
            <Text style={styles.helperText}>아직 제외한 메뉴가 없어요.</Text>
          )}
        </View>
      </Section>

      <Section title="카테고리 필터">
        <View style={styles.chips}>
          {(Object.keys(categoryLabels) as MenuCategory[]).map((category) => {
            const enabled = settings.enabledCategories.includes(category);

            return (
              <PrimaryButton
                key={category}
                label={categoryLabels[category]}
                variant={enabled ? 'solid' : 'ghost'}
                onPress={() =>
                  updateSettings({
                    ...settings,
                    enabledCategories: toggleCategory(settings.enabledCategories, category),
                  })
                }
              />
            );
          })}
        </View>
      </Section>

      <Section title="인원수">
        <View style={styles.chips}>
          {partyModes.map((mode) => (
            <PrimaryButton
              key={mode.value}
              label={mode.label}
              variant={settings.partySize === mode.value ? 'solid' : 'ghost'}
              onPress={() => updateSettings({ ...settings, partySize: mode.value })}
            />
          ))}
        </View>
      </Section>

      <Section title="옵션">
        <SwitchRow
          label="시간대 자동 감지"
          value={settings.autoTimeDetection}
          onValueChange={(value) => updateSettings({ ...settings, autoTimeDetection: value })}
        />
        <SwitchRow
          label="진동"
          value={settings.hapticsEnabled}
          onValueChange={(value) => updateSettings({ ...settings, hapticsEnabled: value })}
        />
        <Text style={styles.helperText}>효과음은 v1 출시 범위에서 제외하고, 진동 피드백에 집중합니다.</Text>
      </Section>
    </ScreenShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SwitchRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function SummaryChip({ label }: { label: string }) {
  return (
    <View style={styles.summaryChip}>
      <Text style={styles.summaryChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.lg,
  },
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.title,
    fontWeight: '900',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  summaryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
  },
  summaryChipText: {
    color: theme.colors.bowlDeep,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  input: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.ink,
  },
  helperText: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
    lineHeight: 22,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  selectedWrap: {
    gap: theme.spacing.sm,
  },
  selectedTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    fontWeight: '600',
  },
});
