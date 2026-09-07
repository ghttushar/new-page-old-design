import type { ActionType } from './action-types.constants';
import { ACTION_TYPES } from './action-types.constants';

/**
 * Full mapping of every alert reason from the source alert-reasoning spec
 * ("Alerts - reasoning.pdf") to the action type that should be recommended
 * when a user works that alert. `guidance` is the condensed remediation
 * text from the source doc — not a full mock alert, just the reference row.
 */
export type AlertInsightGroup =
  | 'Advertising Eligibility'
  | 'Search Suppressed'
  | 'Listing Suppressed'
  | 'Product Policy Violation'
  | 'Inactive Listing'
  | 'Content'
  | 'Price Change'
  | 'Buy Box'
  | 'Negative Rating'
  | 'Billing'
  | 'Inventory Issue'
  | 'Shipment Issue';

export interface AlertReasonMapping {
  group: AlertInsightGroup;
  reason: string;
  guidance: string;
  actionTypeId: string;
}

export const ALERT_REASON_CATALOG: AlertReasonMapping[] = [
  // --- Advertising Eligibility / Product Policy (page 1) ---
  { group: 'Advertising Eligibility', reason: "Appetite suppressants or fat burners aren't allowed.", guidance: 'Verify the product against the Amazon appetite-suppressant/fat-burner policy; if flagged in error, or if the brand holds the required certifications, draft a Seller Central case with the certification attached.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: 'Content or products related to drug abuse, illicit drugs, or drug paraphernalia are not allowed.', guidance: 'Verify the product and its imagery/content are not drug-related; raise a support ticket if Amazon mis-attributed the product.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: 'Drug paraphernalia or products related to illicit drugs are not allowed.', guidance: 'Verify the product and its imagery/content are not drug-related; raise a support ticket if Amazon mis-attributed the product.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: 'Images that include partial nudity must meet image guidelines for sexual content.', guidance: 'Check the images for nudity/sexual content; replace the image, or raise a ticket if incorrectly tagged.', actionTypeId: 'update-product-images' },
  { group: 'Advertising Eligibility', reason: 'Parent products cannot be advertised because they cannot be purchased.', guidance: 'Add a purchasable child product — no further action needed on the parent.', actionTypeId: 'fix-listing-data' },
  { group: 'Advertising Eligibility', reason: 'Partial nudity is not allowed.', guidance: 'Check the images for nudity/sexual content; replace the image, or raise a ticket if incorrectly tagged.', actionTypeId: 'update-product-images' },
  { group: 'Advertising Eligibility', reason: 'Product must have a title.', guidance: 'Update the missing title in product inventory.', actionTypeId: 'update-listing-copy' },
  { group: 'Advertising Eligibility', reason: 'Consumable product flagged for prohibited disease claims / labeling requirements.', guidance: 'Review content for prohibited pathogen/disease claims; remove or modify them, upload the Supplement/Drug Facts panel, and open an Amazon Seller Support case for reinstatement.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: 'Product must have an image.', guidance: 'Update the missing image in product inventory.', actionTypeId: 'update-product-images' },
  { group: 'Advertising Eligibility', reason: 'Product(s) must be available for sale and suitable for advertising / must be in "New" or "Collectible" condition.', guidance: 'Validate the item condition; correct the condition attribute and republish if it is actually new.', actionTypeId: 'fix-listing-data' },
  { group: 'Advertising Eligibility', reason: "Provocative apparel isn't allowed.", guidance: 'Validate and replace the images — e.g. re-upload without the face shown where that is the trigger.', actionTypeId: 'update-product-images' },
  { group: 'Advertising Eligibility', reason: "Testosterone boosters or other harmful food or supplements aren't allowed.", guidance: 'Validate the images/labeling; raise a ticket if Amazon has mis-labeled the product.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: "The content doesn't comply with policies on weapon imagery.", guidance: 'Validate the images; raise a ticket if incorrectly labeled.', actionTypeId: 'update-product-images' },
  { group: 'Advertising Eligibility', reason: "The content isn't compliant with claims policies.", guidance: 'Validate images, title, content and description for unsupported claims.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: "The product isn't compliant with weight loss and weight management policies.", guidance: 'Review claims and content against the weight-loss policy; remove unsupported claims.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: "This content or product isn't compliant with religious policies in this geographic location.", guidance: 'Verify content/imagery against the local religious-content policy and raise a ticket.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: 'This product is either missing important information or contains incorrect information.', guidance: 'Review and correct the flagged field in product inventory.', actionTypeId: 'fix-listing-data' },
  { group: 'Advertising Eligibility', reason: 'Your ad contains a product or content that is prohibited for advertising.', guidance: 'Identify the prohibited element and remove or correct it before resubmitting for advertising.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Advertising Eligibility', reason: "This product's cost to Amazon does not allow us to meet customers' pricing expectations.", guidance: 'Consider reducing cost; eligibility can take a few weeks to restore after a cost reduction.', actionTypeId: 'escalate-amazon-vendor-manager' },
  { group: 'Advertising Eligibility', reason: 'ASIN ineligible due to a lower price on another marketplace (Amazon price-matched it).', guidance: 'Correct the external price first; if Amazon does not restore pricing and eligibility once the source is fixed, escalate to the Vendor Manager (1P) or draft an Ads Support case (3P).', actionTypeId: 'adjust-pricing-discount' },
  { group: 'Advertising Eligibility', reason: 'Amazon independently reduced the retail price (1P), causing ad ineligibility.', guidance: 'Engage the Amazon Vendor Manager to investigate and resolve the pricing issue.', actionTypeId: 'escalate-amazon-vendor-manager' },
  { group: 'Advertising Eligibility', reason: 'Vendor cost increase eroding Net PPM, risking ad ineligibility.', guidance: 'Escalate to the Vendor Manager with Net PPM insights; if no Vendor Manager is assigned there is generally no direct escalation path beyond correcting pricing and monitoring.', actionTypeId: 'escalate-amazon-vendor-manager' },

  // --- Search Suppressed ---
  { group: 'Search Suppressed', reason: 'Missing Required Attributes - Description', guidance: 'Generate a description from brand story + product type + primary purpose + USPs and publish.', actionTypeId: 'update-listing-copy' },
  { group: 'Search Suppressed', reason: 'Missing Required Attributes - Size or Color value', guidance: 'Generate the missing size/color attribute and let the user confirm before submitting.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Missing Product Identifier (UPC/GTIN/EAN)', guidance: 'Update the identifier if available, or select the GENERIC checkbox if the listing genuinely has none.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Missing Unit Count / Unit Value', guidance: 'Category-specific (e.g. consumables) — same remediation as a missing attribute.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Missing/Incorrect Main Image', guidance: 'Generate or request a main image on a pure white background showing the full product, then upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Main Image - Mannequin Not Permitted', guidance: 'Generate an image without the mannequin and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Suppressed due to Parent ASIN issue', guidance: 'Identify and resolve the parent ASIN issue — the child is reinstated automatically once the parent is corrected.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Main Image - Text/Logo/Watermark Not Permitted', guidance: 'Generate the same image without text/logo/watermark and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Main Image - Background Not Pure White', guidance: 'Generate a white-background version of the image and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Main Image - Product Cropped', guidance: 'Generate an uncropped image showing the full product and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Item Name Exceeds Character Limit', guidance: 'Generate a title within the 125-character limit and publish.', actionTypeId: 'update-listing-copy' },
  { group: 'Search Suppressed', reason: 'Main Image - Prohibited Badging', guidance: 'Generate the image without badges/awards/certification marks and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Potential Duplicate ASIN', guidance: 'Confirm whether the referenced ASIN is a genuine duplicate (same UPC/GTIN/EAN); merge/delete or raise a case confirming they are distinct products.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Main Image - Model Not Standing', guidance: 'Generate an image with the model standing and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Main Image - Human Model Not Permitted (Non-Clothing)', guidance: 'Generate a plain product shot without a human model and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Missing Required Attributes - Department', guidance: 'Update the Department attribute (Men/Women/Unisex/Kids) as applicable.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Non-Compliant Markup in Attribute', guidance: 'Strip HTML/JavaScript/markup from the flagged attribute, keeping plain text only.', actionTypeId: 'update-listing-copy' },
  { group: 'Search Suppressed', reason: 'Main Image - Product Too Small in Frame', guidance: 'Generate an image where the product fills ~70% of the frame and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Missing Required Attributes - Brand', guidance: 'Update the Brand field, or select GENERIC if unregistered.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Main Image - Prohibited Props', guidance: 'Generate the image with props removed and upload.', actionTypeId: 'update-product-images' },
  { group: 'Search Suppressed', reason: 'Missing Required Attributes - Item Dimensions', guidance: 'Update length/width/height if available, or request the dimensions from the user.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Incorrect Category or Browse Node', guidance: 'Update the classification and browse node so the product appears correctly — do not miscategorize to dodge policy requirements.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Missing Material, Fabric or Ingredient Attribute', guidance: 'Add the accurate material/fabric/ingredient information required for the category.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Missing Item Package Quantity or Number of Items', guidance: 'Enter the exact sellable-unit count, matching title, images and packaging.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Missing Model Number or Manufacturer Part Number', guidance: 'Add the correct model/part number matching manufacturer documentation.', actionTypeId: 'fix-listing-data' },
  { group: 'Search Suppressed', reason: 'Missing Age Range, Target Audience or Intended User', guidance: 'Add the appropriate age range/department/intended-user field for the category.', actionTypeId: 'fix-listing-data' },

  // --- Listing Suppressed ---
  { group: 'Listing Suppressed', reason: 'Main Image - Low Resolution / Not Zoom Eligible', guidance: 'Replace with a high-resolution image meeting the category requirement.', actionTypeId: 'update-product-images' },
  { group: 'Listing Suppressed', reason: 'Product Image Does Not Match the Actual Product', guidance: 'Replace with the exact product sold under the ASIN (shape, model, packaging, label, contents).', actionTypeId: 'update-product-images' },
  { group: 'Listing Suppressed', reason: 'Image Shows Incorrect Pack Count or Package Size', guidance: 'Reconcile the attribute vs. the image — update whichever is wrong.', actionTypeId: 'fix-listing-data' },
  { group: 'Listing Suppressed', reason: 'Image Contains Offensive, Explicit or Unsafe Content', guidance: 'Remove the non-compliant image and replace with appropriate product imagery.', actionTypeId: 'update-product-images' },

  // --- Product Policy Violation (Account Health) ---
  { group: 'Product Policy Violation', reason: 'Product Is Restricted or Prohibited for Sale', guidance: 'Review the restricted-products policy; remove the listing or submit the required approval/compliance information.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Product Policy Violation', reason: 'Misleading or Unsubstantiated Product Claims', guidance: 'Remove absolute/exaggerated claims (guaranteed, completely safe, #1, permanent, scientifically proven) lacking evidence.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Product Policy Violation', reason: 'Prohibited Medical, Disease or Treatment Claims', guidance: 'Remove diagnose/cure/treat/prevent claims unless legally authorized and Amazon-permitted.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Product Policy Violation', reason: 'Unsupported Organic, Eco-Friendly or Certification Claim', guidance: 'Remove unsupported organic/biodegradable/non-toxic/cruelty-free/certification claims, or provide documentation on request.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Product Policy Violation', reason: 'Missing, Expired or Rejected Product Compliance Documents', guidance: 'Submit current, authentic, product-specific test reports/certificates/images via the Account Health compliance request.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Product Policy Violation', reason: "Children's Product Safety Documentation Missing", guidance: 'Submit the required certificate, lab testing and packaging images matching the exact ASIN.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Product Policy Violation', reason: 'Button Cell or Battery Compliance Information Missing', guidance: 'Provide battery type/count, warning info, test documentation and packaging images.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Product Policy Violation', reason: 'Pesticide or Pest-Control Claim Without Required Registration', guidance: 'Remove pesticide claims or provide the applicable registration/compliance information.', actionTypeId: 'resolve-policy-violation' },
  { group: 'Product Policy Violation', reason: 'Adult Product or Explicit Product', guidance: 'Remove prohibited explicit imagery/language; some adult products may not be eligible for listing at all.', actionTypeId: 'resolve-policy-violation' },

  // --- Operational / performance alerts ---
  { group: 'Inactive Listing', reason: 'Inventory Available but Offer Not Active', guidance: 'Check whether inventory is stranded, reserved, compliance-blocked, or linked to an inactive listing; correct pricing/listing and re-verify.', actionTypeId: 'reactivate-inactive-listing' },
  { group: 'Content', reason: 'Performance dropped after a title/image/bullet-point change', guidance: 'Check what changed in the last 30 days and compare 7-day CTR, CVR, sessions and page views before/after.', actionTypeId: 'investigate-sales-decline' },
  { group: 'Price Change', reason: '5%+ price change vs. the 30-day average base price', guidance: 'If price increased, check whether last-30-day sales dropped materially as a result.', actionTypeId: 'fix-pricing-error' },
  { group: 'Buy Box', reason: 'Buy Box lost — sales opportunity at risk over the next 7 days', guidance: 'Investigate the Buy Box loss reason (price, availability, seller rating) and correct it.', actionTypeId: 'investigate-buy-box-suppression' },
  { group: 'Negative Rating', reason: 'Product received a negative rating', guidance: 'Check recent reviews (SERP) and show the increase/decrease trend in negative reviews.', actionTypeId: 'respond-negative-review' },
  { group: 'Billing', reason: 'Credit card failure on file', guidance: 'Update the payment method on file before it blocks advertising or order processing.', actionTypeId: 'resolve-billing-issue' },

  // --- Inventory Issue ---
  { group: 'Inventory Issue', reason: 'Warehouse Lost Inventory', guidance: 'Confirm the loss adjustment in the inventory ledger and whether an automatic reimbursement was issued; submit a case with shipment/product/carrier documentation if not.', actionTypeId: 'resolve-inventory-reimbursement-claim' },
  { group: 'Inventory Issue', reason: 'Warehouse Damaged Inventory', guidance: 'Review the damage reimbursement status and confirm eligibility; raise a case if the adjustment is missing or incorrect.', actionTypeId: 'resolve-inventory-reimbursement-claim' },
  { group: 'Inventory Issue', reason: 'Removal Order Pending', guidance: 'Check removal-order creation date, status, destination and unit count; raise a case if stuck beyond the normal processing window.', actionTypeId: 'investigate-inventory-misallocation' },
  { group: 'Inventory Issue', reason: 'Removal Order Cancelled', guidance: 'Review the cancellation reason and create a new removal order for the remaining eligible quantity.', actionTypeId: 'investigate-inventory-misallocation' },
  { group: 'Inventory Issue', reason: 'Low Inventory Level (below 1–2 weeks of supply)', guidance: 'Review sales velocity, days of cover, lead time and open inbound quantity; create a replenishment shipment early enough to avoid stock-out.', actionTypeId: 'inventory-replenishment-planning' },
  { group: 'Inventory Issue', reason: 'Excess Inventory (10+ weeks in hand)', guidance: 'Review sell-through, storage cost and upcoming demand; create a removal order or liquidate based on margin and storage duration.', actionTypeId: 'liquidation-excess-inventory' },
  { group: 'Inventory Issue', reason: 'Aged Inventory (approaching long-term storage charges)', guidance: 'Check inventory age bands (30/60/90/120/180+ days) and create a removal/liquidation order for units unlikely to sell profitably.', actionTypeId: 'liquidation-excess-inventory' },
  { group: 'Inventory Issue', reason: 'Stranded Inventory', guidance: 'Open the stranded-inventory report, identify the reason, relist/correct/map the offer or create a removal order; escalate if still stuck.', actionTypeId: 'investigate-inventory-misallocation' },
  { group: 'Inventory Issue', reason: 'Unfulfillable Inventory', guidance: 'Review the reason (customer/carrier/warehouse damaged, defective, expired) and decide return, liquidate or dispose; raise a case if none apply.', actionTypeId: 'investigate-inventory-misallocation' },
  { group: 'Inventory Issue', reason: 'FBA Capacity Limit Reached', guidance: 'Review current limit, utilization, open shipments and forecast; cancel unnecessary inbound drafts and request additional capacity for a later period.', actionTypeId: 'request-fba-capacity' },

  // --- Shipment Issue ---
  { group: 'Shipment Issue', reason: 'Maximum shipment dimensions reached', guidance: 'Check item dimensions — per Amazon policy, no side should exceed 25 inches (25x25x25 in).', actionTypeId: 'resolve-shipment-dimension-issue' },
];

export function actionTypeForReason(reason: string): ActionType | undefined {
  const row = ALERT_REASON_CATALOG.find((r) => r.reason === reason);
  return row ? ACTION_TYPES.find((a) => a.id === row.actionTypeId) : undefined;
}
