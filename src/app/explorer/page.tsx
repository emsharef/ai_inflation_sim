'use client';

import { useState, useMemo } from 'react';
import { ScenarioId, HorizonId } from '@/lib/types';
import { cpiComponents, getMajorGroups, getChildren } from '@/data/cpiComponents';
import { getModifier } from '@/data/aiImpactModifiers';
import { aggregateComponentImpact } from '@/lib/calculations';
import { formatPp, getImpactColor, getConfidenceColor, getHorizonLabel } from '@/lib/formatters';
import { scenarios } from '@/data/scenarios';
import { citations } from '@/data/researchCitations';

interface Combo {
  scenario: ScenarioId;
  horizon: HorizonId;
}

const SCENARIO_OPTIONS: ScenarioId[] = ['conservative', 'moderate', 'transformative'];
const HORIZON_OPTIONS: HorizonId[] = ['1yr', '3yr', '10yr'];

export default function ExplorerPage() {
  const [combos, setCombos] = useState<Combo[]>([
    { scenario: 'conservative', horizon: '10yr' },
    { scenario: 'moderate', horizon: '10yr' },
    { scenario: 'transformative', horizon: '10yr' },
  ]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    return new Set(getMajorGroups().map(g => g.id));
  });
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());

  const majorGroups = useMemo(() => getMajorGroups(), []);

  function updateCombo(index: number, field: 'scenario' | 'horizon', value: string) {
    setCombos(prev => prev.map((c, i) =>
      i === index
        ? { ...c, [field]: value }
        : c
    ));
  }

  function addCombo() {
    if (combos.length >= 3) return;
    const used = new Set(combos.map(c => c.scenario));
    const available = SCENARIO_OPTIONS.find(s => !used.has(s)) || 'conservative';
    setCombos(prev => [...prev, { scenario: available, horizon: '10yr' }]);
  }

  function removeCombo(index: number) {
    if (combos.length <= 2) return;
    setCombos(prev => prev.filter((_, i) => i !== index));
  }

  function toggleGroup(groupId: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  function toggleSub(subId: string) {
    setExpandedSubs(prev => {
      const next = new Set(prev);
      if (next.has(subId)) next.delete(subId);
      else next.add(subId);
      return next;
    });
  }

  function expandAll() {
    const allGroups = majorGroups.map(g => g.id);
    const allSubs: string[] = [];
    for (const g of majorGroups) {
      for (const child of getChildren(g.id)) {
        if (getChildren(child.id).length > 0) {
          allSubs.push(child.id);
        }
      }
    }
    setExpandedGroups(new Set(allGroups));
    setExpandedSubs(new Set(allSubs));
  }

  function collapseAll() {
    setExpandedGroups(new Set());
    setExpandedSubs(new Set());
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#e4e4ef]">Narrative Comparison Viewer</h1>
        <p className="text-xs text-[#606070] mt-0.5">
          Compare AI impact narratives across scenario/horizon combinations for every CPI component
        </p>
      </div>

      {/* Combo selector bar */}
      <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-3">
        <div className="flex items-center gap-3 flex-wrap">
          {combos.map((combo, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-[#0a0a0f] rounded-md px-3 py-2 border-l-2"
              style={{ borderLeftColor: scenarios[combo.scenario].color }}
            >
              <select
                value={combo.scenario}
                onChange={e => updateCombo(i, 'scenario', e.target.value)}
                className="bg-[#1a1a2a] text-[#e4e4ef] text-xs rounded px-2 py-1 border border-[#2a2a3a] outline-none focus:border-[#404060]"
              >
                {SCENARIO_OPTIONS.map(s => (
                  <option key={s} value={s}>{scenarios[s].name}</option>
                ))}
              </select>

              <select
                value={combo.horizon}
                onChange={e => updateCombo(i, 'horizon', e.target.value)}
                className="bg-[#1a1a2a] text-[#e4e4ef] text-xs rounded px-2 py-1 border border-[#2a2a3a] outline-none focus:border-[#404060]"
              >
                {HORIZON_OPTIONS.map(h => (
                  <option key={h} value={h}>{getHorizonLabel(h)}</option>
                ))}
              </select>

              {combos.length > 2 && (
                <button
                  onClick={() => removeCombo(i)}
                  className="text-[#606070] hover:text-red-400 text-xs ml-1 transition-colors"
                  title="Remove combo"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {combos.length < 3 && (
            <button
              onClick={addCombo}
              className="flex items-center gap-1 text-xs text-[#606070] hover:text-[#e4e4ef] bg-[#0a0a0f] border border-dashed border-[#2a2a3a] rounded-md px-3 py-2 transition-colors"
            >
              <span className="text-sm">+</span> Add combo
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button onClick={expandAll} className="text-[10px] text-[#606070] hover:text-[#e4e4ef] transition-colors">
              Expand all
            </button>
            <span className="text-[#2a2a3a]">|</span>
            <button onClick={collapseAll} className="text-[10px] text-[#606070] hover:text-[#e4e4ef] transition-colors">
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Major group accordion */}
      <div className="space-y-2">
        {majorGroups.map(group => {
          const isExpanded = expandedGroups.has(group.id);

          return (
            <div key={group.id} className="bg-[#13131d] border border-[#2a2a3a] rounded-md overflow-hidden">
              {/* Level 0: Group header — clickable toggle */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center px-4 py-3 hover:bg-[#1a1a2a] transition-colors"
              >
                <span className="text-[#606070] text-xs w-4">{isExpanded ? '▾' : '▸'}</span>
                <span className="text-sm font-semibold text-[#e4e4ef] ml-3">{group.name}</span>
                <span className="text-[10px] text-[#606070] tabular-nums ml-2">{group.weight.toFixed(1)}%</span>
              </button>

              {/* Expanded: group narrative + children */}
              {isExpanded && (
                <div className="border-t border-[#2a2a3a]">
                  {/* Group-level narrative cards (no title — already in accordion header) */}
                  <NarrativeCards componentId={group.id} combos={combos} indent={0} />
                  {/* Children: sub-groups and standalone leaves */}
                  <GroupChildren groupId={group.id} combos={combos} expandedSubs={expandedSubs} toggleSub={toggleSub} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Render children of a major group: collapsible sub-groups and standalone leaves */
function GroupChildren({
  groupId,
  combos,
  expandedSubs,
  toggleSub,
}: {
  groupId: string;
  combos: Combo[];
  expandedSubs: Set<string>;
  toggleSub: (id: string) => void;
}) {
  const group = cpiComponents[groupId];
  if (!group) return null;

  const level1Children = getChildren(groupId);
  if (level1Children.length === 0) return null;

  // Categorize level-1 children: intermediates (with children) vs standalone leaves
  const sections: { parent: typeof group | null; leaves: typeof group[] }[] = [];

  for (const child of level1Children) {
    const level2Children = getChildren(child.id);
    if (level2Children.length === 0) {
      const existing = sections.find(s => s.parent === null);
      if (existing) {
        existing.leaves.push(child);
      } else {
        sections.push({ parent: null, leaves: [child] });
      }
    } else {
      sections.push({ parent: child, leaves: level2Children });
    }
  }

  return (
    <div>
      {sections.map((section, si) => {
        if (section.parent) {
          const subExpanded = expandedSubs.has(section.parent.id);

          return (
            <div key={si}>
              {/* Level 1: Sub-group header — collapsible */}
              <button
                onClick={() => toggleSub(section.parent!.id)}
                className="w-full flex items-center pl-8 pr-4 py-2.5 bg-[#0f0f19] hover:bg-[#141420] transition-colors border-t border-[#2a2a3a]/40"
              >
                <span className="text-[#505060] text-[10px] w-3">{subExpanded ? '▾' : '▸'}</span>
                <span className="text-xs font-medium text-[#a0a0b0] ml-2.5">{section.parent.name}</span>
                <span className="text-[10px] text-[#606070] tabular-nums ml-2">{section.parent.weight.toFixed(1)}%</span>
              </button>

              {/* Expanded sub-group: narrative cards (no title) + leaf children */}
              {subExpanded && (
                <div>
                  {/* Sub-group narrative cards — same indent as its header */}
                  <NarrativeCards componentId={section.parent.id} combos={combos} indent={1} />
                  {/* Leaf children — indented further */}
                  {section.leaves.map(leaf => (
                    <LeafRow key={leaf.id} componentId={leaf.id} combos={combos} indent={2} />
                  ))}
                </div>
              )}
            </div>
          );
        }

        // Standalone leaves (level-1 components with no children)
        return (
          <div key={si}>
            {section.leaves.map(leaf => (
              <LeafRow key={leaf.id} componentId={leaf.id} combos={combos} indent={1} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Indent levels: 0 = group (16px), 1 = sub-group (32px), 2 = leaf under sub-group (56px)
const INDENT_PL = [16, 32, 56];

/**
 * Narrative cards for a parent node (group or sub-group).
 * Title is NOT shown — it's already in the accordion header above.
 */
function NarrativeCards({ componentId, combos, indent }: { componentId: string; combos: Combo[]; indent: number }) {
  const data = combos.map(c => aggregateComponentImpact(componentId, c.scenario, c.horizon));
  const pl = INDENT_PL[indent] ?? 16;

  return (
    <div
      className={`${indent === 0 ? 'bg-[#0d0d16]' : 'bg-[#0f0f19]'} border-b border-[#1a1a2a]/60 py-3 pr-4`}
      style={{ paddingLeft: `${pl}px` }}
    >
      <ComboCards combos={combos} data={data} />
    </div>
  );
}

/**
 * A leaf component row: shows its title + narrative cards.
 */
function LeafRow({ componentId, combos, indent }: { componentId: string; combos: Combo[]; indent: number }) {
  const component = cpiComponents[componentId];
  if (!component) return null;

  const data = combos.map(c => {
    const mod = getModifier(componentId, c.scenario, c.horizon);
    return {
      aiImpactPp: mod ? mod.inflationImpactPp * 5 : 0,
      weightShiftPp: mod ? mod.weightShiftPp * 5 : 0,
      confidence: mod?.confidence ?? ('medium' as const),
      explanation: mod?.explanation ?? '',
      citations: mod?.citations ?? [],
    };
  });

  const pl = INDENT_PL[indent] ?? 16;

  return (
    <div className="border-b border-[#1a1a2a]/60 py-3 pr-4" style={{ paddingLeft: `${pl}px` }}>
      {/* Leaf title */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-[#c0c0d0]">{component.name}</span>
        <span className="text-[10px] text-[#606070] tabular-nums">
          {component.weight < 1 ? component.weight.toFixed(2) : component.weight.toFixed(1)}%
        </span>
        {component.seriesId && (
          <span className="text-[10px] text-[#404050] font-mono">{component.seriesId}</span>
        )}
      </div>
      <ComboCards combos={combos} data={data} />
    </div>
  );
}

/** Shared combo card grid used by both parent and leaf rows */
function ComboCards({ combos, data }: {
  combos: Combo[];
  data: { aiImpactPp: number; weightShiftPp: number; confidence: string; explanation: string; citations: string[] }[];
}) {
  return (
    <div className={`grid gap-3 ${combos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {combos.map((combo, ci) => {
        const d = data[ci];
        const hasNarrative = d.explanation && !d.explanation.startsWith('Aggregate of');

        return (
          <div
            key={ci}
            className="bg-[#0a0a0f] rounded p-3 border-l-2"
            style={{ borderLeftColor: scenarios[combo.scenario].color }}
          >
            {/* Combo label */}
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="text-[10px] font-semibold"
                style={{ color: scenarios[combo.scenario].color }}
              >
                {scenarios[combo.scenario].name}
              </span>
              <span className="text-[10px] text-[#606070]">/</span>
              <span className="text-[10px] text-[#606070]">{getHorizonLabel(combo.horizon)}</span>
            </div>

            {/* Metrics row */}
            <div className="flex items-center gap-3 mb-2">
              <div>
                <div className="text-[9px] text-[#606070] uppercase tracking-wider">Impact</div>
                <div className={`text-sm font-bold tabular-nums font-mono ${getImpactColor(d.aiImpactPp)}`}>
                  {formatPp(d.aiImpactPp)}
                </div>
              </div>
              {d.weightShiftPp !== 0 && (
                <div>
                  <div className="text-[9px] text-[#606070] uppercase tracking-wider">Wt shift</div>
                  <div className={`text-xs tabular-nums font-mono ${getImpactColor(-d.weightShiftPp)}`}>
                    {d.weightShiftPp > 0 ? '+' : ''}{d.weightShiftPp.toFixed(2)}pp
                  </div>
                </div>
              )}
              <div className="ml-auto">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                  d.confidence === 'high' ? 'border-emerald-500/30 bg-emerald-500/10' :
                  d.confidence === 'medium' ? 'border-amber-500/30 bg-amber-500/10' :
                  'border-red-500/30 bg-red-500/10'
                } ${getConfidenceColor(d.confidence)}`}>
                  {d.confidence}
                </span>
              </div>
            </div>

            {/* Narrative */}
            {hasNarrative && (
              <p className="text-[11px] text-[#909098] leading-relaxed mb-2">
                {d.explanation}
              </p>
            )}

            {/* Citations */}
            {d.citations.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {d.citations.map(citId => {
                  const cit = citations[citId];
                  return (
                    <span
                      key={citId}
                      className="text-[9px] text-[#606070] bg-[#1a1a2a] rounded px-1.5 py-0.5"
                      title={cit ? cit.title : citId}
                    >
                      {cit ? cit.shortName : citId}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
