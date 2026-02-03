'use client';

import React, { ReactNode } from 'react';
import { LanguageProvider } from '@/components/LanguageSelector';

export function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
