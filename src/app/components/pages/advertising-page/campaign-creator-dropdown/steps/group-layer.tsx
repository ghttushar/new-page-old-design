import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import type { CcDraft, ProductGroup } from '../campaign-creator.types';
import { createGroup, moveProducts, renameGroup } from '../product-groups';
import GroupManager from './group-manager';
import GroupPicker, { type PickerTarget } from './group-picker';

// The picker and the manager, with their open/close state kept here, so opening one redraws only this layer
// and not the product tables underneath, which can hold thousands of rows.

export interface GroupLayerHandle {
  openPicker: (anchor: DOMRect, target: Omit<PickerTarget, 'anchor'> & { ids: string[]; after?: () => void }) => void;
  openManager: (anchor: DOMRect) => void;
  /** Groups used lately, newest first. */
  recentGroups: () => ProductGroup[];
  remember: (groupId: string) => void;
}

interface PickerState { target: PickerTarget; ids: string[]; after?: () => void }

const GroupLayer = forwardRef<GroupLayerHandle, {
  draft: CcDraft;
  onChange: (patch: Partial<CcDraft>) => void;
  /** The group whose products the table is limited to, and a way to change that. */
  viewingId: string | null;
  onView: (groupId: string | null) => void;
}>(function GroupLayer({ draft, onChange, viewingId, onView }, ref) {
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [manager, setManager] = useState<DOMRect | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const groups = draft.productGroups;
  const byId = useMemo(() => new Map(groups.map((g) => [g.id, g])), [groups]);

  const remember = (id: string) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 5));

  useImperativeHandle(ref, () => ({
    openPicker: (anchor, { ids, after, ...target }) => setPicker({ target: { anchor, ...target }, ids, after }),
    openManager: (anchor) => setManager(anchor),
    recentGroups: () => recent.map((id) => byId.get(id)).filter(Boolean).slice(0, 3) as ProductGroup[],
    remember,
  }), [recent, byId]);

  return (
    <>
      {picker && (
        <GroupPicker
          target={picker.target} groups={groups} recentIds={recent} onClose={() => setPicker(null)}
          onPick={(id) => { onChange({ productGroups: moveProducts(groups, picker.ids, id) }); if (id) remember(id); picker.after?.(); setPicker(null); }}
          onCreate={(name) => {
            const made = createGroup(draft, name, picker.ids);
            if (made.error) return made.error;
            onChange({ productGroups: made.groups });
            remember(made.groups[made.groups.length - 1].id);
            picker.after?.();
            setPicker(null);
            return null;
          }}
        />
      )}
      {manager && (
        <GroupManager
          anchor={manager} groups={groups} viewingId={viewingId} onClose={() => setManager(null)}
          onView={(id) => { onView(id); setManager(null); }}
          onRename={(id, name) => { const r = renameGroup(groups, id, name); if (r.error) return r.error; onChange({ productGroups: r.groups }); return null; }}
          onDelete={(id) => { onChange({ productGroups: groups.filter((g) => g.id !== id) }); if (viewingId === id) onView(null); }}
        />
      )}
    </>
  );
});

export default GroupLayer;
