import { CRITICAL_ONLY_DECISION } from '@/constants/signals/criticalOnlyDecision';
import { strategiesFor } from '@/utils/signals/strategies';
import { formatValue } from '@/utils/signals/valueFormat';
import { SourcePill } from '../chips/source-pill';
import { StrategyPicker } from '../review-workspace/strategy-picker';
import { DecisionCard } from '../decision-card/decision-card';
import { FilterSheet, countActiveFilters, type FilterState } from '../filter-sheet';
import { useState, useMemo } from 'react';
import styles from './design-system-page.module.scss';

const mockDecision = CRITICAL_ONLY_DECISION;
const strategies = strategiesFor(mockDecision);
const f = formatValue({ cents: mockDecision.valueCents, kind: mockDecision.valueKind, cadence: mockDecision.cadence });

function ColorSwatch({ name, hex, varName }: { name: string; hex: string; varName?: string }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.swatchColor} style={{ background: hex }} />
      <div className={styles.swatchInfo}>
        <span className={styles.swatchName}>{name}</span>
        <span className={styles.swatchHex}>{hex}</span>
        {varName && <span className={styles.swatchVar}>{varName}</span>}
      </div>
    </div>
  );
}

function TokenRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.tokenRow}>
      <span className={styles.tokenLabel}>{label}</span>
      <span className={styles.tokenValue}>{value}</span>
    </div>
  );
}

function FlowNode({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.flowNode}>
      <div className={styles.flowNodeLabel}>{label}</div>
      <div className={styles.flowNodeContent}>{children}</div>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className={styles.flowArrow}>
      <span className={styles.flowArrowLine}>→</span>
      <span className={styles.flowArrowLabel}>{label}</span>
    </div>
  );
}

export function DesignSystemPage() {
  const [selectedStrategyId, setSelectedStrategyId] = useState(strategies.find((s) => s.recommended)?.id ?? strategies[0]?.id ?? '');
  const [customInstruction, setCustomInstruction] = useState('');
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ sources: [], domains: [], window: 'any', categories: [] });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Signals Design System & Flow</h1>
        <p className={styles.pageSubtitle}>ASIN B0CH3HSSLZ — Crazy Cups Decaf Island Rum Coconut K-Cups, 22ct</p>
      </div>

      <div className={styles.horizontalScroll}>
        {/* SECTION 1: Page Layout — No Card Selected */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>01</span>
            <h2 className={styles.sectionTitle}>Page Layout — No Card Selected</h2>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.pageFrame}>
              {/* Left Column */}
              <div className={styles.leftCol}>
                <div className={styles.tabBar}>
                  <div className={`${styles.tab} ${styles.tabActive}`}>All<span className={styles.tabCount}>1</span></div>
                  <div className={styles.tab}>Critical<span className={styles.tabCount}>1</span></div>
                  <div className={styles.tab}>High</div>
                  <div className={styles.tab}>Medium</div>
                  <div className={styles.tab}>Low</div>
                </div>
                <div className={styles.searchBar}>
                  <input className={styles.searchInput} placeholder="Search signals…" readOnly />
                  <button className={styles.filterBtn} onClick={() => setFilterOpen(true)}>Filters{countActiveFilters(filters) > 0 && ` (${countActiveFilters(filters)})`}</button>
                </div>
                <div className={styles.cardList}>
                  <DecisionCard decision={mockDecision} isSelected={false} onSelect={() => {}} />
                </div>
              </div>
              {/* Right Column */}
              <div className={styles.rightCol}>
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📋</div>
                  <h3 className={styles.emptyTitle}>Select a signal to review</h3>
                  <p className={styles.emptyText}>Choose a signal from the left to view its details and take action.</p>
                </div>
              </div>
            </div>
          </div>
          {filterOpen && <FilterSheet filters={filters} onChange={setFilters} onClose={() => setFilterOpen(false)} />}
        </div>

        {/* SECTION 2: Page Layout — Card Selected */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>02</span>
            <h2 className={styles.sectionTitle}>Page Layout — Card Selected</h2>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.pageFrame}>
              {/* Left Column */}
              <div className={styles.leftCol}>
                <div className={styles.tabBar}>
                  <div className={`${styles.tab} ${styles.tabActive}`}>All<span className={styles.tabCount}>1</span></div>
                  <div className={styles.tab}>Critical<span className={styles.tabCount}>1</span></div>
                  <div className={styles.tab}>High</div>
                  <div className={styles.tab}>Medium</div>
                  <div className={styles.tab}>Low</div>
                </div>
                <div className={styles.searchBar}>
                  <input className={styles.searchInput} placeholder="Search signals…" readOnly />
                  <button className={styles.filterBtn}>Filters</button>
                </div>
                <div className={styles.cardList}>
                  <DecisionCard decision={mockDecision} isSelected={true} onSelect={() => {}} />
                </div>
              </div>
              {/* Right Column */}
              <div className={styles.rightCol}>
                <div className={styles.workspaceMock}>
                  {/* Header */}
                  <div className={styles.wsHeader}>
                    <SourcePill decision={mockDecision} size="sm" />
                  </div>
                  {/* Body */}
                  <div className={styles.wsBody}>
                    <div className={styles.wsSummary}>{mockDecision.insightDetail}</div>
                    <div className={styles.wsEyebrow}>WHY IT MATTERS</div>
                    {f && (
                      <div className={styles.wsValueCard}>
                        <span className={styles.wsValueLabel}>
                          {mockDecision.valueKind === 'at_risk' ? 'Protect' : ''}
                        </span>
                        <span className={styles.wsValueAmount}>{f.text}</span>
                      </div>
                    )}
                    <div className={styles.wsExplanation}>{mockDecision.valueBasis}</div>
                    {mockDecision.detailSections && mockDecision.detailSections.filter((s) => s.heading !== 'AI Summary').map((s, i) => (
                      <div key={i} className={styles.wsDetailSection}>
                        <div className={styles.wsDetailHeading}>{s.heading}</div>
                        <div className={styles.wsDetailContent}>{s.content}</div>
                      </div>
                    ))}
                    {/* AI Summary */}
                    <div className={styles.wsCollapsible}>
                      <button className={styles.wsCollapsibleHeader} onClick={() => setSummaryExpanded(!summaryExpanded)} type="button">
                        AI Summary
                        <span className={`${styles.wsChevron} ${summaryExpanded ? styles.wsChevronOpen : ''}`}>▾</span>
                      </button>
                      {summaryExpanded && (
                        <div className={styles.wsCollapsibleBody}>
                          {mockDecision.detailSections?.find((s) => s.heading === 'AI Summary')?.content}
                        </div>
                      )}
                    </div>
                    <div className={styles.wsEyebrow}>CHOOSE YOUR STRATEGY</div>
                    <div className={styles.wsStrategyWrapper}>
                      <StrategyPicker strategies={strategies} selectedId={selectedStrategyId} onSelect={setSelectedStrategyId} customValue={customInstruction} onCustomChange={setCustomInstruction} />
                    </div>
                  </div>
                  {/* Footer */}
                  <div className={styles.wsFooter}>
                    <button className={styles.wsExecuteBtn}>✓ Execute: Escalate to Vendor Manager</button>
                    <button className={styles.wsDismissBtn}>⊘ Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Component Library */}
        <div className={styles.sectionWide}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>03</span>
            <h2 className={styles.sectionTitle}>Component Library</h2>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.componentGrid}>
              {/* Decision Card States */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Decision Card</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Normal</span>
                    <DecisionCard decision={mockDecision} isSelected={false} onSelect={() => {}} />
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Selected</span>
                    <DecisionCard decision={mockDecision} isSelected={true} onSelect={() => {}} />
                  </div>
                </div>
              </div>

              {/* Source Pill */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Source Pill</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Small</span>
                    <SourcePill decision={mockDecision} size="sm" />
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Large</span>
                    <SourcePill decision={mockDecision} size="lg" />
                  </div>
                </div>
              </div>

              {/* Strategy Picker */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Strategy Picker</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItemWide}>
                    <span className={styles.componentLabel}>Normal</span>
                    <StrategyPicker strategies={strategies} selectedId={selectedStrategyId} onSelect={setSelectedStrategyId} customValue={customInstruction} onCustomChange={setCustomInstruction} />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Buttons</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Execute</span>
                    <button className={styles.wsExecuteBtn}>✓ Execute: Escalate to Vendor Manager</button>
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Dismiss</span>
                    <button className={styles.wsDismissBtn}>⊘ Dismiss</button>
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Close</span>
                    <button className={styles.wsCloseBtn}>✕</button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Tabs</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Active</span>
                    <div className={`${styles.tab} ${styles.tabActive}`}>All<span className={styles.tabCount}>1</span></div>
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Inactive</span>
                    <div className={styles.tab}>Critical<span className={styles.tabCount}>1</span></div>
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Empty</span>
                    <div className={styles.tab}>High</div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Search Bar</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItemWide}>
                    <span className={styles.componentLabel}>Default</span>
                    <input className={styles.searchInput} placeholder="Search signals…" readOnly />
                  </div>
                </div>
              </div>

              {/* Filter Button */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Filter Button</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>No Filters</span>
                    <button className={styles.filterBtn}>Filters</button>
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>With Filters</span>
                    <button className={styles.filterBtn}>Filters (2)</button>
                  </div>
                </div>
              </div>

              {/* Workspace Sections */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Workspace Sections</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Eyebrow</span>
                    <div className={styles.wsEyebrow}>WHY IT MATTERS</div>
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Value Card</span>
                    {f && (
                      <div className={styles.wsValueCard}>
                        <span className={styles.wsValueLabel}>Protect</span>
                        <span className={styles.wsValueAmount}>{f.text}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Detail Heading</span>
                    <div className={styles.wsDetailHeading}>Business Impact</div>
                  </div>
                </div>
              </div>

              {/* Collapsible */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Collapsible Section</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Collapsed</span>
                    <div className={styles.wsCollapsible}>
                      <button className={styles.wsCollapsibleHeader} type="button">
                        AI Summary
                        <span className={styles.wsChevron}>▾</span>
                      </button>
                    </div>
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Expanded</span>
                    <div className={styles.wsCollapsible}>
                      <button className={styles.wsCollapsibleHeader} type="button">
                        AI Summary
                        <span className={`${styles.wsChevron} ${styles.wsChevronOpen}`}>▾</span>
                      </button>
                      <div className={styles.wsCollapsibleBody}>
                        {mockDecision.detailSections?.find((s) => s.heading === 'AI Summary')?.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className={styles.componentGroup}>
                <h3 className={styles.groupTitle}>Badges</h3>
                <div className={styles.componentRow}>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Critical</span>
                    <span className={styles.criticalBadge}>● CRITICAL</span>
                  </div>
                  <div className={styles.componentItem}>
                    <span className={styles.componentLabel}>Status Badge</span>
                    <span className={styles.statusBadge}>open</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Color Palette & Design Tokens */}
        <div className={styles.sectionTokens}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>04</span>
            <h2 className={styles.sectionTitle}>Color Palette & Design Tokens</h2>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.tokensGrid}>
              {/* Colors */}
              <div className={styles.tokenGroup}>
                <h3 className={styles.groupTitle}>Colors</h3>
                <div className={styles.colorGrid}>
                  <ColorSwatch name="Primary" hex="#77469b" varName="$primary-color" />
                  <ColorSwatch name="Primary Variant" hex="#9a5cbf" varName="$primary-color-variant-1" />
                  <ColorSwatch name="Alert" hex="#e86a3a" varName="$alert-color" />
                  <ColorSwatch name="Error" hex="#dc3545" varName="$error-color" />
                  <ColorSwatch name="Success" hex="#429488" varName="$success-color" />
                  <ColorSwatch name="Main Text" hex="#23272d" varName="$main-text" />
                  <ColorSwatch name="Sub Text 1" hex="#676f7e" varName="$sub-text-1" />
                  <ColorSwatch name="Sub Text 2" hex="#9ca3af" varName="$sub-text-2" />
                  <ColorSwatch name="Sub Text 3" hex="#d1d5db" varName="$sub-text-3" />
                  <ColorSwatch name="Background" hex="#f3f5fa" varName="$background-color" />
                  <ColorSwatch name="Foreground" hex="#ffffff" varName="$foreground-color" />
                  <ColorSwatch name="Border 4" hex="#e1e4e8" varName="$border-color-4" />
                  <ColorSwatch name="Icon BG" hex="#f5f6f7" varName="$icon-background-color" />
                </div>
              </div>

              {/* Spacing */}
              <div className={styles.tokenGroup}>
                <h3 className={styles.groupTitle}>Spacing</h3>
                <div className={styles.spacingGrid}>
                  <TokenRow label="$spacing-0" value="0px" />
                  <TokenRow label="$spacing-2" value="2px" />
                  <TokenRow label="$spacing-4" value="4px" />
                  <TokenRow label="$spacing-8" value="8px" />
                  <TokenRow label="$spacing-10" value="10px" />
                  <TokenRow label="$spacing-12" value="12px" />
                  <TokenRow label="$spacing-16" value="16px" />
                  <TokenRow label="$spacing-20" value="20px" />
                  <TokenRow label="$spacing-40" value="40px" />
                </div>
              </div>

              {/* Font Sizes */}
              <div className={styles.tokenGroup}>
                <h3 className={styles.groupTitle}>Font Sizes</h3>
                <div className={styles.spacingGrid}>
                  <TokenRow label="$font-size-9" value="9px" />
                  <TokenRow label="$font-size-10" value="10px" />
                  <TokenRow label="$font-size-12" value="12px" />
                  <TokenRow label="$font-size-14" value="14px" />
                </div>
              </div>

              {/* Font Weights */}
              <div className={styles.tokenGroup}>
                <h3 className={styles.groupTitle}>Font Weights</h3>
                <div className={styles.spacingGrid}>
                  <TokenRow label="$font-weight-400" value="400" />
                  <TokenRow label="$font-weight-500" value="500" />
                  <TokenRow label="$font-weight-600" value="600" />
                  <TokenRow label="$font-weight-700" value="700" />
                </div>
              </div>

              {/* Border Radius */}
              <div className={styles.tokenGroup}>
                <h3 className={styles.groupTitle}>Border Radius</h3>
                <div className={styles.radiusGrid}>
                  <div className={styles.radiusItem}>
                    <div className={styles.radiusPreview} style={{ borderRadius: 4 }} />
                    <span>0.4rem</span>
                  </div>
                  <div className={styles.radiusItem}>
                    <div className={styles.radiusPreview} style={{ borderRadius: 6 }} />
                    <span>0.6rem</span>
                  </div>
                  <div className={styles.radiusItem}>
                    <div className={styles.radiusPreview} style={{ borderRadius: 8 }} />
                    <span>0.8rem</span>
                  </div>
                  <div className={styles.radiusItem}>
                    <div className={styles.radiusPreview} style={{ borderRadius: 10 }} />
                    <span>1.0rem</span>
                  </div>
                  <div className={styles.radiusItem}>
                    <div className={styles.radiusPreview} style={{ borderRadius: 12 }} />
                    <span>1.2rem</span>
                  </div>
                  <div className={styles.radiusItem}>
                    <div className={styles.radiusPreview} style={{ borderRadius: 999 }} />
                    <span>999px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: User Flow Diagram */}
        <div className={styles.sectionWide}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>05</span>
            <h2 className={styles.sectionTitle}>User Flow Diagram</h2>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.flowContainer}>
              {/* Main Flow */}
              <div className={styles.flowRow}>
                <FlowNode label="Page Load">
                  <div className={styles.flowMiniPage}>
                    <div className={styles.flowMiniLeft}>
                      <div className={styles.flowMiniTab} />
                      <div className={styles.flowMiniCard} />
                    </div>
                    <div className={styles.flowMiniRight}>
                      <div className={styles.flowMiniEmpty}>📋</div>
                    </div>
                  </div>
                </FlowNode>

                <FlowArrow label="Card Click" />

                <FlowNode label="Card Selected">
                  <div className={styles.flowMiniPage}>
                    <div className={styles.flowMiniLeft}>
                      <div className={styles.flowMiniTab} />
                      <div className={`${styles.flowMiniCard} ${styles.flowMiniCardActive}`} />
                    </div>
                    <div className={styles.flowMiniRight}>
                      <div className={styles.flowMiniContent} />
                    </div>
                  </div>
                </FlowNode>

                <FlowArrow label="Execute" />

                <FlowNode label="Loading">
                  <div className={styles.flowMiniLoading}>
                    <div className={styles.flowMiniSpinner} />
                    <span>Preparing draft…</span>
                  </div>
                </FlowNode>

                <FlowArrow label="Draft Ready" />

                <FlowNode label="Inline Chat / Email">
                  <div className={styles.flowMiniChat}>
                    <div className={styles.flowMiniBubble} />
                    <div className={`${styles.flowMiniBubble} ${styles.flowMiniBubbleUser}`} />
                  </div>
                </FlowNode>

                <FlowArrow label="Approve" />

                <FlowNode label="Countdown">
                  <div className={styles.flowMiniCountdown}>
                    <div className={styles.flowMiniRing} />
                    <span>✓ 5s</span>
                  </div>
                </FlowNode>

                <FlowArrow label="Auto Close" />

                <FlowNode label="Closed">
                  <div className={styles.flowMiniClosed}>✓</div>
                </FlowNode>
              </div>

              {/* Alternate Flows */}
              <div className={styles.flowRow}>
                <FlowNode label="Card Selected">
                  <div className={styles.flowMiniPage}>
                    <div className={styles.flowMiniLeft}>
                      <div className={styles.flowMiniTab} />
                      <div className={`${styles.flowMiniCard} ${styles.flowMiniCardActive}`} />
                    </div>
                    <div className={styles.flowMiniRight}>
                      <div className={styles.flowMiniContent} />
                    </div>
                  </div>
                </FlowNode>

                <FlowArrow label="Dismiss" />

                <FlowNode label="Rejected">
                  <div className={styles.flowMiniRejected}>⊘</div>
                </FlowNode>

                <FlowNode label="Card Selected" style={{ marginLeft: 40 }}>
                  <div className={styles.flowMiniPage}>
                    <div className={styles.flowMiniLeft}>
                      <div className={styles.flowMiniTab} />
                      <div className={`${styles.flowMiniCard} ${styles.flowMiniCardActive}`} />
                    </div>
                    <div className={styles.flowMiniRight}>
                      <div className={styles.flowMiniContent} />
                    </div>
                  </div>
                </FlowNode>

                <FlowArrow label="Snooze" />

                <FlowNode label="Snoozed">
                  <div className={styles.flowMiniSnoozed}>⏰</div>
                </FlowNode>

                <FlowNode label="Card Selected" style={{ marginLeft: 40 }}>
                  <div className={styles.flowMiniPage}>
                    <div className={styles.flowMiniLeft}>
                      <div className={styles.flowMiniTab} />
                      <div className={`${styles.flowMiniCard} ${styles.flowMiniCardActive}`} />
                    </div>
                    <div className={styles.flowMiniRight}>
                      <div className={styles.flowMiniContent} />
                    </div>
                  </div>
                </FlowNode>

                <FlowArrow label="Custom Instruction" />

                <FlowNode label="Custom Input">
                  <div className={styles.flowMiniCustom}>
                    <input className={styles.flowMiniInput} placeholder="Type instruction…" readOnly />
                  </div>
                </FlowNode>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
