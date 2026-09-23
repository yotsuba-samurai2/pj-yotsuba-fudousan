-- Extend the existing property store; no new public table or access policy.
ALTER TYPE "PropertyDealType" ADD VALUE IF NOT EXISTS 'rental';
