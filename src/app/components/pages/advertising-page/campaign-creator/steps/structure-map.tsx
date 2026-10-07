// @ts-nocheck -- presentation-only map for the ported creator
import { motion } from 'motion/react';
import { type CcCampaign, type CcProduct, type StructureId } from '../campaign-creator.types';

export function groupCampaigns(campaigns: CcCampaign[], products: CcProduct[]) {
  const groups = new Map();
  campaigns.forEach((campaign) => {
    const scoped = campaign.productIds.length === 1;
    const key = scoped ? campaign.productIds[0] : 'all';
    if (!groups.has(key)) {
      const product = scoped ? products.find((item) => item.id === key) : undefined;
      groups.set(key, {
        key,
        title: scoped ? (product?.title ?? 'Product') : `All ${products.length} products`,
        productScoped: scoped,
        campaigns: [],
      });
    }
    groups.get(key)?.campaigns.push(campaign);
  });
  return Array.from(groups.values());
}

const shortTarget = (campaign: CcCampaign) => {
  if (campaign.kind === 'auto') return campaign.targetingLabel.replace('Automatic', 'Auto');
  const types = Array.from(new Set(campaign.adGroups.flatMap((group) => group.targets.map((target) => target.matchType))));
  return types.length > 2 ? `${types.slice(0, 2).join(', ')} +${types.length - 2}` : types.join(', ') || 'Manual targets';
};

function ProductNode({ title, count }: { title: string; count: number }) {
  return (
    <div className="cc-tree-product">
      <span className="cc-tree-product__glyph" aria-hidden>
        <svg viewBox="0 0 18 18"><path d="M9 2.2 15 5.4v7.2L9 15.8 3 12.6V5.4Z"/><path d="m3 5.4 6 3.3 6-3.3M9 8.7v7.1"/></svg>
      </span>
      <span><small>Product scope</small><strong title={title}>{title}</strong><em>{count} selected</em></span>
    </div>
  );
}

function CampaignBranch({ campaign, index }: { campaign: CcCampaign; index: number }) {
  const adGroups = campaign.adGroups.length;
  const targetCount = campaign.adGroups.reduce((total, group) => total + group.targets.length, 0);
  return (
    <motion.div className="cc-tree-branch" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .045 }}>
      <div className="cc-tree-campaign">
        <span className={`cc-tree-shape cc-tree-shape--${campaign.kind}`} aria-hidden><b>{campaign.kind === 'auto' ? 'A' : 'M'}</b></span>
        <span><small>{campaign.kind} campaign</small><strong title={campaign.name}>{campaign.name}</strong></span>
      </div>
      <span className="cc-tree-link" aria-hidden />
      <div className="cc-tree-leaf cc-tree-leaf--group">
        <span aria-hidden>AG</span><div><strong>{adGroups} ad group{adGroups === 1 ? '' : 's'}</strong><small>{targetCount} targets</small></div>
      </div>
      <span className="cc-tree-link" aria-hidden />
      <div className="cc-tree-leaf cc-tree-leaf--target">
        <span aria-hidden>T</span><div><strong title={shortTarget(campaign)}>{shortTarget(campaign)}</strong><small>{campaign.kind === 'auto' ? 'Discovery' : 'Controlled'}</small></div>
      </div>
    </motion.div>
  );
}

export function StructureMap({ structureId, campaigns, products }: { structureId: StructureId; campaigns: CcCampaign[]; products: CcProduct[] }) {
  if (campaigns.length === 0) return null;
  const groups = groupCampaigns(campaigns, products);
  const visibleGroups = groups.slice(0, 3);
  let shown = 0;
  const maxBranches = 5;

  return (
    <div className="cc-tree-map" data-structure={structureId} aria-label="Campaign hierarchy">
      <div className="cc-tree-key" aria-hidden>
        <span><i className="cc-tree-key__auto" />Auto</span><span><i className="cc-tree-key__manual" />Manual</span><span><i className="cc-tree-key__group" />Ad group</span><span><i className="cc-tree-key__target" />Targeting</span>
      </div>
      <div className="cc-tree-groups">
        {visibleGroups.map((group, groupIndex) => {
          const remaining = Math.max(0, maxBranches - shown);
          const visible = group.campaigns.slice(0, remaining);
          shown += visible.length;
          if (!visible.length) return null;
          return (
            <motion.section className="cc-tree-group" key={group.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: groupIndex * .06 }}>
              <ProductNode title={group.title} count={group.productScoped ? 1 : products.length} />
              <div className="cc-tree-fork" aria-hidden />
              <div className="cc-tree-branches">
                {visible.map((campaign, index) => <CampaignBranch key={campaign.id} campaign={campaign} index={shown - visible.length + index} />)}
              </div>
            </motion.section>
          );
        })}
        {campaigns.length > shown && (
          <div className="cc-tree-more"><span>+{campaigns.length - shown}</span><div><strong>more campaign branches</strong><small>Same hierarchy, collapsed for clarity</small></div></div>
        )}
      </div>
    </div>
  );
}