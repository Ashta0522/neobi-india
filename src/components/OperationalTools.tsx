'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Users, Truck, ExternalLink, Search, Briefcase,
  MapPin, IndianRupee, Building, CheckCircle, AlertTriangle,
  Plus, Minus, TrendingUp, TrendingDown, UtensilsCrossed, Coffee,
  Leaf, Wheat, Milk, Fish, Egg, ShoppingCart, Trash2
} from 'lucide-react';
import { useNeoBIStore } from '@/lib/store';

// ==================== INVENTORY CONTROL ====================
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderPoint: number;
  safetyStock: number;
  leadTimeDays: number;
  costPerUnit: number;
  expiryDays?: number;
}

// Industry-specific inventory templates
const INVENTORY_TEMPLATES: Record<string, Array<{ name: string; category: string; unit: string; reorderPoint: number; safetyStock: number; costPerUnit: number; expiryDays?: number }>> = {
  // F&B Templates
  'North Indian': [
    { name: 'Basmati Rice', category: 'Grains', unit: 'kg', reorderPoint: 50, safetyStock: 20, costPerUnit: 120 },
    { name: 'Wheat Flour (Atta)', category: 'Grains', unit: 'kg', reorderPoint: 40, safetyStock: 15, costPerUnit: 45 },
    { name: 'Paneer', category: 'Dairy', unit: 'kg', reorderPoint: 10, safetyStock: 5, costPerUnit: 350, expiryDays: 7 },
    { name: 'Ghee', category: 'Dairy', unit: 'kg', reorderPoint: 5, safetyStock: 2, costPerUnit: 550 },
    { name: 'Fresh Vegetables', category: 'Produce', unit: 'kg', reorderPoint: 30, safetyStock: 10, costPerUnit: 60, expiryDays: 3 },
    { name: 'Spice Mix (Garam Masala)', category: 'Spices', unit: 'kg', reorderPoint: 3, safetyStock: 1, costPerUnit: 400 },
    { name: 'Cooking Oil', category: 'Oil', unit: 'L', reorderPoint: 20, safetyStock: 8, costPerUnit: 150 },
    { name: 'Yogurt/Curd', category: 'Dairy', unit: 'kg', reorderPoint: 15, safetyStock: 5, costPerUnit: 80, expiryDays: 5 },
  ],
  'South Indian': [
    { name: 'Idli Rice', category: 'Grains', unit: 'kg', reorderPoint: 40, safetyStock: 15, costPerUnit: 80 },
    { name: 'Urad Dal', category: 'Pulses', unit: 'kg', reorderPoint: 20, safetyStock: 8, costPerUnit: 140 },
    { name: 'Coconut', category: 'Produce', unit: 'pcs', reorderPoint: 50, safetyStock: 20, costPerUnit: 35 },
    { name: 'Coconut Oil', category: 'Oil', unit: 'L', reorderPoint: 15, safetyStock: 5, costPerUnit: 200 },
    { name: 'Curry Leaves', category: 'Herbs', unit: 'bunch', reorderPoint: 30, safetyStock: 10, costPerUnit: 10, expiryDays: 4 },
    { name: 'Sambar Powder', category: 'Spices', unit: 'kg', reorderPoint: 5, safetyStock: 2, costPerUnit: 280 },
    { name: 'Tamarind', category: 'Spices', unit: 'kg', reorderPoint: 3, safetyStock: 1, costPerUnit: 120 },
  ],
  'Cafe/Bakery': [
    { name: 'Coffee Beans', category: 'Beverages', unit: 'kg', reorderPoint: 10, safetyStock: 4, costPerUnit: 800 },
    { name: 'Milk', category: 'Dairy', unit: 'L', reorderPoint: 50, safetyStock: 20, costPerUnit: 55, expiryDays: 3 },
    { name: 'All Purpose Flour (Maida)', category: 'Grains', unit: 'kg', reorderPoint: 30, safetyStock: 10, costPerUnit: 50 },
    { name: 'Sugar', category: 'Sweeteners', unit: 'kg', reorderPoint: 25, safetyStock: 10, costPerUnit: 45 },
    { name: 'Butter', category: 'Dairy', unit: 'kg', reorderPoint: 8, safetyStock: 3, costPerUnit: 500, expiryDays: 14 },
    { name: 'Eggs', category: 'Protein', unit: 'pcs', reorderPoint: 100, safetyStock: 40, costPerUnit: 7, expiryDays: 14 },
    { name: 'Chocolate', category: 'Sweeteners', unit: 'kg', reorderPoint: 5, safetyStock: 2, costPerUnit: 450 },
  ],
  'Street Food': [
    { name: 'Potatoes', category: 'Produce', unit: 'kg', reorderPoint: 50, safetyStock: 20, costPerUnit: 30 },
    { name: 'Chickpea Flour (Besan)', category: 'Grains', unit: 'kg', reorderPoint: 20, safetyStock: 8, costPerUnit: 90 },
    { name: 'Chaat Masala', category: 'Spices', unit: 'kg', reorderPoint: 3, safetyStock: 1, costPerUnit: 250 },
    { name: 'Sev/Papdi', category: 'Ready Items', unit: 'kg', reorderPoint: 15, safetyStock: 5, costPerUnit: 180 },
    { name: 'Green Chutney', category: 'Condiments', unit: 'kg', reorderPoint: 5, safetyStock: 2, costPerUnit: 100, expiryDays: 3 },
    { name: 'Tamarind Chutney', category: 'Condiments', unit: 'kg', reorderPoint: 5, safetyStock: 2, costPerUnit: 80, expiryDays: 7 },
  ],

  // Consulting & Services Templates
  'Tech Consulting': [
    { name: 'Laptop/MacBook', category: 'Equipment', unit: 'units', reorderPoint: 2, safetyStock: 1, costPerUnit: 80000 },
    { name: 'Software Licenses (Annual)', category: 'Software Licenses', unit: 'units', reorderPoint: 10, safetyStock: 5, costPerUnit: 5000 },
    { name: 'Cloud Credits (AWS/GCP)', category: 'Cloud Services', unit: 'units', reorderPoint: 5, safetyStock: 2, costPerUnit: 10000 },
    { name: 'Training Materials', category: 'Training Materials', unit: 'sets', reorderPoint: 20, safetyStock: 10, costPerUnit: 500 },
    { name: 'Business Cards', category: 'Marketing Collateral', unit: 'pcs', reorderPoint: 500, safetyStock: 200, costPerUnit: 5 },
    { name: 'Presentation Templates', category: 'Client Materials', unit: 'sets', reorderPoint: 5, safetyStock: 2, costPerUnit: 2000 },
  ],
  'Consulting': [
    { name: 'Presentation Materials', category: 'Client Materials', unit: 'sets', reorderPoint: 10, safetyStock: 5, costPerUnit: 1000 },
    { name: 'Research Reports', category: 'Training Materials', unit: 'units', reorderPoint: 5, safetyStock: 2, costPerUnit: 5000 },
    { name: 'Office Stationery', category: 'Office Supplies', unit: 'sets', reorderPoint: 20, safetyStock: 10, costPerUnit: 500 },
    { name: 'Travel Budget', category: 'Travel & Events', unit: 'units', reorderPoint: 10, safetyStock: 5, costPerUnit: 15000 },
    { name: 'Software Tools', category: 'Software Licenses', unit: 'units', reorderPoint: 5, safetyStock: 2, costPerUnit: 3000 },
    { name: 'Marketing Brochures', category: 'Marketing Collateral', unit: 'pcs', reorderPoint: 100, safetyStock: 50, costPerUnit: 50 },
  ],

  // SaaS & Tech Templates
  'SaaS': [
    { name: 'AWS/Cloud Credits', category: 'Infrastructure', unit: 'units', reorderPoint: 5, safetyStock: 2, costPerUnit: 50000 },
    { name: 'Development Tools (JetBrains, etc.)', category: 'Development Tools', unit: 'licenses', reorderPoint: 10, safetyStock: 5, costPerUnit: 15000 },
    { name: 'Marketing Automation Tools', category: 'Marketing', unit: 'licenses', reorderPoint: 3, safetyStock: 1, costPerUnit: 20000 },
    { name: 'Customer Support Tools', category: 'Software Licenses', unit: 'licenses', reorderPoint: 5, safetyStock: 2, costPerUnit: 10000 },
    { name: 'Security & Compliance Tools', category: 'Software Licenses', unit: 'licenses', reorderPoint: 3, safetyStock: 1, costPerUnit: 25000 },
    { name: 'Office Equipment', category: 'Office Supplies', unit: 'units', reorderPoint: 5, safetyStock: 2, costPerUnit: 30000 },
  ],

  // Retail Templates
  'Retail': [
    { name: 'Merchandise Stock', category: 'Merchandise', unit: 'units', reorderPoint: 100, safetyStock: 50, costPerUnit: 500 },
    { name: 'Shopping Bags', category: 'Packaging', unit: 'pcs', reorderPoint: 500, safetyStock: 200, costPerUnit: 10 },
    { name: 'Display Stands', category: 'Display Materials', unit: 'units', reorderPoint: 5, safetyStock: 2, costPerUnit: 5000 },
    { name: 'Price Tags', category: 'POS Supplies', unit: 'pcs', reorderPoint: 1000, safetyStock: 500, costPerUnit: 2 },
    { name: 'Receipt Rolls', category: 'POS Supplies', unit: 'rolls', reorderPoint: 50, safetyStock: 20, costPerUnit: 100 },
    { name: 'Gift Boxes', category: 'Packaging', unit: 'pcs', reorderPoint: 200, safetyStock: 100, costPerUnit: 50 },
  ],

  // Manufacturing Templates
  'Manufacturing': [
    { name: 'Primary Raw Material', category: 'Raw Materials', unit: 'kg', reorderPoint: 500, safetyStock: 200, costPerUnit: 100 },
    { name: 'Secondary Components', category: 'Components', unit: 'units', reorderPoint: 300, safetyStock: 100, costPerUnit: 50 },
    { name: 'Packaging Material', category: 'Packaging', unit: 'units', reorderPoint: 1000, safetyStock: 500, costPerUnit: 20 },
    { name: 'Maintenance Supplies', category: 'Maintenance Supplies', unit: 'sets', reorderPoint: 10, safetyStock: 5, costPerUnit: 5000 },
    { name: 'Safety Equipment', category: 'Maintenance Supplies', unit: 'sets', reorderPoint: 20, safetyStock: 10, costPerUnit: 2000 },
  ],

  // Generic Template
  'General': [
    { name: 'Office Supplies', category: 'Office Supplies', unit: 'sets', reorderPoint: 10, safetyStock: 5, costPerUnit: 500 },
    { name: 'Marketing Materials', category: 'Marketing', unit: 'sets', reorderPoint: 20, safetyStock: 10, costPerUnit: 1000 },
    { name: 'Equipment', category: 'Equipment', unit: 'units', reorderPoint: 3, safetyStock: 1, costPerUnit: 25000 },
  ],
};

// Backward compatibility alias
const FB_MENU_TEMPLATES = INVENTORY_TEMPLATES;

// Industry-specific inventory categories
const INDUSTRY_CATEGORIES: Record<string, string[]> = {
  // Food & Beverage
  'Food & Beverage': ['General', 'Grains', 'Dairy', 'Produce', 'Protein', 'Spices', 'Oil', 'Beverages', 'Packaging'],
  'Kirana/Grocery': ['General', 'Grains', 'Dairy', 'Produce', 'Protein', 'Spices', 'Oil', 'Beverages', 'Packaging'],
  'Restaurant': ['General', 'Grains', 'Dairy', 'Produce', 'Protein', 'Spices', 'Oil', 'Beverages', 'Packaging'],

  // Consulting & Services
  'Consulting': ['Office Supplies', 'Software Licenses', 'Training Materials', 'Marketing Collateral', 'Equipment', 'Travel & Events'],
  'Professional Services': ['Office Supplies', 'Software Licenses', 'Training Materials', 'Marketing Collateral', 'Equipment', 'Client Materials'],
  'IT Services': ['Hardware', 'Software Licenses', 'Cloud Services', 'Network Equipment', 'Office Supplies', 'Training'],

  // SaaS & Technology
  'SaaS': ['Infrastructure', 'Software Licenses', 'Cloud Services', 'Development Tools', 'Marketing', 'Office Supplies'],
  'SaaS B2B': ['Infrastructure', 'Software Licenses', 'Cloud Services', 'Development Tools', 'Marketing', 'Office Supplies'],
  'Software': ['Infrastructure', 'Software Licenses', 'Hardware', 'Development Tools', 'Cloud Services', 'Office Supplies'],
  'Fintech': ['Infrastructure', 'Compliance Tools', 'Security Services', 'Software Licenses', 'Cloud Services', 'Office Supplies'],
  'Edtech': ['Content Materials', 'Software Licenses', 'Cloud Services', 'Marketing', 'Equipment', 'Office Supplies'],

  // Retail & E-commerce
  'Retail': ['Merchandise', 'Display Materials', 'Packaging', 'POS Supplies', 'Office Supplies', 'Marketing Materials'],
  'E-commerce': ['Inventory', 'Packaging', 'Shipping Supplies', 'Marketing Materials', 'Software Tools', 'Office Supplies'],
  'D2C': ['Products', 'Packaging', 'Shipping Supplies', 'Marketing Materials', 'Raw Materials', 'Office Supplies'],
  'D2C Fashion': ['Fabrics', 'Accessories', 'Packaging', 'Labels & Tags', 'Marketing Materials', 'Office Supplies'],

  // Manufacturing
  'Manufacturing': ['Raw Materials', 'Components', 'Work in Progress', 'Finished Goods', 'Packaging', 'Maintenance Supplies'],

  // Healthcare
  'Healthcare': ['Medical Supplies', 'Pharmaceuticals', 'Equipment', 'PPE', 'Office Supplies', 'Cleaning Supplies'],
  'Pharmacy': ['Medicines', 'OTC Products', 'Medical Devices', 'Cosmetics', 'Packaging', 'Office Supplies'],

  // Education
  'Education': ['Learning Materials', 'Stationery', 'Equipment', 'Books', 'Technology', 'Office Supplies'],
  'Coaching': ['Study Materials', 'Test Papers', 'Books', 'Technology', 'Marketing Materials', 'Office Supplies'],

  // Real Estate
  'Real Estate': ['Marketing Materials', 'Signage', 'Office Supplies', 'Legal Documents', 'Client Gifts', 'Technology'],

  // Fitness & Wellness
  'Fitness': ['Equipment', 'Supplements', 'Merchandise', 'Cleaning Supplies', 'Marketing Materials', 'Office Supplies'],
  'Gym': ['Equipment', 'Supplements', 'Merchandise', 'Cleaning Supplies', 'Maintenance', 'Office Supplies'],
  'Wellness': ['Products', 'Equipment', 'Consumables', 'Marketing Materials', 'Packaging', 'Office Supplies'],

  // Agency
  'Agency': ['Software Tools', 'Marketing Assets', 'Office Supplies', 'Client Materials', 'Equipment', 'Training'],
  'Marketing Agency': ['Software Tools', 'Marketing Assets', 'Office Supplies', 'Client Materials', 'Media Inventory', 'Equipment'],

  // Logistics
  'Logistics': ['Packaging', 'Fuel', 'Vehicle Parts', 'Safety Equipment', 'Office Supplies', 'Technology'],

  // Default/Generic
  'default': ['General', 'Materials', 'Products', 'Supplies', 'Equipment', 'Marketing', 'Office Supplies'],
};

// Get categories based on industry
const getIndustryCategories = (industry: string | undefined): string[] => {
  if (!industry) return INDUSTRY_CATEGORIES['default'];

  // Check for exact match first
  if (INDUSTRY_CATEGORIES[industry]) return INDUSTRY_CATEGORIES[industry];

  // Check for partial match
  const lowerIndustry = industry.toLowerCase();
  for (const [key, categories] of Object.entries(INDUSTRY_CATEGORIES)) {
    if (lowerIndustry.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerIndustry)) {
      return categories;
    }
  }

  return INDUSTRY_CATEGORIES['default'];
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  // F&B categories
  'Grains': <Wheat size={14} className="text-amber-400" />,
  'Dairy': <Milk size={14} className="text-blue-300" />,
  'Produce': <Leaf size={14} className="text-green-400" />,
  'Protein': <Egg size={14} className="text-yellow-400" />,
  'Spices': <Coffee size={14} className="text-orange-400" />,
  'Oil': <Coffee size={14} className="text-yellow-500" />,
  'Beverages': <Coffee size={14} className="text-brown-400" />,
  // Tech/SaaS categories
  'Infrastructure': <Building size={14} className="text-purple-400" />,
  'Software Licenses': <Package size={14} className="text-blue-400" />,
  'Cloud Services': <Package size={14} className="text-cyan-400" />,
  'Hardware': <Package size={14} className="text-gray-400" />,
  // Office/Services categories
  'Office Supplies': <Package size={14} className="text-yellow-400" />,
  'Training Materials': <Package size={14} className="text-green-400" />,
  'Marketing Materials': <Package size={14} className="text-pink-400" />,
  'Equipment': <Package size={14} className="text-slate-400" />,
  // Default
  'default': <Package size={14} className="text-gray-400" />,
};

// Get appropriate template options based on industry
const getTemplateOptions = (industry: string | undefined): { key: string; label: string }[] => {
  const lowerIndustry = (industry || '').toLowerCase();

  // F&B industries
  if (lowerIndustry.includes('food') || lowerIndustry.includes('restaurant') || lowerIndustry.includes('kirana') || lowerIndustry.includes('cafe') || lowerIndustry.includes('bakery')) {
    return [
      { key: 'North Indian', label: 'North Indian Restaurant' },
      { key: 'South Indian', label: 'South Indian Restaurant' },
      { key: 'Cafe/Bakery', label: 'Cafe / Bakery' },
      { key: 'Street Food', label: 'Street Food' },
      { key: 'General', label: 'Custom / Other' },
    ];
  }

  // Consulting & Services
  if (lowerIndustry.includes('consult') || lowerIndustry.includes('professional') || lowerIndustry.includes('it service')) {
    return [
      { key: 'Tech Consulting', label: 'Tech Consulting' },
      { key: 'Consulting', label: 'Business Consulting' },
      { key: 'General', label: 'Custom / Other' },
    ];
  }

  // SaaS & Tech
  if (lowerIndustry.includes('saas') || lowerIndustry.includes('software') || lowerIndustry.includes('tech') || lowerIndustry.includes('fintech') || lowerIndustry.includes('edtech')) {
    return [
      { key: 'SaaS', label: 'SaaS Company' },
      { key: 'Tech Consulting', label: 'Tech Services' },
      { key: 'General', label: 'Custom / Other' },
    ];
  }

  // Retail
  if (lowerIndustry.includes('retail') || lowerIndustry.includes('ecommerce') || lowerIndustry.includes('d2c')) {
    return [
      { key: 'Retail', label: 'Retail Store' },
      { key: 'General', label: 'Custom / Other' },
    ];
  }

  // Manufacturing
  if (lowerIndustry.includes('manufactur')) {
    return [
      { key: 'Manufacturing', label: 'Manufacturing Unit' },
      { key: 'General', label: 'Custom / Other' },
    ];
  }

  // Default
  return [
    { key: 'General', label: 'General Business' },
    { key: 'Consulting', label: 'Services Business' },
    { key: 'SaaS', label: 'Tech Company' },
    { key: 'Retail', label: 'Retail Business' },
  ];
};

export const InventoryControlPanel: React.FC = () => {
  const { profile } = useNeoBIStore();
  const isFnB = profile?.industry === 'Food & Beverage' || profile?.industry === 'Kirana/Grocery';
  const templateOptions = getTemplateOptions(profile?.industry);
  const defaultCategory = getIndustryCategories(profile?.industry)[0] || 'General';

  const [menuType, setMenuType] = useState<string>('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', category: defaultCategory, unit: 'units', reorderPoint: 100, safetyStock: 50, costPerUnit: 100 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMenuSelector, setShowMenuSelector] = useState(items.length === 0);

  const loadMenuTemplate = (type: string) => {
    const template = INVENTORY_TEMPLATES[type as keyof typeof INVENTORY_TEMPLATES] || INVENTORY_TEMPLATES['General'];
    const newItems: InventoryItem[] = template.map((t, idx) => ({
      id: `${type}-${idx}-${Date.now()}`,
      name: t.name,
      category: t.category,
      unit: t.unit,
      currentStock: Math.floor(t.reorderPoint * 1.5), // Start with 150% of reorder point
      reorderPoint: t.reorderPoint,
      safetyStock: t.safetyStock,
      leadTimeDays: 3,
      costPerUnit: t.costPerUnit,
      expiryDays: 'expiryDays' in t ? t.expiryDays : undefined,
    }));
    setItems(newItems);
    setMenuType(type);
    setShowMenuSelector(false);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.safetyStock) return { status: 'critical', color: 'red', label: 'Critical' };
    if (item.currentStock <= item.reorderPoint) return { status: 'reorder', color: 'yellow', label: 'Reorder' };
    return { status: 'healthy', color: 'green', label: 'Healthy' };
  };

  const updateStock = (id: string, change: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, currentStock: Math.max(0, item.currentStock + change) } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (newItem.name) {
      setItems([...items, {
        id: Date.now().toString(),
        ...newItem,
        currentStock: 0,
        leadTimeDays: 3,
      }]);
      setNewItem({ name: '', category: 'General', unit: 'units', reorderPoint: 100, safetyStock: 50, costPerUnit: 100 });
      setShowAddForm(false);
    }
  };

  const criticalItems = items.filter(i => getStockStatus(i).status === 'critical');
  const reorderItems = items.filter(i => getStockStatus(i).status === 'reorder');
  const totalInventoryValue = items.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0);
  const expiringItems = items.filter(i => i.expiryDays && i.expiryDays <= 3);

  // Template selector for all industries
  if (showMenuSelector) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {isFnB ? <UtensilsCrossed className="text-cyan-400" size={20} /> : <Package className="text-cyan-400" size={20} />}
          <h3 className="font-bold text-lg text-white">Inventory Control</h3>
        </div>
        <p className="text-sm text-gray-400">
          Select a template for your {profile?.industry || 'business'} to get pre-configured inventory items
        </p>

        <div className="grid grid-cols-2 gap-3">
          {templateOptions.filter(opt => opt.key !== 'General').map((option) => (
            <button
              key={option.key}
              onClick={() => loadMenuTemplate(option.key)}
              className="p-4 bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition-all text-left"
            >
              <div className="font-bold text-cyan-200">{option.label}</div>
              <div className="text-xs text-gray-400 mt-1">
                {INVENTORY_TEMPLATES[option.key as keyof typeof INVENTORY_TEMPLATES]?.length || 0} items
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => { setShowMenuSelector(false); setItems([]); }}
          className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 text-sm"
        >
          Skip - Start Empty
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isFnB ? <UtensilsCrossed className="text-cyan-400" size={20} /> : <Package className="text-cyan-400" size={20} />}
          <div>
            <h3 className="font-bold text-lg text-white">Inventory Control</h3>
            {menuType && <span className="text-xs text-cyan-400">{menuType}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMenuSelector(true)}
            className="px-2 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 rounded-lg text-cyan-200 text-xs"
          >
            Templates
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/30 rounded-lg text-cyan-200 text-xs font-bold flex items-center gap-1"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg border border-green-500/30">
          <div className="text-[10px] text-green-400 uppercase">Items</div>
          <div className="text-lg font-bold text-green-300">{items.length}</div>
        </div>
        <div className="p-2 bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-lg border border-yellow-500/30">
          <div className="text-[10px] text-yellow-400 uppercase">Reorder</div>
          <div className="text-lg font-bold text-yellow-300">{reorderItems.length}</div>
        </div>
        <div className="p-2 bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-lg border border-red-500/30">
          <div className="text-[10px] text-red-400 uppercase">Critical</div>
          <div className="text-lg font-bold text-red-300">{criticalItems.length}</div>
        </div>
      </div>

      {/* Total Inventory Value */}
      <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-400">Total Inventory Value</div>
          <div className="text-lg font-bold text-white">₹{totalInventoryValue.toLocaleString('en-IN')}</div>
        </div>
        {expiringItems.length > 0 && (
          <div className="px-2 py-1 bg-orange-500/20 rounded text-orange-300 text-xs font-bold">
            {expiringItems.length} expiring soon
          </div>
        )}
      </div>

      {/* Add Item Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30 space-y-3"
          >
            <input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="px-3 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white text-sm"
              >
                {getIndustryCategories(profile?.industry).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="px-3 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white text-sm"
              >
                {['kg', 'g', 'L', 'ml', 'pcs', 'units', 'bunch', 'dozen'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Reorder Pt"
                value={newItem.reorderPoint}
                onChange={(e) => setNewItem({ ...newItem, reorderPoint: Number(e.target.value) })}
                className="px-2 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white text-sm"
              />
              <input
                type="number"
                placeholder="Safety"
                value={newItem.safetyStock}
                onChange={(e) => setNewItem({ ...newItem, safetyStock: Number(e.target.value) })}
                className="px-2 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white text-sm"
              />
              <input
                type="number"
                placeholder="Cost ₹"
                value={newItem.costPerUnit}
                onChange={(e) => setNewItem({ ...newItem, costPerUnit: Number(e.target.value) })}
                className="px-2 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white text-sm"
              />
            </div>
            <button
              onClick={addItem}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm font-bold"
            >
              Add Item
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Items */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No items yet. Click "Add" to start tracking inventory.
          </div>
        ) : (
          items.map((item) => {
            const status = getStockStatus(item);
            const statusColorsMap = {
              critical: { bg: 'bg-red-500', bgLight: 'bg-red-500/20', text: 'text-red-300' },
              reorder: { bg: 'bg-yellow-500', bgLight: 'bg-yellow-500/20', text: 'text-yellow-300' },
              healthy: { bg: 'bg-green-500', bgLight: 'bg-green-500/20', text: 'text-green-300' },
            };
            const statusColors = statusColorsMap[status.status as keyof typeof statusColorsMap] || statusColorsMap.healthy;

            return (
              <div key={item.id} className="p-3 bg-black/30 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[item.category] || CATEGORY_ICONS['default']}
                    <div>
                      <span className="text-sm font-semibold text-white">{item.name}</span>
                      <span className="text-[10px] text-gray-500 ml-2">{item.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors.bgLight} ${statusColors.text}`}>
                      {status.label}
                    </span>
                    <button onClick={() => deleteItem(item.id)} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    <span className="text-white font-bold">{item.currentStock}</span> {item.unit} / Reorder: {item.reorderPoint}
                    {item.expiryDays && <span className="ml-2 text-orange-400">({item.expiryDays}d shelf)</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateStock(item.id, -5)} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                      <Minus size={14} />
                    </button>
                    <button onClick={() => updateStock(item.id, 5)} className="p-1 hover:bg-green-500/20 rounded text-green-400">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${statusColors.bg} transition-all`}
                    style={{ width: `${Math.min(100, (item.currentStock / item.reorderPoint) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alerts */}
      {criticalItems.length > 0 && (
        <div className="p-3 bg-red-900/30 rounded-lg border border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 text-sm font-bold mb-2">
            <AlertTriangle size={16} />
            Critical Stock Alert
          </div>
          <ul className="text-xs text-red-200 space-y-1">
            {criticalItems.slice(0, 3).map(item => (
              <li key={item.id}>• {item.name}: Only {item.currentStock} {item.unit} left</li>
            ))}
            {criticalItems.length > 3 && <li>...and {criticalItems.length - 3} more</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

// ==================== STAFF HIRING (NAUKRI) ====================
export const StaffHiringPanel: React.FC = () => {
  const [searchRole, setSearchRole] = useState('');
  const [searchLocation, setSearchLocation] = useState('Bangalore');

  const jobRoles = [
    { role: 'Software Engineer', avgSalary: '8-15 LPA', demand: 'High' },
    { role: 'Sales Executive', avgSalary: '4-8 LPA', demand: 'High' },
    { role: 'Accountant', avgSalary: '3-6 LPA', demand: 'Medium' },
    { role: 'Marketing Manager', avgSalary: '10-20 LPA', demand: 'Medium' },
    { role: 'Operations Manager', avgSalary: '8-15 LPA', demand: 'Medium' },
    { role: 'Customer Support', avgSalary: '2-4 LPA', demand: 'High' },
  ];

  const openNaukri = (role?: string) => {
    const query = encodeURIComponent(role || searchRole || 'jobs');
    const location = encodeURIComponent(searchLocation);
    window.open(`https://www.naukri.com/${query}-jobs-in-${location}`, '_blank');
  };

  const openLinkedIn = (role?: string) => {
    const query = encodeURIComponent(role || searchRole || 'jobs');
    const location = encodeURIComponent(searchLocation);
    window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}&location=${location}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="text-purple-400" size={20} />
        <h3 className="font-bold text-lg text-white">Staff Hiring</h3>
      </div>
      <p className="text-xs text-gray-400">Find talent on Naukri, LinkedIn, and more</p>

      {/* Search */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Role / Job Title</label>
          <div className="relative">
            <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="e.g., Software Engineer"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Location</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white text-sm"
            >
              {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Remote'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => openNaukri()}
          className="py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2"
        >
          Search on Naukri <ExternalLink size={14} />
        </button>
        <button
          onClick={() => openLinkedIn()}
          className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2"
        >
          Search on LinkedIn <ExternalLink size={14} />
        </button>
      </div>

      {/* Popular Roles */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 mb-2">Popular Roles (Click to Search)</h4>
        <div className="space-y-2">
          {jobRoles.map((job) => (
            <div
              key={job.role}
              onClick={() => openNaukri(job.role)}
              className="p-3 bg-black/30 rounded-lg border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-white">{job.role}</div>
                <div className="text-xs text-gray-400">{job.avgSalary}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                job.demand === 'High' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {job.demand} Demand
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Other Platforms */}
      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
        <h5 className="text-xs font-bold text-gray-400 mb-2">Other Hiring Platforms</h5>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Indeed', url: 'https://www.indeed.co.in' },
            { name: 'Shine', url: 'https://www.shine.com' },
            { name: 'Internshala', url: 'https://internshala.com' },
            { name: 'Cutshort', url: 'https://cutshort.io' },
          ].map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-300 text-xs font-semibold flex items-center gap-1"
            >
              {platform.name} <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== SUPPLIER FINDING (INDIAMART) ====================
export const SupplierFinderPanel: React.FC = () => {
  const [searchProduct, setSearchProduct] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const categories = [
    { name: 'Raw Materials', icon: '🧱', examples: 'Steel, Plastic, Cotton' },
    { name: 'Packaging', icon: '📦', examples: 'Boxes, Labels, Pouches' },
    { name: 'Machinery', icon: '⚙️', examples: 'Industrial Equipment' },
    { name: 'Office Supplies', icon: '🖨️', examples: 'Furniture, Electronics' },
    { name: 'Food Ingredients', icon: '🌾', examples: 'Spices, Grains, Oil' },
    { name: 'Textiles', icon: '🧵', examples: 'Fabric, Thread, Buttons' },
  ];

  const openIndiaMart = (product?: string) => {
    const query = encodeURIComponent(product || searchProduct || 'suppliers');
    const city = searchCity ? `+in+${encodeURIComponent(searchCity)}` : '';
    window.open(`https://dir.indiamart.com/search.mp?ss=${query}${city}`, '_blank');
  };

  const openTradeIndia = (product?: string) => {
    const query = encodeURIComponent(product || searchProduct || 'suppliers');
    window.open(`https://www.tradeindia.com/search.html?keyword=${query}`, '_blank');
  };

  const openAlibaba = (product?: string) => {
    const query = encodeURIComponent(product || searchProduct || 'suppliers');
    window.open(`https://www.alibaba.com/trade/search?fsb=y&SearchText=${query}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Truck className="text-orange-400" size={20} />
        <h3 className="font-bold text-lg text-white">Supplier Finder</h3>
      </div>
      <p className="text-xs text-gray-400">Find verified suppliers on IndiaMart, TradeIndia & more</p>

      {/* Search */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Product / Material</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="e.g., Corrugated Boxes"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-orange-500/30 rounded-lg text-white text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">City (Optional)</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="e.g., Mumbai"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-orange-500/30 rounded-lg text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Search Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => openIndiaMart()}
          className="py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1"
        >
          <span>IndiaMart</span>
          <ExternalLink size={12} />
        </button>
        <button
          onClick={() => openTradeIndia()}
          className="py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1"
        >
          <span>TradeIndia</span>
          <ExternalLink size={12} />
        </button>
        <button
          onClick={() => openAlibaba()}
          className="py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1"
        >
          <span>Alibaba</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 mb-2">Popular Categories</h4>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => openIndiaMart(cat.name)}
              className="p-3 bg-black/30 rounded-lg border border-white/10 hover:border-orange-500/50 text-left transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{cat.icon}</span>
                <span className="text-sm font-semibold text-white">{cat.name}</span>
              </div>
              <div className="text-[10px] text-gray-500">{cat.examples}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
        <h5 className="text-xs font-bold text-orange-400 mb-2">💡 Supplier Tips</h5>
        <ul className="text-[10px] text-orange-200 space-y-1">
          <li>• Always verify GST registration before ordering</li>
          <li>• Request samples before bulk orders</li>
          <li>• Compare at least 3 suppliers for best prices</li>
          <li>• Check ratings and reviews on platforms</li>
          <li>• Negotiate payment terms (30-60 day credit)</li>
        </ul>
      </div>
    </div>
  );
};

export default { InventoryControlPanel, StaffHiringPanel, SupplierFinderPanel };
