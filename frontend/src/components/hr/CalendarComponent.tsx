"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Value = Date;

export default function CalendarComponent() {
  const [value, setValue] = useState<Value>(new Date());

  // örnek "reminder" günleri
  const reminderDates = [
    new Date(2025, 4, 10),
    new Date(2025, 4, 12),
    new Date(2025, 4, 20),
  ];

  const tileContent = ({ date }: { date: Date }) => {
    const match = reminderDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );
    return match ? <div className="text-red-500 text-xs">🔔</div> : null;
  };

  return (
    <Calendar
      className="w-full rounded-lg border-none shadow-md dark:bg-gray-800 dark:text-white react-calendar rounded w-full min-h-96 max-h-96"
      onChange={(val) => {
        if (val instanceof Date) setValue(val);
      }}
      value={value}
      tileContent={tileContent}
    />
  );
}
