interface Props {
  onBack: () => void;
}

export function MeetingPresentation({ onBack }: Props) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', paddingTop: 18 }}>
      <div style={{ width: 820 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span onClick={onBack} style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Back to preparation</span>
          <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>· Generated report</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', marginTop: 14 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ font: '600 18px/1.4 Inter,sans-serif', color: '#23272d' }}>Nutrabay · Weekly review report</div>
              <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>1 November 2025 · prepared for Rahul Gupta and Sneha Iyer · client-visible</div>
            </div>
            <div style={{ display: 'flex', gap: 9, flex: 'none' }}>
              <span style={{ padding: '10px 15px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif' }}>View report in MCP</span>
              <span style={{ padding: '10px 15px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b' }}>Edit</span>
            </div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Section 1 */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Section 1 · Performance</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 10 }}>
                <div style={{ background: '#fafbfd', padding: 13 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>GMV</div><div style={{ font: '600 16px/1 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>$412k</div></div>
                <div style={{ background: '#fafbfd', padding: 13 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Net margin</div><div style={{ font: '600 16px/1 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>16.4%</div></div>
                <div style={{ background: '#fafbfd', padding: 13 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>ROAS</div><div style={{ font: '600 16px/1 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>4.8</div></div>
                <div style={{ background: '#fafbfd', padding: 13 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Conversion</div><div style={{ font: '600 16px/1 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>6.4%</div></div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Section 2 · What changed and why</div>
              <div style={{ font: '400 13px/1.8 Inter,sans-serif', color: '#464646', marginTop: 10 }}>October closed 6.2% up on GMV with ad spend flat, so the growth is organic. Margin finished at 16.4% against the 18% target, held back almost entirely by a conversion drop on the hero range that began on 28 October when a catalogue push overwrote optimised listing copy. Traffic was unaffected throughout.</div>
            </div>

            {/* Section 3 */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Section 3 · What we did and what it returned</div>
              <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 120px', padding: '11px 15px', borderBottom: '1px solid #f1f2f4', font: '400 12px/1.5 Inter,sans-serif', alignItems: 'center' }}><div style={{ color: '#464646' }}>Reverted listing copy on 13 ASINs</div><div style={{ textAlign: 'right', fontWeight: 600, color: '#464646', fontStyle: 'italic' }}>+$7,100</div><div style={{ textAlign: 'right', color: '#a8763f' }}>Estimated</div></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 120px', padding: '11px 15px', borderBottom: '1px solid #f1f2f4', font: '400 12px/1.5 Inter,sans-serif', alignItems: 'center' }}><div style={{ color: '#464646' }}>Inventory reorder on 3 SKUs</div><div style={{ textAlign: 'right', fontWeight: 600, color: '#3f7d6a' }}>+$6,200</div><div style={{ textAlign: 'right', color: '#3f7d6a' }}>Verified</div></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 120px', padding: '11px 15px', font: '400 12px/1.5 Inter,sans-serif', alignItems: 'center' }}><div style={{ color: '#464646' }}>Bullet rewrite on 6 hero ASINs</div><div style={{ textAlign: 'right', fontWeight: 600, color: '#464646', fontStyle: 'italic' }}>+$5,300</div><div style={{ textAlign: 'right', color: '#6b7178' }}>Awaiting sign-off</div></div>
              </div>
              <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 9 }}>Italic figures are estimates. Only the verified line is presented as a result.</div>
            </div>

            {/* Section 4 */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Section 4 · What we are asking for</div>
              <div style={{ font: '400 13px/1.9 Inter,sans-serif', color: '#464646', marginTop: 10 }}>An approval gate on catalogue pushes so optimised copy stops being overwritten.<br />Sign-off on new bullet copy for the six hero ASINs.<br />Q4 promo dates confirmed before the 8 November lock.</div>
            </div>

            {/* MCP prompt */}
            <div style={{ border: '1px dashed #cfd4dc', borderRadius: 8, padding: 16, background: '#fbfafd' }}>
              <div style={{ font: '600 12px/1 Inter,sans-serif', color: '#5f3880' }}>Pre-populated MCP prompt</div>
              <div style={{ font: '400 12px/1.8 Inter,sans-serif', color: '#6b7178', marginTop: 9, fontFamily: 'Inter,sans-serif' }}>Build a five-slide client deck for Nutrabay's 1 November weekly review. Open with the verified $6,200 inventory recovery. Cover October at $412k GMV up 6.2%, margin 16.4% against an 18% target, and explain the conversion drop as a catalogue overwrite on 28 October. Mark the $7,100 revert and $5,300 rewrite as estimates, not results. Close with three asks: PIM approval gate, bullet copy sign-off, Q4 promo dates before 8 November.</div>
              <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 10 }}>Opens in your configured MCP — review and press enter to continue.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
