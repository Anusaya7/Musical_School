'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings-defaults'

interface SiteSettingsContextType {
  settings: Record<string, any>
  loading: boolean
  updateSetting: (key: string, value: any) => Promise<boolean>
  refreshSettings: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, any>>(DEFAULT_SITE_SETTINGS)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/site-settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.warn('Failed to fetch site settings, using defaults', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const updateSetting = async (key: string, value: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      })
      if (res.ok) {
        // Update local state immediately
        setSettings(prev => ({
          ...prev,
          [key]: value
        }))
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to update setting', err)
      return false
    }
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSetting, refreshSettings: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider')
  }
  return context
}
