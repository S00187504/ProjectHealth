"use client"

import { Calendar, Clock, AlertTriangle } from "lucide-react"
import type { Appointment } from "../appointment.interface"
import { useEffect, useState, useMemo } from "react"

interface KpiCardsProps {
  appointments: Appointment[]
}

export default function KpiCards({ appointments }: KpiCardsProps) {
  // Instead of calculating in a useEffect, use useMemo to avoid unnecessary state updates
  const stats = useMemo(() => {
    if (!appointments || !Array.isArray(appointments) || appointments.length === 0) {
      return {
        scheduledCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
      };
    }

    // Calculate KPIs using case-insensitive comparison
    const scheduledCount = appointments.filter(
      (app) => app?.status?.toLowerCase() === "scheduled"
    ).length;
    
    const pendingCount = appointments.filter(
      (app) => app?.status?.toLowerCase() === "pending"
    ).length;
    
    const cancelledCount = appointments.filter(
      (app) => app?.status?.toLowerCase() === "cancelled" || 
               app?.status?.toLowerCase() === "canceled"
    ).length;

    return {
      scheduledCount,
      pendingCount,
      cancelledCount,
    };
  }, [appointments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-[#D7EDED]/30 dark:from-[#D7EDED]/20 to-[#D7EDED]/30 dark:to-[#D7EDED]/0 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <Calendar className="text-yellow-400 h-8 w-8" />
          <span className="text-3xl font-bold">{stats.scheduledCount}</span>
        </div>
        <p className="mt-4 text-gray-400">Total number of scheduled appointments</p>
      </div>

      <div className="bg-gradient-to-br from-[#D7EDED]/30 dark:from-[#D7EDED]/20 to-[#D7EDED]/30 dark:to-[#D7EDED]/0 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <Clock className="text-purple-500 h-8 w-8" />
          <span className="text-3xl font-bold">{stats.pendingCount}</span>
        </div>
        <p className="mt-4 text-gray-400">Total number of pending appointments</p>
      </div>

      <div className="bg-gradient-to-br from-[#D7EDED]/30 dark:from-[#D7EDED]/20 to-[#D7EDED]/30 dark:to-[#D7EDED]/0 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <AlertTriangle className="text-red-500 h-8 w-8" />
          <span className="text-3xl font-bold">{stats.cancelledCount}</span>
        </div>
        <p className="mt-4 text-gray-400">Total number of cancelled appointments</p>
      </div>
    </div>
  )
}

