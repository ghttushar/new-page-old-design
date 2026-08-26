import { useState } from 'react';
import {
  ChatCircle,
  MagicWand,
  Eraser,
  ArrowsOut,
  Check,
  ShareNetwork,
  DownloadSimple,
  Sparkle,
  Image as ImageIcon,
} from '@phosphor-icons/react';
import { ShareMenu } from '../../share-menu';
import { useDispatch } from 'react-redux';
import { approveDecision } from '@/redux/slices/signals/signals.slice';
import styles from './inline.module.scss';

interface InlineImageEditorProps {
  decision: {
    id: string;
    insight: string;
    valueCaption: string;
    actionVerb: string;
  };
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400/ddd/888?text=Mannequin+Original';
const VARIANT_IMAGES = [
  'https://via.placeholder.com/400x400/fff/000?text=Variant+1',
  'https://via.placeholder.com/400x400/fff/000?text=Variant+2',
  'https://via.placeholder.com/400x400/fff/000?text=Variant+3',
];

export function InlineImageEditor({ decision }: InlineImageEditorProps) {
  const dispatch = useDispatch();

  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleCanvasClick = () => {
    if (!generated) {
      setGenerated(true);
      setSelectedVariant(0);
    }
    setToolbarOpen(!toolbarOpen);
  };

  const handleVariantSelect = (index: number) => {
    setSelectedVariant(index);
  };

  const handleGenerate = () => {
    if (!generated) {
      setGenerated(true);
      setSelectedVariant(0);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedVariant !== null ? VARIANT_IMAGES[selectedVariant] : PLACEHOLDER_IMAGE;
    link.download = `generated-image-${Date.now()}.png`;
    link.click();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
  };

  const handleToolbarAction = (action: string) => {
    console.log('Toolbar action:', action);
    setToolbarOpen(false);
  };

  return (
    <div className={styles.imageEditor}>
      <div
        className={`${styles.imageCanvas} ${generated ? styles.imageCanvasSelected : ''}`}
        onClick={handleCanvasClick}
      >
        {!generated && (
          <div className={styles.imagePlaceholder}>
            <ImageIcon size={48} className={styles.placeholderIcon} />
            <span className={styles.placeholderText}>
              {decision.insight}
            </span>
            <span className={styles.nonCompliantBadge}>
              <ImageIcon size={12} /> Non-compliant image
            </span>
            <span style={{ fontSize: '0.9rem', color: '#77469b', fontWeight: 500 }}>
              Click to generate compliant variants
            </span>
          </div>
        )}

        {generated && (
          <div className={styles.variantsGrid}>
            {VARIANT_IMAGES.map((src, idx) => (
              <div
                key={idx}
                className={`${styles.variantCard} ${selectedVariant === idx ? styles.selected : ''}`}
                onClick={() => handleVariantSelect(idx)}
              >
                <img src={src} alt={`Variant ${idx + 1}`} className={styles.variantImage} />
                <div className={styles.variantOverlay}>
                  {selectedVariant === idx && <Check size={24} className={styles.variantCheck} />}
                </div>
                <span className={styles.variantLabel}>Variant {idx + 1}</span>
              </div>
            ))}
          </div>
        )}

        {toolbarOpen && generated && (
          <div className={styles.imageToolbar}>
            <button className={styles.toolbarBtn} onClick={() => handleToolbarAction('comment')}>
              <ChatCircle size={16} />
            </button>
            <span className={styles.toolbarDivider} />
            <button className={styles.toolbarBtn} onClick={() => handleToolbarAction('remove-bg')}>
              <MagicWand size={16} />
            </button>
            <button className={styles.toolbarBtn} onClick={() => handleToolbarAction('erase')}>
              <Eraser size={16} />
            </button>
            <button className={styles.toolbarBtn} onClick={() => handleToolbarAction('resize')}>
              <ArrowsOut size={16} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.imageInputArea}>
        <textarea
          className={styles.describeInput}
          placeholder="Describe edits (e.g., 'Make background pure white #FFFFFF, remove mannequin, keep ghost mannequin shape')"
          value={editPrompt}
          onChange={(e) => setEditPrompt(e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.imageActions}>
        <div className={styles.imageHint}>
          <Sparkle size={12} /> {' '}AI generates 3 variants in {'<30s'}
        </div>
        <div className={styles.imageActionsRight}>
          <ShareMenu itemLabel={decision.insight} compact />
          <button
            className={styles.copyBtn}
            onClick={handleDownload}
            title="Download image"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.4rem 0.8rem',
              borderRadius: '0.6rem',
              border: '1px solid #e1e4e8',
              background: 'white',
              color: '#7c7c7c',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#77469b'; e.currentTarget.style.color = '#77469b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e1e4e8'; e.currentTarget.style.color = '#7c7c7c'; }}
          >
            <DownloadSimple size={14} /> Download
          </button>
          <button
            className={styles.copyBtn}
            onClick={handleGenerate}
            disabled={generated && selectedVariant === null}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.4rem 1.2rem',
              borderRadius: '0.6rem',
              border: 'none',
              background: '#77469b',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: generated && selectedVariant === null ? 'not-allowed' : 'pointer',
              opacity: generated && selectedVariant === null ? 0.6 : 1,
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#9551ab'; }}
            onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#77469b'; }}
          >
            <Sparkle size={14} /> {generated ? 'Generate' : 'Generate variants'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InlineImageEditor;