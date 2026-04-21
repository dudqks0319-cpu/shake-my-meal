import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NoticeCard } from '@/src/components/notice-card';
import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { ingredientTagLabels, priceTierLabels, tasteTagLabels, type IngredientTag, type PriceTier, type TasteTag } from '@/src/domain/menu-types';
import { DEFAULT_FILTER_SETTINGS, loadFilterSettings, saveFilterSettings, toggleArrayValue, type FilterSettings } from '@/src/services/filter-storage';
import { theme } from '@/src/styles/theme';

export function FilterScreen() {
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTER_SETTINGS);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadFilterSettings().then(setFilters);
  }, []);

  const save = async () => {
    const saved = await saveFilterSettings(filters);
    setNotice(saved ? '필터를 저장했어요.' : '필터 저장에 실패했어요.');
  };

  return (
    <ScreenShell>
      <Text accessibilityRole="header" style={styles.title}>필터 설정</Text>
      {notice ? <NoticeCard title="필터 안내" body={notice} tone={notice.includes('실패') ? 'error' : 'success'} /> : null}
      <Section title="제외할 재료">
        <ChipGrid>
          {(Object.keys(ingredientTagLabels) as IngredientTag[]).map((tag) => (
            <PrimaryButton
              key={tag}
              label={ingredientTagLabels[tag]}
              variant={filters.excludedIngredients.includes(tag) ? 'solid' : 'ghost'}
              onPress={() =>
                setFilters((current) => ({
                  ...current,
                  excludedIngredients: toggleArrayValue(current.excludedIngredients, tag),
                }))
              }
            />
          ))}
        </ChipGrid>
      </Section>
      <Section title="선호하는 맛">
        <ChipGrid>
          {(Object.keys(tasteTagLabels) as TasteTag[]).map((tag) => (
            <PrimaryButton
              key={tag}
              label={tasteTagLabels[tag]}
              variant={filters.preferredTastes.includes(tag) ? 'solid' : 'ghost'}
              onPress={() =>
                setFilters((current) => ({
                  ...current,
                  preferredTastes: toggleArrayValue(current.preferredTastes, tag),
                }))
              }
            />
          ))}
        </ChipGrid>
      </Section>
      <Section title="가격대">
        <ChipGrid>
          {(Object.keys(priceTierLabels) as PriceTier[]).map((tier) => (
            <PrimaryButton
              key={tier}
              label={priceTierLabels[tier]}
              variant={filters.priceTiers.includes(tier) ? 'solid' : 'ghost'}
              onPress={() =>
                setFilters((current) => ({
                  ...current,
                  priceTiers: toggleArrayValue(current.priceTiers, tier),
                }))
              }
            />
          ))}
        </ChipGrid>
      </Section>
      <PrimaryButton label="저장하기" onPress={save} />
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

function ChipGrid({ children }: { children: React.ReactNode }) {
  return <View style={styles.chips}>{children}</View>;
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.title,
    fontWeight: '900',
    textAlign: 'center',
    paddingTop: theme.spacing.lg,
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
